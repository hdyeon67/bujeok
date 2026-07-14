// 부적 SVG 레이어 — 한국 전통 부적 (괴황지+경면주사).
//
// 도담 방향(한국민족문화대백과 참조): 한국 부적은 황색 괴황지에 붉은 경면주사.
// 글자형은 파자(破字, 한자를 분해·결합하고 선으로 잇기) + 길상 단자(일월·王·光·神·龍·金),
// 그림형은 호랑이·귀면·태양, 추상형은 와문(소용돌이)·탑형·계단형. 여러 작은 원을 선으로
// 잇는(별/구성) 것이 한국 특유. 중국 도교부(급급여율령 한시)·일본 오후다와 구별된다.
//
// 조합: 배경 5(오행 종이톤) × 인장 5(카테고리) × 부문양 8(시드) × 테두리 4(시드) = 800.

export const JU = "#a5241a"; // 경면주사(진한 주홍)
export const JU_DK = "#7a160f";
export const PAPER = "#e9d590";
export const PAPER_HI = "#f3e6b0";
export const INKB = "#3b2a12";

// 오행 → 괴황지 톤 변주 + 원소 한자
export const ELEMENT: Record<string, { paper: string; hi: string; char: string }> = {
  목: { paper: "#e2d494", hi: "#efe4b0", char: "木" },
  화: { paper: "#ecd287", hi: "#f6e4a6", char: "火" },
  토: { paper: "#ead68a", hi: "#f4e6ad", char: "土" },
  금: { paper: "#e7d693", hi: "#f2e6b3", char: "金" },
  수: { paper: "#e3d491", hi: "#efe4b1", char: "水" },
};
function el(o: string) {
  return ELEMENT[o] ?? ELEMENT["금"];
}
const P = (v: number) => +v.toFixed(1);
const SERIF = "'Nanum Myeongjo','Noto Serif KR',serif";
const SANS = "'Pretendard',system-ui,sans-serif";

// ── 괴황지 배경 (더 바랜 오래된 종이 + 거친 붓 필터 defs) ──
export function paperBackground(id: string, ohaeng: string, w: number, h: number): string {
  const e = el(ohaeng);
  // 얼룩(폭싱) — 세월 탄 갈색 반점
  const fox = [[70, 120, 26], [400, 90, 20], [430, 360, 30], [60, 470, 24], [250, 560, 34], [360, 520, 18]]
    .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#8a6a2f" opacity="0.1"/>`)
    .join("");
  return `
  <defs>
    <radialGradient id="${id}-bg" cx="50%" cy="40%" r="82%">
      <stop offset="0%" stop-color="${e.hi}"/>
      <stop offset="60%" stop-color="${e.paper}"/>
      <stop offset="100%" stop-color="#c9ad5f"/>
    </radialGradient>
    <filter id="${id}-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.34  0 0 0 0 0.25 0 0 0 0 0.1  0 0 0 0.08 0"/>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
    <filter id="${id}-blot">
      <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.4 0 0 0 0 0.28 0 0 0 0 0.1  0 0 0 0.09 0"/>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
    <filter id="${id}-rough">
      <feTurbulence type="fractalNoise" baseFrequency="0.018 0.026" numOctaves="2" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="${id}-bleed">
      <feGaussianBlur stdDeviation="0.5" result="b"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="b" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <pattern id="${id}-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="${INKB}" stroke-width="1.3"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="url(#${id}-bg)"/>
  <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="${e.paper}" filter="url(#${id}-blot)" opacity="0.6"/>
  <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="${e.hi}" filter="url(#${id}-grain)" opacity="0.4"/>
  ${fox}`;
}

// ── 까치호랑이 (목판화 2도 채색: 주사 면 + 먹 덩어리 + 종이 여백 + 해칭) ──
export function mindaTiger(cx: number, cy: number, id: string): string {
  const R = 112;
  const by = cy + R * 1.42; // 몸통 중심
  const hatch = `url(#${id}-hatch)`;
  const out = `fill="${JU}" stroke="${INKB}" stroke-width="4" stroke-linejoin="round"`;
  const ink = `fill="${INKB}"`;
  const meokLine = `stroke="${INKB}" stroke-linecap="round" fill="none"`;
  const F = (v: number) => +v.toFixed(1);
  const s = R;

  // 굵은 먹 줄무늬(면) — 갈고리형
  const stripe = (x: number, y: number, len: number, wdt: number, ang: number) => {
    const r = (ang * Math.PI) / 180;
    const dx = Math.cos(r) * len, dy = Math.sin(r) * len;
    const px = Math.cos(r + Math.PI / 2) * wdt, py = Math.sin(r + Math.PI / 2) * wdt;
    return `<path d="M${F(x - px)} ${F(y - py)} q ${F(dx * 0.5 + px)} ${F(dy * 0.5 + py)} ${F(dx)} ${F(dy)} q ${F(-px)} ${F(-py)} ${F(-px * 2)} ${F(-py * 2)} q ${F(-dx * 0.5 + px)} ${F(-dy * 0.5 + py)} ${F(-dx)} ${F(-dy)} Z" ${ink}/>`;
  };

  return `<g filter="url(#${id}-rough)">
    <!-- 꼬리 -->
    <path d="M${F(cx + s * 1.05)} ${F(by)} q ${s * 0.8} ${-s * 0.2} ${s * 0.72} ${-s * 1.1} q ${-s * 0.06} ${-s * 0.42} ${-s * 0.5} ${-s * 0.34} q ${s * 0.28} ${s * 0.12} ${s * 0.22} ${s * 0.62} q ${-s * 0.05} ${s * 0.5} ${-s * 0.5} ${s * 0.62} Z" ${out}/>
    <!-- 몸통 -->
    <ellipse cx="${cx}" cy="${F(by)}" rx="${F(s * 1.32)}" ry="${F(s * 1.08)}" ${out}/>
    <!-- 몸 그림자(진주사) -->
    <path d="M${cx} ${F(by - s * 1.05)} a ${F(s * 1.32)} ${F(s * 1.08)} 0 0 1 0 ${F(s * 2.1)} a ${F(s * 0.7)} ${F(s * 1.08)} 0 0 0 0 ${F(-s * 2.1)} Z" fill="${JU_DK}" opacity="0.45" stroke="none"/>
    <!-- 앞다리 -->
    <rect x="${F(cx - s * 0.66)}" y="${F(by + s * 0.35)}" width="${F(s * 0.42)}" height="${F(s * 1.15)}" rx="${F(s * 0.21)}" ${out}/>
    <rect x="${F(cx + s * 0.24)}" y="${F(by + s * 0.35)}" width="${F(s * 0.42)}" height="${F(s * 1.15)}" rx="${F(s * 0.21)}" ${out}/>
    <ellipse cx="${F(cx - s * 0.45)}" cy="${F(by + s * 1.5)}" rx="${F(s * 0.3)}" ry="${F(s * 0.16)}" ${out}/>
    <ellipse cx="${F(cx + s * 0.45)}" cy="${F(by + s * 1.5)}" rx="${F(s * 0.3)}" ry="${F(s * 0.16)}" ${out}/>
    <!-- 가슴 여백(종이) -->
    <ellipse cx="${cx}" cy="${F(by - s * 0.05)}" rx="${F(s * 0.56)}" ry="${F(s * 0.82)}" fill="${PAPER_HI}"/>
    <!-- 해칭 그림자(칼자국) -->
    <ellipse cx="${cx}" cy="${F(by + s * 0.6)}" rx="${F(s * 1.05)}" ry="${F(s * 0.36)}" fill="${hatch}" opacity="0.4"/>
    <!-- 몸 줄무늬 -->
    ${stripe(cx - s * 0.95, by - s * 0.2, s * 0.5, 5, 100)}${stripe(cx - s * 1.0, by + s * 0.3, s * 0.42, 5, 95)}${stripe(cx + s * 0.95, by - s * 0.2, s * 0.5, 5, 80)}${stripe(cx + s * 1.0, by + s * 0.3, s * 0.42, 5, 85)}
    <!-- 귀 -->
    <circle cx="${F(cx - s * 0.64)}" cy="${F(cy - s * 0.74)}" r="${F(s * 0.32)}" ${out}/>
    <circle cx="${F(cx + s * 0.64)}" cy="${F(cy - s * 0.74)}" r="${F(s * 0.32)}" ${out}/>
    <circle cx="${F(cx - s * 0.64)}" cy="${F(cy - s * 0.72)}" r="${F(s * 0.15)}" fill="${JU_DK}"/>
    <circle cx="${F(cx + s * 0.64)}" cy="${F(cy - s * 0.72)}" r="${F(s * 0.15)}" fill="${JU_DK}"/>
    <!-- 머리 -->
    <circle cx="${cx}" cy="${cy}" r="${s}" ${out}/>
    <!-- 머리 그림자 -->
    <path d="M${cx} ${F(cy - s)} a ${s} ${s} 0 0 1 0 ${F(s * 2)} a ${F(s * 0.62)} ${s} 0 0 0 0 ${F(-s * 2)} Z" fill="${JU_DK}" opacity="0.4" stroke="none"/>
    <!-- 주둥이 여백(종이) -->
    <ellipse cx="${cx}" cy="${F(cy + s * 0.38)}" rx="${F(s * 0.58)}" ry="${F(s * 0.42)}" fill="${PAPER_HI}"/>
    <!-- 눈(종이 흰자 + 먹 눈동자) -->
    <ellipse cx="${F(cx - s * 0.4)}" cy="${F(cy - s * 0.06)}" rx="${F(s * 0.22)}" ry="${F(s * 0.26)}" fill="${PAPER_HI}" stroke="${INKB}" stroke-width="3.5"/>
    <ellipse cx="${F(cx + s * 0.4)}" cy="${F(cy - s * 0.06)}" rx="${F(s * 0.22)}" ry="${F(s * 0.26)}" fill="${PAPER_HI}" stroke="${INKB}" stroke-width="3.5"/>
    <circle cx="${F(cx - s * 0.38)}" cy="${F(cy - s * 0.02)}" r="${F(s * 0.1)}" ${ink}/>
    <circle cx="${F(cx + s * 0.42)}" cy="${F(cy - s * 0.02)}" r="${F(s * 0.1)}" ${ink}/>
    <!-- 눈썹 -->
    <path d="M${F(cx - s * 0.62)} ${F(cy - s * 0.4)} q ${s * 0.2} ${-s * 0.14} ${s * 0.42} ${-s * 0.04}" ${meokLine} stroke-width="7"/>
    <path d="M${F(cx + s * 0.62)} ${F(cy - s * 0.4)} q ${-s * 0.2} ${-s * 0.14} ${-s * 0.42} ${-s * 0.04}" ${meokLine} stroke-width="7"/>
    <!-- 王 이마 -->
    <path d="M${F(cx - s * 0.2)} ${F(cy - s * 0.62)} h${F(s * 0.4)} M${F(cx - s * 0.2)} ${F(cy - s * 0.5)} h${F(s * 0.4)} M${F(cx - s * 0.2)} ${F(cy - s * 0.38)} h${F(s * 0.4)} M${cx} ${F(cy - s * 0.62)} v${F(s * 0.24)}" ${meokLine} stroke-width="6"/>
    <!-- 머리 줄무늬 -->
    ${stripe(cx - s * 0.86, cy - s * 0.05, s * 0.34, 4.5, 105)}${stripe(cx + s * 0.86, cy - s * 0.05, s * 0.34, 4.5, 75)}
    <!-- 코·입 -->
    <path d="M${F(cx - s * 0.13)} ${F(cy + s * 0.24)} q ${s * 0.13} ${s * 0.14} ${s * 0.26} 0 q ${-s * 0.13} ${-s * 0.06} ${-s * 0.26} 0 Z" ${ink}/>
    <path d="M${cx} ${F(cy + s * 0.32)} V ${F(cy + s * 0.48)} M${cx} ${F(cy + s * 0.48)} q ${-s * 0.15} ${s * 0.12} ${-s * 0.28} ${s * 0.02} M${cx} ${F(cy + s * 0.48)} q ${s * 0.15} ${s * 0.12} ${s * 0.28} ${s * 0.02}" ${meokLine} stroke-width="4"/>
    <!-- 수염 -->
    <path d="M${F(cx - s * 0.28)} ${F(cy + s * 0.34)} h${F(-s * 0.52)} M${F(cx - s * 0.28)} ${F(cy + s * 0.42)} h${F(-s * 0.46)} M${F(cx + s * 0.28)} ${F(cy + s * 0.34)} h${F(s * 0.52)} M${F(cx + s * 0.28)} ${F(cy + s * 0.42)} h${F(s * 0.46)}" ${meokLine} stroke-width="2"/>
  </g>`;
}

// (구) 선화 호랑이 — 미사용
export function mindaTigerLine(cx: number, cy: number): string {
  const sw = `stroke="${JU}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const sw2 = `stroke="${JU}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const R = 128;
  const bodyY = cy + R * 1.55;
  // 줄무늬(머리/몸)
  const stripe = (x: number, y: number, len: number, ang: number) => {
    const rad = (ang * Math.PI) / 180;
    return `<path d="M${P(x)} ${P(y)} q ${P(Math.cos(rad + 0.4) * len * 0.5)} ${P(Math.sin(rad + 0.4) * len * 0.5)} ${P(Math.cos(rad) * len)} ${P(Math.sin(rad) * len)}" ${sw2}/>`;
  };
  return `<g>
    <!-- 몸통 & 뒷다리 -->
    <path d="M${cx - R * 0.9} ${bodyY - R * 0.3} q ${-R * 0.5} ${R * 0.9} ${R * 0.15} ${R * 1.15} q ${R * 0.8} ${R * 0.35} ${R * 1.5} ${0} q ${R * 0.65} ${-R * 0.25} ${R * 0.15} ${-R * 1.15}" ${sw}/>
    <!-- 앞다리 -->
    <path d="M${cx - R * 0.55} ${bodyY + R * 0.2} V ${bodyY + R * 1.0}" ${sw}/>
    <path d="M${cx + R * 0.55} ${bodyY + R * 0.2} V ${bodyY + R * 1.0}" ${sw}/>
    <path d="M${cx - R * 0.72} ${bodyY + R * 1.0} h ${R * 0.34}" ${sw}/>
    <path d="M${cx + R * 0.38} ${bodyY + R * 1.0} h ${R * 0.34}" ${sw}/>
    <!-- 꼬리 -->
    <path d="M${cx + R * 1.15} ${bodyY + R * 0.2} q ${R * 0.7} ${-R * 0.3} ${R * 0.55} ${-R * 1.0} q ${-R * 0.1} ${-R * 0.4} ${-R * 0.5} ${-R * 0.3}" ${sw}/>
    <!-- 몸 줄무늬 -->
    ${stripe(cx - R * 0.5, bodyY, R * 0.5, 100)}${stripe(cx - R * 0.2, bodyY - R * 0.1, R * 0.55, 95)}${stripe(cx + R * 0.2, bodyY - R * 0.1, R * 0.55, 85)}${stripe(cx + R * 0.5, bodyY, R * 0.5, 80)}
    <!-- 귀 -->
    <circle cx="${cx - R * 0.62}" cy="${cy - R * 0.78}" r="${R * 0.3}" ${sw}/>
    <circle cx="${cx + R * 0.62}" cy="${cy - R * 0.78}" r="${R * 0.3}" ${sw}/>
    <!-- 머리 -->
    <circle cx="${cx}" cy="${cy}" r="${R}" ${sw}/>
    <!-- 王 이마 -->
    <path d="M${cx - 20} ${cy - R * 0.58} h40 M${cx - 20} ${cy - R * 0.44} h40 M${cx - 20} ${cy - R * 0.3} h40 M${cx} ${cy - R * 0.58} v${R * 0.28}" ${sw2}/>
    <!-- 눈 -->
    <circle cx="${cx - R * 0.4}" cy="${cy - R * 0.02}" r="${R * 0.16}" ${sw}/>
    <circle cx="${cx + R * 0.4}" cy="${cy - R * 0.02}" r="${R * 0.16}" ${sw}/>
    <circle cx="${cx - R * 0.4}" cy="${cy - R * 0.02}" r="${R * 0.05}" fill="${JU}" stroke="none"/>
    <circle cx="${cx + R * 0.4}" cy="${cy - R * 0.02}" r="${R * 0.05}" fill="${JU}" stroke="none"/>
    <!-- 코 & 입 -->
    <path d="M${cx - R * 0.12} ${cy + R * 0.28} q ${R * 0.12} ${R * 0.12} ${R * 0.24} 0" ${sw}/>
    <path d="M${cx} ${cy + R * 0.34} V ${cy + R * 0.5} M${cx} ${cy + R * 0.5} q ${-R * 0.16} ${R * 0.12} ${-R * 0.3} 0 M${cx} ${cy + R * 0.5} q ${R * 0.16} ${R * 0.12} ${R * 0.3} 0" ${sw2}/>
    <!-- 수염 -->
    <path d="M${cx - R * 0.3} ${cy + R * 0.36} h ${-R * 0.55} M${cx - R * 0.3} ${cy + R * 0.44} h ${-R * 0.5} M${cx + R * 0.3} ${cy + R * 0.36} h ${R * 0.55} M${cx + R * 0.3} ${cy + R * 0.44} h ${R * 0.5}" ${sw2}/>
    <!-- 볼 갈기(스캘럽) -->
    <path d="M${cx - R * 0.95} ${cy + R * 0.2} q ${R * 0.12} ${R * 0.14} 0 ${R * 0.28} q ${R * 0.14} ${R * 0.12} 0 ${R * 0.26}" ${sw2}/>
    <path d="M${cx + R * 0.95} ${cy + R * 0.2} q ${-R * 0.12} ${R * 0.14} 0 ${R * 0.28} q ${-R * 0.14} ${R * 0.12} 0 ${R * 0.26}" ${sw2}/>
  </g>`;
}

// ── 큰 붓글씨 한글 (거친 획) ──────────────────────────────
export function brushText(cx: number, y: number, text: string, size: number, id: string): string {
  return `<text x="${cx}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="'Nanum Brush Script','Gaegu','Nanum Myeongjo',cursive" font-weight="700" font-size="${size}" fill="${JU}" filter="url(#${id}-bleed)" letter-spacing="2">${text}</text>`;
}

// ── 일월(해·달) ───────────────────────────────────────────
export function sunMoon(cx: number, y: number): string {
  return `<circle cx="${cx - 66}" cy="${y}" r="12" fill="none" stroke="${JU}" stroke-width="2.6"/><circle cx="${cx - 66}" cy="${y}" r="3" fill="${JU}"/>` +
    `<path d="M${cx + 58} ${y - 12} a 12 12 0 1 0 0 24 a 9 9 0 1 1 0 -24 Z" fill="${JU}"/>`;
}

// ── 와문(소용돌이) — 한국 추상 부적 모티프 ────────────────
function wamun(x: number, y: number, s: number, sw = 2): string {
  return `<path d="M${P(x)} ${P(y)} q ${P(s)} ${P(-s * 0.3)} ${P(s * 0.92)} ${P(s * 0.5)} q ${P(-s * 0.12)} ${P(s * 0.82)} ${P(-s * 0.86)} ${P(s * 0.56)} q ${P(-s * 0.5)} ${P(-s * 0.16)} ${P(-s * 0.32)} ${P(-s * 0.62)} q ${P(s * 0.16)} ${P(-s * 0.3)} ${P(s * 0.52)} ${P(-s * 0.14)}" fill="none" stroke="${JU}" stroke-width="${sw}" stroke-linecap="round"/>`;
}
function dot(x: number, y: number, r: number, op = 0.85) {
  return `<circle cx="${P(x)}" cy="${P(y)}" r="${P(r)}" fill="${JU}" opacity="${op}"/>`;
}
// 연결된 작은 원(별/구성) 세로 사슬
function starChain(x: number, top: number, n: number, gap: number): string {
  let s = `<path d="M${P(x)} ${P(top)} V ${P(top + (n - 1) * gap)}" stroke="${JU}" stroke-width="1" opacity="0.7"/>`;
  for (let i = 0; i < n; i++) s += `<circle cx="${P(x)}" cy="${P(top + i * gap)}" r="3.4" fill="none" stroke="${JU}" stroke-width="1.4"/>` + dot(x, top + i * gap, 1.3, 0.9);
  return s;
}

// 기와 지붕(추녀 올라간 가로) — 탑형 계단
function eave(cx: number, y: number, hw: number): string {
  return `<path d="M${P(cx - hw)} ${P(y)} H ${P(cx + hw)}" stroke="${JU}" stroke-width="3" stroke-linecap="round" fill="none"/>` +
    `<path d="M${P(cx - hw)} ${P(y)} q ${P(-8)} ${P(-2)} ${P(-12)} ${P(-11)}" stroke="${JU}" stroke-width="3" stroke-linecap="round" fill="none"/>` +
    `<path d="M${P(cx + hw)} ${P(y)} q ${P(8)} ${P(-2)} ${P(12)} ${P(-11)}" stroke="${JU}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
}

// ── 한국식 부적 도상 (일월 + 한글 명패 + 탑형 길상글자 + 와문) ─
export function koreanFigure(cx: number, sealChar: string, ohaeng: string, wish: string): string {
  // 일월(해·달)
  const sunMoon = `
    <circle cx="${cx - 58}" cy="66" r="12" fill="none" stroke="${JU}" stroke-width="2.6"/>
    <circle cx="${cx - 58}" cy="66" r="3" fill="${JU}"/>
    <path d="M${cx + 50} 54 a 13 13 0 1 0 0 26 a 9.5 9.5 0 1 1 0 -26 Z" fill="${JU}"/>`;

  // 한글 소원 명패
  const nameplate = `
    <rect x="${cx - 66}" y="86" width="132" height="34" rx="7" fill="${JU}"/>
    <text x="${cx}" y="103" text-anchor="middle" dominant-baseline="central" font-family="${SANS}" font-weight="800" font-size="19" fill="${PAPER_HI}" letter-spacing="2">${wish}</text>`;

  // 탑형 길상글자 기둥 (王/光 위, 큰 인장, 神/龍 아래) + 파자 연결선 + 별 사슬
  const spine = `<path d="M${cx} 150 V 486" stroke="${JU}" stroke-width="2" opacity="0.65"/>`;
  const tier = (y: number, ch: string, hw: number) =>
    eave(cx, y + 22, hw) +
    `<text x="${cx}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-weight="800" font-size="34" fill="${JU}">${ch}</text>`;
  const tiers = tier(158, "王", 46) + tier(214, "光", 60) + tier(392, "神", 60) + tier(448, "龍", 46);
  const big = `<text x="${cx}" y="300" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-weight="800" font-size="108" fill="${JU}">${sealChar}</text>`;

  // 와문 좌우 대칭 (파자/추상)
  const waL = wamun(cx - 128, 250, 18) + wamun(cx - 120, 350, 15);
  const waR = `<g transform="translate(${w2(cx)} 0) scale(-1 1)">${wamun(cx - 128, 250, 18) + wamun(cx - 120, 350, 15)}</g>`;

  // 별 사슬(연결 원) 좌우
  const chains = starChain(cx - 150, 250, 4, 26) + starChain(cx + 150, 250, 4, 26);

  // 계단형 밑단
  const base = `
    <path d="M${cx - 70} 500 h140 M${cx - 52} 512 h104 M${cx - 34} 524 h68" stroke="${JU}" stroke-width="2.4" stroke-linecap="round"/>`;

  return `<g>
    ${sunMoon}${nameplate}
    ${spine}${tiers}${big}
    ${waL}${waR}
    ${chains}
    ${base}
  </g>`;
}
// (scale(-1) 미러 기준점 계산용)
function w2(cx: number) {
  return cx * 2;
}

// ── 낙관 도장 ─────────────────────────────────────────────
export function sealStamp(cx: number, cy: number, char: string, size = 46): string {
  const half = size / 2;
  return `<g transform="rotate(-4 ${cx} ${cy})">
    <rect x="${P(cx - half)}" y="${P(cy - half)}" width="${size}" height="${size}" rx="5" fill="${JU}"/>
    <text x="${cx}" y="${P(cy + 1)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-weight="800" font-size="${P(size * 0.62)}" fill="${PAPER_HI}">${char}</text>
  </g>`;
}

// ── 원소 낙관 (오행) ──────────────────────────────────────
export function elementRoundel(ohaeng: string, cx: number, cy: number, r = 19): string {
  const e = el(ohaeng);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${JU}" stroke-width="1.6"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="${JU}" stroke-width="0.7"/>
    <text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-weight="700" font-size="${P(r * 0.9)}" fill="${JU}">${e.char}</text>`;
}

// ── 부문양 액센트 8종 (여백: 와문 + 연결 원) ──────────────
const ACC: [number, number][] = [[60, 300], [420, 300], [72, 400], [408, 400]];
type FieldFn = (w: number, h: number) => string;
function field(fn: (x: number, y: number, i: number) => string): string {
  return ACC.map(([x, y], i) => fn(x, y, i)).join("");
}
export const STARFIELDS: FieldFn[] = [
  () => field((x, y) => wamun(x, y, 11, 1.6)),
  () => field((x, y) => dot(x, y, 2.6, 0.6) + dot(x, y + 12, 1.8, 0.5) + dot(x, y + 22, 1.3, 0.4)),
  () => field((x, y, i) => (i % 2 ? wamun(x, y, 10, 1.6) : dot(x, y, 2.4, 0.6))),
  () => field((x, y) => `<path d="M${x - 8} ${y} h16 M${x} ${y - 8} v16" stroke="${JU}" stroke-width="1.4" opacity="0.5"/>` + dot(x, y, 1.6, 0.6)),
  () => field((x, y, i) => (i % 2 ? dot(x, y, 2.6, 0.6) + dot(x + 9, y + 8, 1.6, 0.4) : wamun(x, y, 10, 1.6))),
  () => field((x, y) => wamun(x, y, 9, 1.4) + dot(x + 14, y + 12, 1.4, 0.5)),
  () => field((x, y) => dot(x, y, 2.4, 0.6) + `<path d="M${x} ${y} L ${x + 12} ${y + 14}" stroke="${JU}" stroke-width="1" opacity="0.4"/>` + dot(x + 12, y + 14, 1.6, 0.5)),
  () => field((x, y, i) => (i % 2 ? wamun(x, y, 11, 1.6) : `<path d="M${x - 7} ${y} h14 M${x} ${y - 7} v14" stroke="${JU}" stroke-width="1.4" opacity="0.5"/>`)),
];

// ── 테두리 4종 ────────────────────────────────────────────
type FrameFn = (w: number, h: number) => string;
function fcorner(x: number, y: number, sx: number, sy: number): string {
  const L = 22;
  return `<path d="M${P(x)} ${P(y + sy * L)} L ${P(x)} ${P(y)} L ${P(x + sx * L)} ${P(y)}" fill="none" stroke="${JU}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${P(x)}" cy="${P(y)}" r="2.4" fill="${JU}"/>`;
}
export const FRAMES: FrameFn[] = [
  (w, h) =>
    `<rect x="16" y="16" width="${w - 32}" height="${h - 32}" rx="8" fill="none" stroke="${JU}" stroke-width="3"/>` +
    `<rect x="24" y="24" width="${w - 48}" height="${h - 48}" rx="5" fill="none" stroke="${JU}" stroke-width="1.2"/>`,
  (w, h) =>
    `<rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="6" fill="none" stroke="${JU}" stroke-width="2.6"/>` +
    fcorner(28, 28, 1, 1) + fcorner(w - 28, 28, -1, 1) + fcorner(28, h - 28, 1, -1) + fcorner(w - 28, h - 28, -1, -1),
  (w, h) =>
    `<rect x="16" y="16" width="${w - 32}" height="${h - 32}" rx="8" fill="none" stroke="${JU}" stroke-width="3"/>` +
    `<rect x="23" y="23" width="${w - 46}" height="${h - 46}" rx="5" fill="none" stroke="${JU}" stroke-width="1" stroke-dasharray="2 5"/>`,
  (w, h) => {
    let s = `<rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="6" fill="none" stroke="${JU}" stroke-width="2.6"/>`;
    for (let x = 18; x <= w - 18; x += 20) s += dot(x, 18, 2, 0.9) + dot(x, h - 18, 2, 0.9);
    for (let y = 38; y <= h - 38; y += 20) s += dot(18, y, 2, 0.9) + dot(w - 18, y, 2, 0.9);
    return s;
  },
];
