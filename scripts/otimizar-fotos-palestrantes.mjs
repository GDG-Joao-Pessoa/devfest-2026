// Gera as fotos dos palestrantes servidas pelo site.
//
//   node scripts/otimizar-fotos-palestrantes.mjs
//
// Lê os originais em assets/palestrantes/fotos/<id>.(png|jpg|jpeg|webp) e grava
// public/assets/speakers/<id>.webp em 640×880 (retrato 8:11, a proporção da
// maioria das fotos). Fotos em outra proporção são recortadas pela região de
// maior destaque (normalmente o rosto). Usa o `sharp`, que já vem com o Next.
//
// O <id> é o mesmo do data/palestrantes.json. Para trocar ou adicionar uma
// foto, coloque o original na pasta de entrada e rode o script de novo.

import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const INPUT = path.join(ROOT, 'assets/palestrantes/fotos');
const OUTPUT = path.join(ROOT, 'public/assets/speakers');
const WIDTH = 640;
const HEIGHT = 880;

await mkdir(OUTPUT, { recursive: true });
const files = (await readdir(INPUT)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();

let totalIn = 0;
let totalOut = 0;
for (const file of files) {
  const id = path.parse(file).name;
  const src = path.join(INPUT, file);
  const dest = path.join(OUTPUT, `${id}.webp`);
  const { width, height } = await sharp(src).metadata();
  const sameRatio = Math.abs(width / height - WIDTH / HEIGHT) < 0.01;

  await sharp(src)
    .rotate() // respeita a orientação EXIF
    .resize(WIDTH, HEIGHT, {
      fit: 'cover',
      position: sameRatio ? 'centre' : sharp.strategy.attention,
      withoutEnlargement: false,
    })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(dest);

  const before = (await stat(src)).size;
  const after = (await stat(dest)).size;
  totalIn += before;
  totalOut += after;
  console.log(
    `${id.padEnd(40)} ${`${width}×${height}`.padEnd(10)} ${(before / 1024).toFixed(0).padStart(5)} KB → ${(after / 1024).toFixed(0).padStart(4)} KB${sameRatio ? '' : '  (recortada)'}`,
  );
}
console.log(
  `\n${files.length} fotos: ${(totalIn / 1048576).toFixed(1)} MB → ${(totalOut / 1048576).toFixed(2)} MB em ${path.relative(ROOT, OUTPUT)}`,
);
