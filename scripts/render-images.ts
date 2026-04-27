/**
 * Renders SVG sources to PNG bitmaps for browser/social previews.
 *
 *  public/favicon.svg          → public/favicon-32x32.png    (32×32)
 *  public/favicon.svg          → public/apple-touch-icon.png (180×180)
 *  src/assets/og-image.svg     → public/og-image.png         (1200×630)
 *
 * Run:  bun run images
 */

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');

type Job = {
  inputSvg: string;
  outputPng: string;
  width: number;
  height: number;
  background?: { r: number; g: number; b: number; alpha: number };
};

const JOBS: Job[] = [
  {
    inputSvg:  'public/favicon.svg',
    outputPng: 'public/favicon-32x32.png',
    width:     32,
    height:    32,
  },
  {
    inputSvg:  'public/favicon.svg',
    outputPng: 'public/apple-touch-icon.png',
    width:     180,
    height:    180,
  },
  {
    inputSvg:  'src/assets/og-image.svg',
    outputPng: 'public/og-image.png',
    width:     1200,
    height:    630,
    background: { r: 7, g: 9, b: 10, alpha: 1 },
  },
];

async function render(job: Job): Promise<void> {
  const svg = readFileSync(join(ROOT, job.inputSvg));
  const out = join(ROOT, job.outputPng);

  let pipeline = sharp(svg, { density: 384 })
    .resize(job.width, job.height, { fit: 'contain', kernel: 'lanczos3' });

  if (job.background) {
    pipeline = pipeline.flatten({ background: job.background });
  }

  await pipeline.png({ compressionLevel: 9, palette: false }).toFile(out);
  console.log(`[ok] ${job.outputPng}  (${job.width}x${job.height})`);
}

async function main(): Promise<void> {
  for (const job of JOBS) {
    await render(job);
  }
  console.log('\nDone. Re-run with `bun run images` if you change the SVGs.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
