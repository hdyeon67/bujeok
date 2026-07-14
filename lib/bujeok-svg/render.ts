// 부적 카드 SVG 조합 렌더 — card 인덱스 → 완성 SVG 문자열.
//
// 레이어 순서: 배경(오행색) → 장식 테두리 → 문양 → 상단 타이틀 → 중앙 인장 →
//   기원문 → 워터마크(로고+URL). 순수 문자열이라 서버·클라이언트 동일 동작.

import type { BujeokCard } from "@/lib/bujeok-engine";
import {
  backgroundLayer,
  sealLayer,
  PATTERNS,
  DECORATIONS,
  rgba,
  JUSA,
  MEOK,
  HANJI,
} from "./layers";

export type CardRatio = "1:1" | "9:16";

export interface RenderOptions {
  /** 종횡비 — 1:1 피드용, 9:16 스토리용 (기본 1:1) */
  ratio?: CardRatio;
  /** 하단 워터마크 URL (기본 bujeok.fineboll.com) */
  watermark?: string;
  /** 상단 타이틀 (기본 "행운부적") */
  title?: string;
  /** 인장 아래 기원문 (예: 카테고리 라벨). 없으면 생략 */
  wish?: string;
  /** defs id 충돌 방지용 접두어 (한 페이지에 여러 카드 렌더 시 지정) */
  idPrefix?: string;
}

const DIMS: Record<CardRatio, { w: number; h: number }> = {
  "1:1": { w: 480, h: 480 },
  "9:16": { w: 480, h: 853 },
};

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

/** 카드 조합 → 완성 SVG 문자열 */
export function renderBujeokSvg(card: BujeokCard, opts: RenderOptions = {}): string {
  const ratio = opts.ratio ?? "1:1";
  const { w, h } = DIMS[ratio];
  const title = opts.title ?? "행운부적";
  const watermark = opts.watermark ?? "bujeok.fineboll.com";
  const idPrefix =
    opts.idPrefix ?? `bj-${card.background}-${card.pattern}-${card.decoration}-${ratio.replace(":", "x")}`;

  const cx = w / 2;
  const cy = Math.round(h * 0.46);

  const bg = backgroundLayer(idPrefix, card.colorHex, w, h);
  const deco = DECORATIONS[((card.decoration % DECORATIONS.length) + DECORATIONS.length) % DECORATIONS.length](
    card.colorHex,
    w,
    h,
  );
  const motif = PATTERNS[((card.pattern % PATTERNS.length) + PATTERNS.length) % PATTERNS.length](
    card.colorHex,
    w,
    h,
  );
  const seal = sealLayer(card.seal, cx, cy);

  const titleEl = `<text x="${cx}" y="${Math.round(h * 0.12)}" text-anchor="middle"
      font-family="'Nanum Myeongjo','Noto Serif KR',serif" font-size="26" font-weight="700"
      letter-spacing="6" fill="${MEOK}">${esc(title)}</text>`;

  const wishEl = opts.wish
    ? `<text x="${cx}" y="${cy + 108}" text-anchor="middle"
        font-family="'Noto Serif KR',serif" font-size="19" fill="${rgba(MEOK, 0.85)}">${esc(opts.wish)}</text>`
    : "";

  // 워터마크: 작은 주사색 점 로고 + URL
  const wmY = h - 26;
  const watermarkEl = `
  <g opacity="0.9">
    <circle cx="${cx - 78}" cy="${wmY - 5}" r="5" fill="${JUSA}"/>
    <text x="${cx - 66}" y="${wmY}" text-anchor="start"
      font-family="'Pretendard',system-ui,sans-serif" font-size="14" fill="${rgba(MEOK, 0.7)}">${esc(watermark)}</text>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)} 부적 카드">
${bg}
  <g>${deco}</g>
  <g>${motif}</g>
  ${titleEl}
  ${seal}
  ${wishEl}
  ${watermarkEl}
</svg>`;
}
