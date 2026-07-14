// 부적 SVG 레이어 에셋 — 배경 5 × 인장 5 × 문양 8 × 장식 4 = 800 조합.
//
// 모든 레이어는 순수 문자열(SVG 조각)을 반환한다. DOM·외부 에셋 의존이 없어
// 서버(OG 이미지)·클라이언트 양쪽에서 동일하게 동작하고, 같은 입력이면 항상
// 같은 그림이 나온다. 색은 오행 색(colorHex)에서 파생한다.

/** 주사(朱砂) 레드 — 인장 고정색 */
export const JUSA = "#c8352b";
const JUSA_DEEP = "#9e241d";
/** 한지/먹 톤 */
const HANJI = "#f5efe1";
const HANJI_DEEP = "#e7dcc2";
const MEOK = "#26221c";

/** "#rrggbb" → {r,g,b} */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** 오행색을 검정 쪽으로 amt(0~1) 섞은 hex */
function shade(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => Math.round(c * (1 - amt));
  const to2 = (c: number) => c.toString(16).padStart(2, "0");
  return `#${to2(f(r))}${to2(f(g))}${to2(f(b))}`;
}

/** 오행색 rgba 문자열 */
export function rgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// ── 배경 (보완 오행 → 색) ─────────────────────────────────
// 한지 그레인(turbulence) + 오행색 라디얼 그라디언트. defs 와 rect 를 함께 반환.

export function backgroundLayer(id: string, colorHex: string, w: number, h: number): string {
  const tint = rgba(colorHex, 0.22);
  const edge = rgba(shade(colorHex, 0.35), 0.4);
  return `
  <defs>
    <radialGradient id="${id}-bg" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="${HANJI}"/>
      <stop offset="62%" stop-color="${HANJI}"/>
      <stop offset="100%" stop-color="${HANJI_DEEP}"/>
    </radialGradient>
    <filter id="${id}-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id}-bg)"/>
  <rect width="${w}" height="${h}" fill="${tint}"/>
  <rect width="${w}" height="${h}" fill="${HANJI}" filter="url(#${id}-grain)" opacity="0.5"/>
  <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="${edge}" stroke-width="2"/>`;
}

// ── 인장 (카테고리 → 중앙 한자) ───────────────────────────
// 주사 레드 도장: 둥근 사각 + 한자 1자. 살짝 회전으로 손도장 느낌.

export function sealLayer(char: string, cx: number, cy: number, size = 118): string {
  const half = size / 2;
  return `
  <g transform="translate(${cx} ${cy}) rotate(-3)">
    <rect x="${-half}" y="${-half}" width="${size}" height="${size}" rx="14"
          fill="${JUSA}" stroke="${JUSA_DEEP}" stroke-width="4"/>
    <rect x="${-half + 9}" y="${-half + 9}" width="${size - 18}" height="${size - 18}" rx="8"
          fill="none" stroke="${rgba("#ffffff", 0.75)}" stroke-width="2"/>
    <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
          font-family="'Nanum Myeongjo','Noto Serif KR',serif" font-weight="700"
          font-size="${Math.round(size * 0.6)}" fill="${HANJI}">${char}</text>
  </g>`;
}

// ── 문양 8종 (시드) ───────────────────────────────────────
// 오행색으로 그리는 장식 모티프. 카드 중앙(인장)을 비우도록 가장자리·상하에 배치.

type MotifFn = (color: string, w: number, h: number) => string;

const dot = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

export const PATTERNS: MotifFn[] = [
  // 0 — 모서리 동심원
  (c, w, h) => {
    const col = rgba(c, 0.5);
    const ring = (x: number, y: number) =>
      `<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="${col}" stroke-width="2"/>` +
      `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${col}" stroke-width="2"/>` +
      dot(x, y, 5, col);
    return ring(46, 46) + ring(w - 46, 46) + ring(46, h - 46) + ring(w - 46, h - 46);
  },
  // 1 — 상하 물결
  (c, w, h) => {
    const col = rgba(c, 0.45);
    const wave = (y: number) => {
      let d = `M0 ${y}`;
      for (let x = 0; x <= w; x += 40) d += ` q 20 -12 40 0`;
      return `<path d="${d}" fill="none" stroke="${col}" stroke-width="3"/>`;
    };
    return wave(64) + wave(80) + wave(h - 80) + wave(h - 64);
  },
  // 2 — 점 격자
  (c, w, h) => {
    const col = rgba(c, 0.4);
    let s = "";
    for (let x = 40; x < w; x += 44)
      for (let y = 40; y < h; y += 44)
        if (Math.abs(x - w / 2) > 90 || Math.abs(y - h / 2) > 120) s += dot(x, y, 3, col);
    return s;
  },
  // 3 — 능형(마름모) 띠
  (c, w, h) => {
    const col = rgba(c, 0.5);
    const dia = (x: number, y: number, r: number) =>
      `<path d="M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z" fill="none" stroke="${col}" stroke-width="2"/>`;
    let s = "";
    for (let x = 40; x <= w - 40; x += 40) s += dia(x, 40, 12) + dia(x, h - 40, 12);
    return s;
  },
  // 4 — 방사선 (상단)
  (c, w, h) => {
    const col = rgba(c, 0.4);
    const cx = w / 2;
    let s = "";
    for (let i = -4; i <= 4; i++)
      s += `<line x1="${cx}" y1="34" x2="${cx + i * 34}" y2="120" stroke="${col}" stroke-width="2"/>`;
    return s;
  },
  // 5 — 구름 소용돌이
  (c, w, h) => {
    const col = rgba(c, 0.5);
    const swirl = (x: number, y: number) =>
      `<path d="M${x} ${y} a14 14 0 1 1 -13 6 a9 9 0 1 0 9 -4" fill="none" stroke="${col}" stroke-width="2.5"/>`;
    return swirl(52, 96) + swirl(w - 52, 96) + swirl(52, h - 96) + swirl(w - 52, h - 96);
  },
  // 6 — 격자 창살
  (c, w, h) => {
    const col = rgba(c, 0.32);
    let s = "";
    for (let x = 56; x < w; x += 56) s += `<line x1="${x}" y1="30" x2="${x}" y2="${h - 30}" stroke="${col}" stroke-width="1.5"/>`;
    for (let y = 56; y < h; y += 56) s += `<line x1="30" y1="${y}" x2="${w - 30}" y2="${y}" stroke="${col}" stroke-width="1.5"/>`;
    return s;
  },
  // 7 — 인장 둘레 꽃잎
  (c, w, h) => {
    const col = rgba(c, 0.55);
    const cx = w / 2, cy = h / 2;
    let s = "";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x = cx + Math.cos(a) * 96;
      const y = cy + Math.sin(a) * 96;
      s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10" ry="5" transform="rotate(${((a * 180) / Math.PI).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${col}"/>`;
    }
    return s;
  },
];

// ── 장식 4종 (시드) — 테두리 프레임 ──────────────────────

type FrameFn = (color: string, w: number, h: number) => string;

export const DECORATIONS: FrameFn[] = [
  // 0 — 이중 실선
  (c, w, h) => {
    const col = rgba(shade(c, 0.2), 0.7);
    return (
      `<rect x="18" y="18" width="${w - 36}" height="${h - 36}" fill="none" stroke="${col}" stroke-width="3"/>` +
      `<rect x="26" y="26" width="${w - 52}" height="${h - 52}" fill="none" stroke="${col}" stroke-width="1.5"/>`
    );
  },
  // 1 — 모서리 브래킷
  (c, w, h) => {
    const col = rgba(shade(c, 0.25), 0.8);
    const L = 40, m = 20;
    const corner = (x: number, y: number, sx: number, sy: number) =>
      `<path d="M${x} ${y + sy * L} L${x} ${y} L${x + sx * L} ${y}" fill="none" stroke="${col}" stroke-width="3.5"/>`;
    return (
      corner(m, m, 1, 1) +
      corner(w - m, m, -1, 1) +
      corner(m, h - m, 1, -1) +
      corner(w - m, h - m, -1, -1)
    );
  },
  // 2 — 파선 프레임
  (c, w, h) => {
    const col = rgba(shade(c, 0.2), 0.7);
    return `<rect x="20" y="20" width="${w - 40}" height="${h - 40}" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="10 7"/>`;
  },
  // 3 — 구슬 테두리
  (c, w, h) => {
    const col = rgba(shade(c, 0.2), 0.75);
    let s = `<rect x="22" y="22" width="${w - 44}" height="${h - 44}" fill="none" stroke="${col}" stroke-width="1.5"/>`;
    for (let x = 22; x <= w - 22; x += 26) s += dot(x, 22, 2.5, col) + dot(x, h - 22, 2.5, col);
    for (let y = 22; y <= h - 22; y += 26) s += dot(22, y, 2.5, col) + dot(w - 22, y, 2.5, col);
    return s;
  },
];

export { MEOK, HANJI };
