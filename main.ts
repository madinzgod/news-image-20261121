// News-image entry for Saturday 21 November 2026 (make.fun news-image-20261121).
//
// The picture of the day lives in entry.png beside this file: a one-page broadsheet
// that sums up the day's world news. This program verifies the image is a whole,
// in-limits PNG or JPEG and copies it to the output directory as entry.png.
// It runs with no network and writes the same bytes on every run.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const src = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(src);

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const isPng = PNG_MAGIC.every((b, i) => bytes[i] === b);
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
if (!isPng && !isJpeg) throw new Error('entry.png is not a whole PNG or JPEG');
if (bytes.length > 1048576) throw new Error('entry.png exceeds the 1 MiB gate limit');

// The gate also caps the frame at 1024 by 1024 pixels; for a PNG the IHDR chunk
// carries the frame size, so refuse an oversize canvas before copying it out.
if (isPng) {
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate limit`);
}

copyFileSync(src, join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'));
