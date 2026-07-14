// 부적 카드 SVG 조합 — 목판화 까치호랑이(2도 주사+먹) 주인공 + 붓글씨 한글. 세로 3:4.
//
// 레이어: 낡은 괴황지 → 테두리 → 일월 → 큰 붓글씨 한글 → 목판화 호랑이(주인공) →
//   가슴 인장 → 福 낙관 → 보완 오행 → 브랜드.

import type { BujeokCard, CategoryId } from "@/lib/bujeok-engine";
import {
  paperBackground,
  mindaTiger,
  brushText,
  sunMoon,
  sealStamp,
  elementRoundel,
  FRAMES,
  JU,
} from "./layers";

/** 세로 3:4 */
export const CARD_W = 480;
export const CARD_H = 640;

export interface RenderOptions {
  wish?: string;
  emoji?: string;
  idPrefix?: string;
}

const SHORT_KO: Record<CategoryId, string> = {
  exam: "합격",
  interview: "합격",
  love: "사랑",
  wealth: "재물",
  health: "건강",
};

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

export function renderBujeokSvg(card: BujeokCard, opts: RenderOptions = {}): string {
  const w = CARD_W;
  const h = CARD_H;
  const id = opts.idPrefix ?? `bj-${card.background}-${card.pattern}-${card.decoration}`;
  const cx = w / 2;
  const wish = opts.wish ?? "행운";
  const ko = SHORT_KO[card.category] ?? "행운";

  const bg = paperBackground(id, card.background, w, h);
  const frame = FRAMES[((card.decoration % FRAMES.length) + FRAMES.length) % FRAMES.length](w, h);

  const sm = sunMoon(cx, 46);
  const koBrush = brushText(cx, 102, ko, 58, id);
  const tiger = `<g opacity="0.96">${mindaTiger(cx, 262, id)}</g>`;
  const chestSeal = `<g filter="url(#${id}-rough)">${sealStamp(cx, 412, card.seal, 40)}</g>`;

  const fuku = sealStamp(72, 602, "福", 32);
  const roundel =
    elementRoundel(card.background, w - 66, 596, 17) +
    `<text x="${w - 66}" y="622" text-anchor="middle" font-family="'Nanum Myeongjo',serif" font-size="10" fill="${JU}">보완</text>`;
  const label = `<text x="${cx}" y="606" text-anchor="middle" font-family="'Nanum Myeongjo','Noto Serif KR',serif" font-size="15" letter-spacing="2" fill="${JU}">${esc(wish)}</text>` +
    `<text x="${cx}" y="626" text-anchor="middle" font-family="'Nanum Myeongjo','Noto Serif KR',serif" font-size="10" letter-spacing="4" fill="${JU}" opacity="0.85">행운부적</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(wish)} 부적">
${bg}
  ${frame}
  ${sm}
  ${koBrush}
  ${tiger}
  ${chestSeal}
  ${fuku}
  ${roundel}
  ${label}
</svg>`;
}
