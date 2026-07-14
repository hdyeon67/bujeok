// 부적 SVG 레이어 에셋 — 세로형(3:4) · 트렌디/귀여운 무드.
//
// 컨셉(예리 디자인 방향): 전통 부적 DNA(주사 레드 인장 + 한자)는 유지하되,
// 배경은 오행별 파스텔, 장식은 반짝이·별·하트 도트 + 스티커 다이컷 프레임으로
// 10~20대가 저장·공유하고 싶은 "귀여운 부적 스티커" 느낌을 낸다. URL·링크 없음.
//
// 조합: 배경 5(오행 파스텔) × 인장 5(카테고리) × 문양 8(시드) × 프레임 4(시드) = 800.
// 모든 레이어는 순수 문자열이라 서버·클라이언트에서 동일하게 그려진다.

/** 주사(朱砂) 레드 — 인장 고정색 */
export const JUSA = "#e0564a";
const JUSA_DEEP = "#c33a2f";
const CREAM = "#fdfaf2";
const MEOK = "#3a332a";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function to2(c: number): string {
  return Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
}
/** 흰색 쪽으로 amt(0~1) 섞기 (파스텔화) */
function tint(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => c + (255 - c) * amt;
  return `#${to2(f(r))}${to2(f(g))}${to2(f(b))}`;
}
/** 검정 쪽으로 amt 섞기 */
function shade(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => c * (1 - amt);
  return `#${to2(f(r))}${to2(f(g))}${to2(f(b))}`;
}
export function rgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// ── 배경 (보완 오행 → 파스텔) ─────────────────────────────
export function backgroundLayer(id: string, colorHex: string, w: number, h: number): string {
  const top = tint(colorHex, 0.82);
  const bottom = tint(colorHex, 0.6);
  const r = 40;
  return `
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${CREAM}"/>
      <stop offset="30%" stop-color="${top}"/>
      <stop offset="100%" stop-color="${bottom}"/>
    </linearGradient>
    <filter id="${id}-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.028"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="url(#${id}-bg)"/>
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${CREAM}" filter="url(#${id}-grain)" opacity="0.6"/>`;
}

// ── 인장 (카테고리 → 한자, 라운드 도장) ───────────────────
export function sealLayer(char: string, cx: number, cy: number, size = 176): string {
  const half = size / 2;
  const rx = Math.round(size * 0.3);
  return `
  <g transform="translate(${cx} ${cy}) rotate(-4)">
    <rect x="${-half}" y="${-half}" width="${size}" height="${size}" rx="${rx}"
          fill="${JUSA}" stroke="${JUSA_DEEP}" stroke-width="5"/>
    <rect x="${-half + 12}" y="${-half + 12}" width="${size - 24}" height="${size - 24}" rx="${rx - 8}"
          fill="none" stroke="${rgba("#ffffff", 0.8)}" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round"/>
    <text x="0" y="4" text-anchor="middle" dominant-baseline="central"
          font-family="'Nanum Myeongjo','Noto Serif KR',serif" font-weight="800"
          font-size="${Math.round(size * 0.56)}" fill="${CREAM}">${char}</text>
  </g>`;
}

/** 카테고리 이모지 스티커 배지 (인장 옆 귀여움 포인트) */
export function emojiBadge(emoji: string, cx: number, cy: number, r = 34): string {
  return `
  <g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${CREAM}" stroke="${rgba(MEOK, 0.12)}" stroke-width="2"/>
    <text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="central" font-size="${Math.round(r * 1.05)}">${emoji}</text>
  </g>`;
}

// ── 귀여운 모티프 프리미티브 ──────────────────────────────
function dot(x: number, y: number, r: number, fill: string) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}
function sparkle(x: number, y: number, s: number, fill: string) {
  // 4각 반짝이
  return `<path d="M${x} ${y - s} C ${x + s * 0.18} ${y - s * 0.18}, ${x + s * 0.18} ${y - s * 0.18}, ${x + s} ${y} C ${x + s * 0.18} ${y + s * 0.18}, ${x + s * 0.18} ${y + s * 0.18}, ${x} ${y + s} C ${x - s * 0.18} ${y + s * 0.18}, ${x - s * 0.18} ${y + s * 0.18}, ${x - s} ${y} C ${x - s * 0.18} ${y - s * 0.18}, ${x - s * 0.18} ${y - s * 0.18}, ${x} ${y - s} Z" fill="${fill}"/>`;
}
function star5(x: number, y: number, s: number, fill: string) {
  let pts = "";
  for (let i = 0; i < 5; i++) {
    const ao = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const ai = ao + Math.PI / 5;
    pts += `${(x + Math.cos(ao) * s).toFixed(1)},${(y + Math.sin(ao) * s).toFixed(1)} `;
    pts += `${(x + Math.cos(ai) * s * 0.45).toFixed(1)},${(y + Math.sin(ai) * s * 0.45).toFixed(1)} `;
  }
  return `<polygon points="${pts.trim()}" fill="${fill}"/>`;
}
function heart(x: number, y: number, s: number, fill: string) {
  return `<path d="M${x} ${y + s * 0.75} C ${x - s * 1.3} ${y - s * 0.35}, ${x - s * 0.35} ${y - s} , ${x} ${y - s * 0.28} C ${x + s * 0.35} ${y - s}, ${x + s * 1.3} ${y - s * 0.35}, ${x} ${y + s * 0.75} Z" fill="${fill}"/>`;
}
function flower(x: number, y: number, s: number, fill: string) {
  let g = "";
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5;
    g += `<circle cx="${(x + Math.cos(a) * s).toFixed(1)}" cy="${(y + Math.sin(a) * s).toFixed(1)}" r="${(s * 0.62).toFixed(1)}" fill="${fill}"/>`;
  }
  return g + dot(x, y, s * 0.55, CREAM);
}
function crescent(x: number, y: number, s: number, fill: string) {
  return `<path d="M ${x + s * 0.35} ${y - s} A ${s} ${s} 0 1 0 ${x + s * 0.35} ${y + s} A ${s * 0.72} ${s * 0.72} 0 1 1 ${x + s * 0.35} ${y - s} Z" fill="${fill}"/>`;
}

// 중앙 인장(대략 x120~360, y210~430)을 피한 여백 앵커
const ANCHORS: [number, number][] = [
  [78, 250], [402, 250], [66, 360], [414, 360],
  [92, 470], [388, 470], [150, 520], [330, 520],
  [240, 118], [130, 150], [350, 150], [240, 560],
];

type MotifFn = (color: string, w: number, h: number) => string;

// 각 문양 세트: 앵커에 테마 모티프를 흩뿌린다. 카테고리 무드와 상관없이 시드로 선택.
function scatter(draw: (x: number, y: number, i: number) => string): string {
  return ANCHORS.map(([x, y], i) => draw(x, y, i)).join("");
}

export const PATTERNS: MotifFn[] = [
  // 0 — 반짝이
  (c) => scatter((x, y, i) => sparkle(x, y, i % 2 ? 11 : 7, rgba(shade(c, 0.1), 0.75))),
  // 1 — 별
  (c) => scatter((x, y, i) => star5(x, y, i % 2 ? 11 : 8, rgba(shade(c, 0.12), 0.7))),
  // 2 — 하트
  (c) => scatter((x, y, i) => heart(x, y, i % 2 ? 11 : 8, rgba(JUSA, 0.5))),
  // 3 — 도트 무리
  (c) => scatter((x, y, i) => dot(x, y, i % 3 ? 4 : 6, rgba(shade(c, 0.1), 0.6)) + dot(x + 12, y + 8, 3, rgba(shade(c, 0.1), 0.4))),
  // 4 — 꽃
  (c) => scatter((x, y, i) => (i % 2 ? flower(x, y, 9, rgba(c, 0.55)) : dot(x, y, 4, rgba(shade(c, 0.15), 0.6)))),
  // 5 — 초승달 + 별
  (c) => scatter((x, y, i) => (i % 2 ? crescent(x, y, 10, rgba(shade(c, 0.12), 0.6)) : star5(x, y, 6, rgba(shade(c, 0.12), 0.6)))),
  // 6 — 반짝이 + 하트 믹스
  (c) => scatter((x, y, i) => (i % 2 ? sparkle(x, y, 10, rgba(shade(c, 0.1), 0.7)) : heart(x, y, 7, rgba(JUSA, 0.45)))),
  // 7 — 작은 별똥별(별+꼬리)
  (c) => scatter((x, y, i) => star5(x, y, i % 2 ? 10 : 7, rgba(shade(c, 0.12), 0.7)) + `<line x1="${x + 6}" y1="${y + 6}" x2="${x + 18}" y2="${y + 16}" stroke="${rgba(shade(c, 0.12), 0.35)}" stroke-width="2" stroke-linecap="round"/>`),
];

// ── 스티커 다이컷 프레임 4종 (시드) ──────────────────────
type FrameFn = (color: string, w: number, h: number) => string;

export const DECORATIONS: FrameFn[] = [
  // 0 — 둥근 이중선
  (c, w, h) => {
    const col = rgba(shade(c, 0.22), 0.55);
    return `<rect x="20" y="20" width="${w - 40}" height="${h - 40}" rx="30" fill="none" stroke="${col}" stroke-width="2.5"/>` +
      `<rect x="28" y="28" width="${w - 56}" height="${h - 56}" rx="24" fill="none" stroke="${col}" stroke-width="1.5"/>`;
  },
  // 1 — 파선 스티커
  (c, w, h) => {
    const col = rgba(shade(c, 0.22), 0.6);
    return `<rect x="22" y="22" width="${w - 44}" height="${h - 44}" rx="28" fill="none" stroke="${col}" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  },
  // 2 — 스캘럽(물결) 테두리
  (c, w, h) => {
    const col = rgba(shade(c, 0.2), 0.5);
    const step = 26, r = 9;
    let d = "";
    for (let x = 34; x <= w - 34; x += step) d += `<circle cx="${x}" cy="26" r="${r}" fill="none" stroke="${col}" stroke-width="2"/><circle cx="${x}" cy="${h - 26}" r="${r}" fill="none" stroke="${col}" stroke-width="2"/>`;
    for (let y = 60; y <= h - 60; y += step) d += `<circle cx="26" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="2"/><circle cx="${w - 26}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="2"/>`;
    return d;
  },
  // 3 — 구슬 테두리
  (c, w, h) => {
    const col = rgba(shade(c, 0.2), 0.6);
    let s = `<rect x="24" y="24" width="${w - 48}" height="${h - 48}" rx="26" fill="none" stroke="${col}" stroke-width="1.5"/>`;
    for (let x = 24; x <= w - 24; x += 24) s += dot(x, 24, 3, col) + dot(x, h - 24, 3, col);
    for (let y = 48; y <= h - 48; y += 24) s += dot(24, y, 3, col) + dot(w - 24, y, 3, col);
    return s;
  },
];

export { CREAM, MEOK };
