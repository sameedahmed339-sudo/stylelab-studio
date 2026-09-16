"""
Generates two assets per garment region from a studio photo:
  1. A binary alpha MASK png (white = garment region, transparent elsewhere)
  2. A "shading" png: the ORIGINAL pixel luminosity inside the mask,
     normalized around mid-grey, transparent elsewhere. This is what
     gets layered with mix-blend-mode:multiply in the browser so a flat
     color pick still keeps the photo's real folds/shadows/highlights.

Usage: python3 build_masks.py <source.jpg> <out_dir> <region_name> <tolerance> <warmth_gate> "x1,y1;x2,y2;..."
Multiple seed points (as fractions of width/height) are unioned so both
lit and shadowed sides of a garment get captured.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

def build_mask(src_path, out_dir, region, tol, warmth_gate, seeds, y_clip=None):
    img = Image.open(src_path).convert("RGB")
    arr = np.array(img).astype(np.int16)
    h, w, _ = arr.shape

    combined = np.zeros((h, w), dtype=bool)
    seed_colors = []

    for seed_x_pct, seed_y_pct in seeds:
        sx, sy = int(w * seed_x_pct), int(h * seed_y_pct)
        seed_color = arr[sy - 4:sy + 4, sx - 4:sx + 4].reshape(-1, 3).mean(axis=0)
        seed_colors.append(seed_color)
        seed_warmth = seed_color[0] - seed_color[2]

        dist = np.linalg.norm(arr - seed_color, axis=2)
        binary = dist < tol

        if warmth_gate is not None:
            warmth = arr[..., 0] - arr[..., 2]
            if seed_warmth >= 0:
                binary &= warmth > warmth_gate
            else:
                binary &= warmth < warmth_gate

        labeled, _ = ndimage.label(binary, structure=np.ones((3, 3)))
        seed_label = labeled[sy, sx]
        if seed_label != 0:
            combined |= labeled == seed_label

    region_mask = combined

    # Hard safety clip: a garment can never appear above/below a known
    # boundary (e.g. the tee never extends above the collar line), so
    # trim before the morphological closing gets a chance to bridge
    # across that boundary into skin/background.
    if y_clip is not None:
        y_min_pct, y_max_pct = y_clip
        region_mask[: int(h * y_min_pct), :] = False
        region_mask[int(h * y_max_pct):, :] = False

    # clean up small holes/specks, then bridge gaps left by strong
    # highlights/shadows that fall outside the color tolerance band
    region_mask = ndimage.binary_closing(region_mask, structure=np.ones((15, 15)))
    region_mask = ndimage.binary_opening(region_mask, structure=np.ones((3, 3)))
    region_mask = ndimage.binary_fill_holes(region_mask)
    region_mask = ndimage.binary_dilation(region_mask, structure=np.ones((3, 3)))

    if y_clip is not None:
        y_min_pct, y_max_pct = y_clip
        region_mask[: int(h * y_min_pct), :] = False
        region_mask[int(h * y_max_pct):, :] = False

    # Hard background exclusion: regardless of how a pixel ended up
    # inside the mask (closing can bridge thin real gaps, like the
    # sliver of backdrop between two legs), never keep a pixel that
    # matches the neutral studio backdrop — bright and colorless.
    warmth_all = arr[..., 0] - arr[..., 2]
    brightness_all = arr.mean(axis=2)
    is_background = (brightness_all > 195) & (np.abs(warmth_all) < 10)
    region_mask &= ~is_background

    alpha = (region_mask * 255).astype(np.uint8)

    # feather the edges slightly so the recolor overlay blends into the
    # photo instead of showing a hard jagged cutout line
    alpha = np.array(Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(1.4)))

    # 1. pure alpha mask (used as CSS mask-image for the color overlay)
    mask_img = Image.fromarray(alpha, mode="L")
    mask_img.save(f"{out_dir}/{region}-mask.png")

    # 2. shading layer: grayscale luminosity of the original garment,
    #    renormalized to mid-grey so it multiplies neutrally with any
    #    target color instead of darkening everything toward the
    #    original garment's own color.
    gray = np.array(img.convert("L")).astype(np.float32)
    garment_vals = gray[region_mask]
    mean_val = garment_vals.mean() if garment_vals.size else 128
    shading = np.clip(gray - mean_val + 128, 0, 255).astype(np.uint8)

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0] = shading
    rgba[..., 1] = shading
    rgba[..., 2] = shading
    rgba[..., 3] = alpha
    Image.fromarray(rgba, mode="RGBA").save(f"{out_dir}/{region}-shading.png")

    print(f"{region}: seeds={len(seed_colors)}, pixels={region_mask.sum()}, mean_lum={mean_val:.1f}")

if __name__ == "__main__":
    src, out_dir, region, tol, warmth_gate = sys.argv[1:6]
    seeds_raw = sys.argv[6]
    seeds = [tuple(map(float, p.split(","))) for p in seeds_raw.split(";")]
    y_clip = None
    if len(sys.argv) > 7:
        y_clip = tuple(map(float, sys.argv[7].split(",")))
    build_mask(src, out_dir, region, float(tol), float(warmth_gate), seeds, y_clip)
