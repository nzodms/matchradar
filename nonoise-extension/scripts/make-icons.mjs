/**
 * Generates the NoNoise icons (16/48/128) as real PNGs with zero dependencies:
 * raw RGBA pixels → zlib deflate → hand-built PNG chunks.
 * Design: soft dark rounded square, three muted "noise" bars, white slash.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(out, { recursive: true });

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

function png(size, pixelFn) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x, y, size);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Signed distance helpers (units relative to a 128px canvas).
const roundedRect = (x, y, s) => {
  const m = 8, r = 30;
  const cx = Math.max(Math.abs(x - s / 2) - (s / 2 - m - r), 0);
  const cy = Math.max(Math.abs(y - s / 2) - (s / 2 - m - r), 0);
  return Math.hypot(cx, cy) - r;
};
const bar = (x, y, bx, by, bw, bh) => {
  const r = bh / 2;
  const dx = Math.max(Math.abs(x - (bx + bw / 2)) - (bw / 2 - r), 0);
  const dy = Math.max(Math.abs(y - by) - 0, 0);
  return Math.hypot(dx, dy) - r;
};
const slash = (x, y) => {
  // segment from (38,90) to (90,38), thickness 9
  const ax = 38, ay = 90, bx = 90, by = 38;
  const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
  return Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay))) - 4.5;
};
const aa = (d) => Math.max(0, Math.min(1, 0.5 - d)); // 1px antialias
const mix = (a, b, t) => Math.round(a + (b - a) * t);

function pixel(px, py, size) {
  const k = 128 / size;
  const x = (px + 0.5) * k, y = (py + 0.5) * k;
  let r = 0, g = 0, b = 0, a = 0;
  const bg = aa(roundedRect(x, y, 128) / k);
  if (bg > 0) { r = 14; g = 17; b = 22; a = Math.round(bg * 255); }
  // noise bars (muted gray)
  for (const [by_, bw] of [[44, 56], [64, 40], [84, 50]]) {
    const t = aa(bar(x, y, 64 - bw / 2, by_, bw, 9) / k) * bg;
    if (t > 0) { r = mix(r, 120, t); g = mix(g, 128, t); b = mix(b, 140, t); }
  }
  // white slash on top
  const s = aa(slash(x, y) / k) * bg;
  if (s > 0) { r = mix(r, 248, s); g = mix(g, 250, s); b = mix(b, 252, s); }
  return [r, g, b, a];
}

for (const size of [16, 48, 128]) {
  writeFileSync(resolve(out, `icon-${size}.png`), png(size, pixel));
  console.log(`assets/icon-${size}.png written`);
}
