// 소원별 공유 OG 이미지 생성 — 빌드 타임 1회. 런타임에는 절대 돌지 않는다(운영비 0원).
//
//   입력  public/bujeok/{id}.png   (부적 캐릭터판, 3:4)
//   출력  public/og/{id}.jpg       (1200×630)
//
// satori 의 Workers(WASM) 빌드는 이미지를 렌더하지 못해 /api/og 안에서 부적 PNG 를
// 합성할 수 없다(app/api/og/route.tsx 주석 참조). 그래서 정적 산출물로 만들어 커밋한다.
//
//   npm run og:build
//
// 소원 목록은 lib/bujeok/catalog.ts 의 WISHES 를 그대로 읽는다 — 여기에 목록을 적지 않는다.
// 부적이 늘어나면 이 스크립트를 고칠 필요 없이 다시 실행만 하면 된다.

import { build } from "esbuild";
import sharp from "sharp";
import { mkdir, rm, access, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "bujeok");
const OUT_DIR = path.join(ROOT, "public", "og");

const W = 1200;
const H = 630;
const MARGIN_Y = 35; // 위아래 여백
const IMG_H = H - MARGIN_Y * 2; // 560
const IMG_W = Math.round((IMG_H * 3) / 4); // 420 (부적은 3:4)

/** catalog.ts(TS + "@/" 별칭)를 번들해 WISHES 를 그대로 가져온다 */
async function loadWishes() {
  const tmp = path.join(ROOT, "node_modules", ".cache", "bujeok-og", "catalog.mjs");
  await build({
    entryPoints: [path.join(ROOT, "lib", "bujeok", "catalog.ts")],
    outfile: tmp,
    bundle: true,
    format: "esm",
    platform: "node",
    alias: { "@": ROOT },
    logLevel: "silent",
  });
  const mod = await import(pathToFileURL(tmp).href);
  await rm(path.dirname(tmp), { recursive: true, force: true });
  return mod.WISHES;
}

/** #rrggbb → sharp 배경 객체 */
function rgb(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`bg 색상 형식 오류: ${hex}`);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

async function buildOne(entry) {
  const src = path.join(SRC_DIR, `${entry.id}.png`);
  await access(src); // 없으면 여기서 throw — 조용히 건너뛰지 않는다
  const bg = rgb(entry.bg);

  // contain: 원본이 정확한 3:4 가 아니어도 잘리지 않는다. 남는 자리는 같은 배경색이라 보이지 않는다.
  const charm = await sharp(src)
    .resize(IMG_W, IMG_H, { fit: "contain", background: bg })
    .toBuffer();

  const out = path.join(OUT_DIR, `${entry.id}.jpg`);
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: charm, top: MARGIN_Y, left: Math.round((W - IMG_W) / 2) }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

  // 산출물 규격 자체 검증 — 어긋나면 커밋 전에 멈춘다
  const meta = await sharp(out).metadata();
  if (meta.width !== W || meta.height !== H) {
    throw new Error(`${entry.id}.jpg 크기 오류: ${meta.width}×${meta.height}`);
  }
  return { id: entry.id, bytes: (await stat(out)).size };
}

const wishes = await loadWishes();
await mkdir(OUT_DIR, { recursive: true });

const made = [];
for (const e of wishes) made.push(await buildOne(e));

for (const m of made) console.log(`  ${m.id}.jpg  ${W}×${H}  ${(m.bytes / 1024).toFixed(0)}KB`);
console.log(`\nOG ${made.length}장 생성 완료 → public/og/`);
