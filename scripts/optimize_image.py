#!/usr/bin/env python3
"""
Image prep for the site. Requires: pip install pillow numpy

Modes
-----
fit         resize only, keep the whole frame            -> life.webp
crop        centre-crop to a square, then resize         -> carousel photos
key-border  pad to square on white, then flood the
            background in from the edges and make it
            transparent                                  -> product shots
key-white   make EVERY pure-white pixel transparent,
            wherever it sits                             -> turntable frames

The two keying modes are NOT interchangeable, and picking the wrong one is
the easy mistake:

  key-border only eats white that is reachable from the frame edge, so white
  *inside* the subject survives - product-photo caption text, a white label.

  key-white eats white anywhere, which is what you want when the subject is
  genuinely see-through (the computer case's panels) and enclosed white is
  really background showing through. Run it on a product shot and it will
  punch holes through any white lettering.

Examples
--------
  python3 scripts/optimize_image.py key-border site/public/making/rl-rover/pi.JPG --width 400
  python3 scripts/optimize_image.py crop site/public/making/rl-rover/rover_back.jpeg --width 900
  python3 scripts/optimize_image.py key-white captures/sensor --out site/public/making/rl-rover/bracket --width 800
"""

import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageOps

FLOOD_KEY = (255, 0, 255)  # sentinel colour the border flood paints with


def load(path):
    # phone photos carry an EXIF orientation flag that browsers honour and
    # Pillow ignores on a raw resize - without this, portrait shots come out
    # rotated 90 degrees.
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")


def key_border(img, thresh):
    """Transparent background, subject-internal white preserved."""
    s = max(img.size)
    sq = ImageOps.pad(img, (s, s), Image.LANCZOS, color=(255, 255, 255))
    # pad 1px so the flood always has a connected ring, even where the
    # subject runs right to the edge of frame
    padded = ImageOps.expand(sq, border=1, fill=(255, 255, 255))
    ImageDraw.floodfill(padded, (0, 0), FLOOD_KEY, thresh=thresh)
    flooded = padded.crop((1, 1, padded.width - 1, padded.height - 1))

    bg = np.all(np.array(flooded) == np.array(FLOOD_KEY), axis=2)
    out = sq.convert("RGBA")
    out.putalpha(Image.fromarray(np.where(bg, 0, 255).astype(np.uint8), "L"))
    return out, float(bg.mean())


def key_white(img, soft):
    """Every pure-white pixel transparent; near-white gets partial alpha so
    antialiased edges don't stair-step."""
    arr = np.array(img).astype(np.int16)
    d = 255 - arr.min(axis=2)  # distance from white
    if soft >= 255:
        alpha = np.where(d == 0, 0, 255)
    else:
        alpha = np.clip(d.astype(np.float32) / (255 - soft) * 255.0, 0, 255)
    out = img.convert("RGBA")
    out.putalpha(Image.fromarray(alpha.astype(np.uint8), "L"))
    return out, float((d == 0).mean())


def process(src, dst, mode, width, quality, thresh, soft):
    img = load(src)
    clear = 0.0

    if mode == "crop":
        s = min(img.size)
        img = ImageOps.fit(img, (s, s), Image.LANCZOS, centering=(0.5, 0.5))
    elif mode == "key-border":
        img, clear = key_border(img, thresh)
    elif mode == "key-white":
        img, clear = key_white(img, soft)

    if width and width != img.width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)

    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, "WEBP", quality=quality, method=6)
    before, after = os.path.getsize(src), os.path.getsize(dst)
    note = f"  clear {clear:.0%}" if clear else ""
    print(f"  {src.name:22} {before // 1024:5}KB -> {after // 1024:4}KB{note}")
    return before, after


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["fit", "crop", "key-border", "key-white"])
    ap.add_argument("src", help="an image, or a folder to process in bulk")
    ap.add_argument("--out", help="output file or folder (default: alongside src)")
    ap.add_argument("--width", type=int, default=800)
    ap.add_argument("--quality", type=int, default=86)
    ap.add_argument("--thresh", type=int, default=12, help="key-border tolerance")
    ap.add_argument("--soft", type=int, default=250, help="key-white edge ramp")
    args = ap.parse_args()

    src = Path(args.src)
    files = (
        sorted(
            p
            for p in src.iterdir()
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        )
        if src.is_dir()
        else [src]
    )
    if not files:
        raise SystemExit(f"no images found in {src}")

    out = Path(args.out) if args.out else (src if src.is_dir() else src.parent)
    before = after = 0
    for f in files:
        dst = out / f"{f.stem}.webp" if out.is_dir() or src.is_dir() else out
        b, a = process(
            f, dst, args.mode, args.width, args.quality, args.thresh, args.soft
        )
        before += b
        after += a
    if len(files) > 1:
        print(f"  {len(files)} images, {before // 1024}KB -> {after // 1024}KB")


if __name__ == "__main__":
    main()
