# Model photo pipeline (dev tools, not part of the running app)

These two scripts are how `public/model/front-*.jpg` were generated
from your studio photo. They're here so you (or whoever has Python) can
process **Back** and **Side** photos later and get the same recolor
treatment, without touching any app code.

## Requirements
```bash
pip install pillow numpy scipy
```

## Step 1 — generate masks for a new angle

Take a new photo (same model, same lighting, ideally same pose logic)
and find a few sample points that sit clearly on the tee and clearly on
the pants (as fractions of image width/height — e.g. `0.5,0.28` is the
horizontal/vertical center-ish of a typical chest). Look at the photo
and eyeball a handful of points across both the lit and shadowed sides
of each garment.

```bash
python3 build_masks.py <photo.jpg> <out_dir> tee   <tolerance> <warmth_gate> "x1,y1;x2,y2;..." "<y_min_pct>,<y_max_pct>"
python3 build_masks.py <photo.jpg> <out_dir> pants <tolerance> <warmth_gate> "x1,y1;x2,y2;..." "<y_min_pct>,<y_max_pct>"
```

- `tolerance` — how close a pixel's color must be to a seed to count as
  the same garment (start around 45–55).
- `warmth_gate` — rejects the neutral grey studio backdrop by requiring
  a minimum "warmth" (R−B difference); raise it if backdrop leaks in,
  lower it if real garment shadow gets excluded.
- `y_min_pct,y_max_pct` — a hard vertical safety clip (e.g. tee can
  never appear above the collar) so morphological cleanup can't bridge
  into skin or background.

Sanity-check visually before moving on:
```python
from PIL import Image
import numpy as np
base = Image.open('<photo.jpg>').convert('RGB')
mask = Image.open('<out_dir>/tee-mask.png')
arr = np.array(base).copy()
m = np.array(mask) > 127
arr[m] = (arr[m]*0.3 + np.array([255,0,0])*0.7).astype('uint8')
Image.fromarray(arr).save('check.png')
```
Look for: (1) full garment coverage including highlights/shadows, (2)
no bleed into skin/hair/background. Iterate tolerance/seeds/gate until
clean — this is the only manual/judgment-based step.

## Step 2 — generate the 5 recolored composites

Edit `generate_final_composites.py`'s `base = Image.open(...)` line to
point at your new angle's photo and its mask output dir, then:

```bash
python3 generate_final_composites.py
```

This writes `<angle>-<colorId>.jpg` for all 5 brand colors using the
same HSV hue/saturation-swap technique (keeps the photo's real fabric
shading, just re-hues it) as the front view.

## Step 3 — wire it into the app

1. Drop the 5 new JPEGs into `public/model/`.
2. In `lib/model-config.ts`, flip the matching flag in
   `AVAILABLE_ANGLES` to `true` (e.g. `back: true`).

That's it — `ModelStudio.tsx` and the angle toggle already know how to
find and display them; nothing else needs to change.
