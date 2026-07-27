// 빨강 드리프트 가드 — 토큰(lib/config/brand.ts)을 import 할 수 없는 정적 파일들이
// 계단에서 벗어나지 않는지 검사한다. 새 빨강을 하드코딩하면 여기서 먼저 깨진다.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BRAND, CREAM, INK } from "../brand";

const root = resolve(__dirname, "../../..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const hexes = (s: string) => (s.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((h) => h.toLowerCase());

/** 팔레트에 정식으로 등록된 색 = 빨강 계단 + 크림/잉크 + 소원 카테고리 색 */
const LADDER = Object.values(BRAND).map((v) => v.toLowerCase());

describe("브랜드 빨강 계단", () => {
  it("계단은 밝음 → 어두움 순서다", () => {
    // 상대 휘도로 정렬 확인(light > deep > dark)
    const lum = (h: string) => {
      const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
      const f = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    expect(lum(BRAND.light)).toBeGreaterThan(lum(BRAND.deep));
    expect(lum(BRAND.deep)).toBeGreaterThan(lum(BRAND.dark));
  });

  it("계단 3종은 서로 다른 값이다", () => {
    expect(new Set(LADDER).size).toBe(3);
  });
});

describe("정적 파일 미러 (import 불가 → 값 일치 검사)", () => {
  it("app/icon.svg 배경 fill = BRAND.dark", () => {
    const svg = read("app/icon.svg");
    const bg = svg.match(/<rect[^>]*width="32"[^>]*fill="(#[0-9a-fA-F]{6})"/);
    expect(bg?.[1]?.toLowerCase()).toBe(BRAND.dark.toLowerCase());
  });

  it("app/icon.svg 심볼·내부틀은 크림 계열 유지(배경만 브랜드색)", () => {
    const svg = read("app/icon.svg");
    const others = hexes(svg).filter((h) => h !== BRAND.dark.toLowerCase());
    expect(others.length).toBeGreaterThan(0);
    for (const h of others) expect(h).toBe("#f5efe1");
  });

  it("app/globals.css 의 --brand 계열 = 계단과 일치", () => {
    const css = read("app/globals.css");
    const v = (name: string) =>
      css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1]?.toLowerCase();
    expect(v("brand")).toBe(BRAND.light.toLowerCase());
    expect(v("brand-deep")).toBe(BRAND.deep.toLowerCase());
    expect(v("brand-dark")).toBe(BRAND.dark.toLowerCase());
    expect(v("cream")).toBe(CREAM.toLowerCase());
    expect(v("ink")).toBe(INK.toLowerCase());
  });
});

describe("하드코딩된 빨강 없음", () => {
  // OG 라벨 #e0564a 처럼 토큰 밖에서 태어난 "제4의 빨강"을 막는다.
  const FILES = [
    "app/api/og/route.tsx",
    "app/manifest.ts",
    "app/page.tsx",
    "app/result/page.tsx",
    "tailwind.config.ts",
  ];

  /** 붉은 계열인가(오렌지레드~레드): R 이 크고 G·B 보다 확실히 높음 */
  const isRedish = (h: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    return r > 120 && r - g > 50 && r - b > 50;
  };

  for (const f of FILES) {
    it(`${f} — 계단 밖 빨강 0건`, () => {
      const stray = hexes(read(f)).filter((h) => isRedish(h) && !LADDER.includes(h));
      expect(stray).toEqual([]);
    });
  }
});
