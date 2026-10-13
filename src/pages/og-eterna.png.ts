// Image de partage (Open Graph, 1200 × 630) : le logo Eterna en Soft Linen sur Dark Violet,
// produite à la construction du site. À remplacer par une photo de Roxane quand le portfolio existera.
import { readFile } from 'node:fs/promises';
import logo from '../assets/eterna-logo.svg?raw';

const W = 1200, H = 630;
const logoW = 760, logoH = Math.round((logoW * 88) / 306.07);

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#160910"/>
  ${logo
    .replace('currentColor', '#EAE3D2')
    .replace('<svg ', `<svg x="${(W - logoW) / 2}" y="${(H - logoH) / 2}" width="${logoW}" height="${logoH}" `)}
</svg>`;
  let png: Uint8Array;
  try {
    const sharp = (await import('sharp')).default;
    png = new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer());
  } catch {
    // sans sharp, l'icône du site plutôt qu'un échec de la construction
    png = new Uint8Array(await readFile('public/apple-touch-icon.png'));
  }
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
