import sharp from "sharp";
import { promises as fs } from "fs";

const W = 1200;
const H = 630;

const markMeta = await sharp("public/tf-logo-mark-v2.png").metadata();
console.log("mark", markMeta.width + "x" + markMeta.height);

const mark = await sharp("public/tf-logo-mark-v2.png")
  .resize({
    width: 420,
    height: 420,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const svgText = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d2348"/>
  <text x="600" y="520" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="4" fill="#ffffff">TALENT FORMULA</text>
  <text x="600" y="562" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" letter-spacing="2" fill="#ff6a13">TF GROWTH STRATEGY</text>
</svg>`,
);

await sharp(svgText)
  .composite([{ input: mark, top: 95, left: Math.round((W - 420) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile("public/og.png");

const out = await sharp("public/og.png").metadata();
const stat = await fs.stat("public/og.png");
console.log("og", out.width + "x" + out.height, Math.round(stat.size / 1024) + "KB");
