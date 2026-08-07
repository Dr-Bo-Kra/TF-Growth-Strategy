import sharp from "sharp";
import { existsSync, renameSync, unlinkSync } from "fs";

/**
 * Flood-fill from image edges to clear connected dark background,
 * then scrub remaining near-black pixels that aren't brand ink.
 */
async function makeTransparent(src, dest, { ink = "navy" } = {}) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const visited = new Uint8Array(w * h);
  const isBgSeed = (i) => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    return Math.max(r, g, b) <= 18;
  };

  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    const i = p * 4;
    if (!isBgSeed(i)) return;
    visited[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % w;
    const y = (p - x) / w;
    data[p * 4 + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  // Second pass: remove remaining dark background / fringe, keep brand ink
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a === 0) continue;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;

    const isOrange = r > 150 && g < 170 && b < 120 && r - b > 60;
    const isNavy = b > 55 && b > r + 15 && g > 18 && g < 110;
    const isWhite = min > 70;

    if (ink === "navy" && (isOrange || isNavy)) continue;
    if (ink === "white" && (isOrange || isWhite)) continue;

    if (max <= 45) {
      data[i + 3] = 0;
      continue;
    }

    // Soft fringe: dark low-chroma leftovers
    if (max < 85 && chroma < 35 && !isNavy && !isWhite && !isOrange) {
      const soft = Math.round(((max - 25) / 60) * 255);
      data[i + 3] = Math.max(0, Math.min(a, soft));
      if (data[i + 3] < 16) data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 0 })
    .png({ compressionLevel: 9 })
    .toFile(dest);
}

const assets =
  "C:/Users/Kranthi B/.cursor/projects/c-Kranthi-s-Projects-Board-Report-Talent-Formula-Board-Cursor-Source/assets";

const jobs = [
  {
    src: `${assets}/c__Users_Kranthi_B_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_tf_logo_wide-4d0f1eb4-980d-4946-93ec-da1bac9cbb1b.png`,
    dest: "public/tf-logo-wide-v2.png",
    ink: "navy",
  },
  {
    src: `${assets}/c__Users_Kranthi_B_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_tf_logo-c3be22bf-e640-4dcb-a149-324b41b17120.png`,
    dest: "public/tf-logo-mark-v2.png",
    ink: "white",
  },
];

for (const job of jobs) {
  if (!existsSync(job.src)) throw new Error("missing " + job.src);
  await makeTransparent(job.src, job.dest, { ink: job.ink });
  const meta = await sharp(job.dest).metadata();
  const { data, info } = await sharp(job.dest)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let transparent = 0;
  let blackish = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) transparent++;
    else if (Math.max(data[i], data[i + 1], data[i + 2]) < 40) blackish++;
  }
  console.log(
    job.dest,
    meta.width + "x" + meta.height,
    "transparent%",
    ((100 * transparent) / (info.width * info.height)).toFixed(1),
    "blackish",
    blackish,
  );
}

// Visual proofs
const wide = await sharp("public/tf-logo-wide-v2.png")
  .resize({ width: 560 })
  .toBuffer();
await sharp({
  create: {
    width: 680,
    height: 130,
    channels: 4,
    background: { r: 247, g: 243, b: 233, alpha: 1 },
  },
})
  .composite([{ input: wide, gravity: "centre" }])
  .png()
  .toFile("public/_proof-wide.png");

const mark = await sharp("public/tf-logo-mark-v2.png")
  .resize({ width: 100, height: 100, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
await sharp({
  create: {
    width: 420,
    height: 170,
    channels: 4,
    background: { r: 13, g: 35, b: 72, alpha: 1 },
  },
})
  .composite([{ input: mark, left: 40, top: 35 }])
  .png()
  .toFile("public/_proof-mark.png");

console.log("proofs ready");
