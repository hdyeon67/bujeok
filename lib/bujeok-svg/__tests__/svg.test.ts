import { describe, expect, it } from "vitest";
import { renderBujeokSvg, PATTERNS, DECORATIONS, CARD_W, CARD_H } from "../index";
import {
  buildBujeok,
  composeCard,
  ohaengMeta,
  getCategory,
  CATEGORIES,
  type BujeokCard,
} from "@/lib/bujeok-engine";
import { OHAENG_ORDER, type Ohaeng } from "saju-core";

/** 특정 (배경·인장·문양·장식) 조합의 카드 객체를 직접 구성 */
function cardOf(bg: Ohaeng, catIdx: number, pattern: number, decoration: number): BujeokCard {
  const cat = CATEGORIES[catIdx];
  return {
    background: bg,
    colorHex: ohaengMeta(bg).hex,
    seal: getCategory(cat.id).seal,
    category: cat.id,
    pattern,
    decoration,
  };
}

function svgOk(svg: string): void {
  expect(svg.startsWith("<svg")).toBe(true);
  expect((svg.match(/<svg/g) || []).length).toBe(1);
  expect((svg.match(/<\/svg>/g) || []).length).toBe(1);
  expect(svg.includes("viewBox=")).toBe(true);
  expect(svg).not.toContain("undefined");
  expect(svg).not.toContain("NaN");
  expect(svg).not.toContain("null");
}

describe("레이어 개수 — 800 조합", () => {
  it("문양 8종 · 프레임 4종", () => {
    expect(PATTERNS.length).toBe(8);
    expect(DECORATIONS.length).toBe(4);
  });
  it("배경5 × 인장5 × 문양8 × 프레임4 = 800", () => {
    expect(OHAENG_ORDER.length * CATEGORIES.length * PATTERNS.length * DECORATIONS.length).toBe(800);
  });
});

describe("renderBujeokSvg — 800 조합 전부 유효 SVG", () => {
  it("모든 조합이 예외 없이 유효한 SVG 를 만든다", () => {
    let n = 0;
    for (const bg of OHAENG_ORDER) {
      for (let cat = 0; cat < CATEGORIES.length; cat++) {
        for (let p = 0; p < PATTERNS.length; p++) {
          for (let d = 0; d < DECORATIONS.length; d++) {
            const svg = renderBujeokSvg(cardOf(bg, cat, p, d), { wish: "테스트" });
            svgOk(svg);
            expect(svg).toContain(getCategory(CATEGORIES[cat].id).seal); // 인장 반영
            n++;
          }
        }
      }
    }
    expect(n).toBe(800);
  });
});

describe("renderBujeokSvg — 세로형 · 결정성 · 링크 없음", () => {
  const card = buildBujeok({ name: "홍길동", birth: "1998-03-21", category: "exam" }).card;

  it("세로 3:4 (480×640) viewBox", () => {
    expect(CARD_W).toBe(480);
    expect(CARD_H).toBe(640);
    expect(renderBujeokSvg(card)).toContain('viewBox="0 0 480 640"');
  });

  it("같은 카드·옵션은 항상 같은 SVG", () => {
    expect(renderBujeokSvg(card, { wish: "시험 합격" })).toBe(
      renderBujeokSvg(card, { wish: "시험 합격" }),
    );
  });

  it("URL·링크가 카드에 없다 (xmlns 네임스페이스 제외)", () => {
    const svg = renderBujeokSvg(card, { wish: "시험 합격" });
    expect(svg).not.toContain("fineboll.com");
    expect(svg).not.toContain("bujeok.fineboll");
    // 워터마크로 쓰이던 링크 텍스트가 없어야 한다
    expect(svg).not.toMatch(/\.com|\.fineboll|href=/);
  });

  it("브랜드·기원문(wish)·이모지가 반영된다", () => {
    const svg = renderBujeokSvg(card, { wish: "시험 합격", emoji: "📚" });
    expect(svg).toContain("행운부적");
    expect(svg).toContain("시험 합격");
    expect(svg).toContain("📚");
  });

  it("idPrefix 로 defs id 충돌을 피할 수 있다", () => {
    const svg = renderBujeokSvg(card, { idPrefix: "uniqueXYZ" });
    expect(svg).toContain("uniqueXYZ-bg");
    expect(svg).toContain("uniqueXYZ-grain");
  });

  it("composeCard 로 만든 카드도 정상 렌더", () => {
    const c = composeCard("수", "love", 4242);
    svgOk(renderBujeokSvg(c, { wish: "연애 성취" }));
  });
});
