// 부적 카드 SVG 조합 렌더 — 세로형(3:4) 귀여운 부적. URL·링크 없음.
//
// 레이어: 배경(오행 파스텔) → 프레임 → 반짝이 문양 → 브랜드 → 카테고리 라벨 →
//   인장(+이모지 배지) → 보완 오행 pill → 하단 한 줄. 순수 문자열이라 서버·클라 동일.

import type { BujeokCard } from "@/lib/bujeok-engine";
import {
  backgroundLayer,
  sealLayer,
  emojiBadge,
  PATTERNS,
  DECORATIONS,
  rgba,
  JUSA,
  CREAM,
  MEOK,
} from "./layers";

/** 세로 3:4 */
export const CARD_W = 480;
export const CARD_H = 640;

export interface RenderOptions {
  /** 카테고리 라벨 (예: "시험 합격"). 없으면 생략 */
  wish?: string;
  /** 카테고리 이모지 배지 */
  emoji?: string;
  /** defs id 충돌 방지 접두어 (한 페이지 여러 카드 시 지정) */
  idPrefix?: string;
}

// 오행 → 한자 심볼
const OHAENG_SYMBOL: Record<string, string> = { 목: "木", 화: "火", 토: "土", 금: "金", 수: "水" };

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

/** 가운데 정렬 pill (라운드 배경 + 텍스트) */
function pill(cx: number, y: number, text: string, opts: { fs: number; fg: string; bg: string; bold?: boolean }): string {
  const w = Math.round(text.length * opts.fs * 0.92 + 34);
  const h = Math.round(opts.fs * 1.9);
  return `
  <g>
    <rect x="${cx - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${opts.bg}"/>
    <text x="${cx}" y="${y + 1}" text-anchor="middle" dominant-baseline="central"
      font-family="'Pretendard',system-ui,sans-serif" font-size="${opts.fs}" font-weight="${opts.bold ? 700 : 500}"
      fill="${opts.fg}">${esc(text)}</text>
  </g>`;
}

/** 카드 조합 → 완성 SVG 문자열 (세로 3:4) */
export function renderBujeokSvg(card: BujeokCard, opts: RenderOptions = {}): string {
  const w = CARD_W;
  const h = CARD_H;
  const idPrefix = opts.idPrefix ?? `bj-${card.background}-${card.pattern}-${card.decoration}`;
  const cx = w / 2;
  const cy = 300;

  const bg = backgroundLayer(idPrefix, card.colorHex, w, h);
  const deco = DECORATIONS[((card.decoration % DECORATIONS.length) + DECORATIONS.length) % DECORATIONS.length](card.colorHex, w, h);
  const motif = PATTERNS[((card.pattern % PATTERNS.length) + PATTERNS.length) % PATTERNS.length](card.colorHex, w, h);
  const seal = sealLayer(card.seal, cx, cy);
  const badge = opts.emoji ? emojiBadge(opts.emoji, cx + 74, cy - 74, 34) : "";

  const brand = `<text x="${cx}" y="66" text-anchor="middle"
      font-family="'Pretendard',system-ui,sans-serif" font-size="16" font-weight="700"
      letter-spacing="7" fill="${rgba(MEOK, 0.6)}">행운부적</text>`;

  const wishEl = opts.wish
    ? pill(cx, 108, opts.wish, { fs: 22, fg: CREAM, bg: JUSA, bold: true })
    : "";

  const sym = OHAENG_SYMBOL[card.background] ?? "";
  const elPill = pill(cx, 452, `${card.background}${sym ? `(${sym})` : ""} 기운을 채웠어요`, {
    fs: 17,
    fg: MEOK,
    bg: rgba(CREAM, 0.9),
  });

  const bottom = `<text x="${cx}" y="578" text-anchor="middle"
      font-family="'Pretendard',system-ui,sans-serif" font-size="17" font-weight="600"
      fill="${rgba(MEOK, 0.7)}">행운을 담았어요 ✨</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(opts.wish ?? "행운")} 부적 카드">
${bg}
  <g>${deco}</g>
  <g>${motif}</g>
  ${brand}
  ${wishEl}
  ${seal}
  ${badge}
  ${elPill}
  ${bottom}
</svg>`;
}
