from PIL import Image
import numpy as np
import json

def hex_to_hsv_uint8(hexcolor):
    swatch = Image.new('RGB', (1,1), hexcolor).convert('HSV')
    h,s,v = np.array(swatch)[0,0]
    return int(h), int(s), int(v)

def recolor(base_img, mask_path, target_hex):
    hsv = np.array(base_img.convert('HSV')).astype(np.float32)
    mask = np.array(Image.open(mask_path).convert('L')).astype(np.float32) / 255.0
    mask_bin = mask > 0.5
    target_h, target_s, target_v = hex_to_hsv_uint8(target_hex)
    orig_v = hsv[...,2]
    mean_v = orig_v[mask_bin].mean() if mask_bin.any() else 128.0
    ratio = orig_v / mean_v
    new_hsv = hsv.copy()
    new_hsv[...,0] = target_h
    new_hsv[...,1] = target_s
    new_hsv[...,2] = np.clip(target_v * ratio, 0, 255)
    new_hsv = new_hsv.astype(np.uint8)
    recolored_rgb = np.array(Image.fromarray(new_hsv, mode='HSV').convert('RGB')).astype(np.float32)
    original_rgb = np.array(base_img).astype(np.float32)
    m3 = mask[...,None]
    final = original_rgb * (1-m3) + recolored_rgb * m3
    return Image.fromarray(np.clip(final,0,255).astype(np.uint8))

base = Image.open('/mnt/user-data/uploads/CREAM_DS.jpg').convert('RGB')
OUT = 'stylelab-studio/public/model'

# tee_hex = official brand swatch. pants_hex = mapped contrast per brief.
COMBOS = {
  'jet-black':      {'tee': '#090A0F', 'pants': '#9C9FA5', 'pants_label': 'Grey'},
  'off-white':      {'tee': '#F2EFE9', 'pants': '#7A6A4F', 'pants_label': 'Olive / Khaki'},
  'slate-grey':     {'tee': '#4A4E53', 'pants': '#D8CFC0', 'pants_label': 'Warm Cream contrast'},
  'crimson-maroon': {'tee': '#5B1325', 'pants': '#C7C3BB', 'pants_label': 'Light Grey'},
  'navy-blue':      {'tee': '#1B2432', 'pants': '#F2EFE9', 'pants_label': 'Off-White'},
}

for color_id, cfg in COMBOS.items():
    step1 = recolor(base, f'{OUT}/tee-mask.png', cfg['tee'])
    step2 = recolor(step1, f'{OUT}/pants-mask.png', cfg['pants'])
    step2.save(f'{OUT}/front-{color_id}.jpg', quality=92)
    print('saved', color_id, '->', cfg['pants_label'])
