import { describe, expect, it } from "vitest";
import { complementElement } from "../complement";
import { balanceRatio, luckScore, LUCK } from "../luck";
import { composeCard } from "../card";
import { dailyFortune } from "../daily";
import { CATEGORIES, getCategory, isCategoryId } from "../categories";
import { OHAENG_META } from "../ohaeng-meta";
import { ohaengDistribution, OHAENG_ORDER, type OhaengDistribution } from "saju-core";

// counts 만 바꿔 끼운 테스트용 분포
function distWith(counts: Record<string, number>): OhaengDistribution {
  const base = ohaengDistribution("1990-05-15");
  const total = OHAENG_ORDER.reduce((s, el) => s + (counts[el] ?? 0), 0);
  return { ...base, counts: counts as OhaengDistribution["counts"], total };
}

describe("일진 앵커 — 알려진 날짜", () => {
  it("2026-07-11 일진은 병술", () => {
    // saju-core gapja 검증값과 일치해야 한다
    expect(dailyFortune("아무개", "1998-03-21", "2026-07-11").iljinName).toBe(
      "병술",
    );
  });
  it("2000-01-07 일진은 갑자", () => {
    expect(dailyFortune("아무개", "1998-03-21", "2000-01-07").iljinName).toBe(
      "갑자",
    );
  });
});

describe("보완 오행 — 동률 시드 처리", () => {
  it("단일 최소면 그 오행, tied=false", () => {
    const d = distWith({ 목: 0, 화: 2, 토: 2, 금: 1, 수: 1 });
    const r = complementElement(d, 12345);
    expect(r.element).toBe("목");
    expect(r.tied).toBe(false);
  });

  it("동률이면 후보 안에서 결정적으로 선택, tied=true", () => {
    const d = distWith({ 목: 0, 화: 2, 토: 2, 금: 2, 수: 0 });
    const r = complementElement(d, 777);
    expect(r.candidates).toEqual(["목", "수"]);
    expect(r.tied).toBe(true);
    expect(["목", "수"]).toContain(r.element);
    // 같은 시드면 항상 같은 선택
    expect(complementElement(d, 777).element).toBe(r.element);
  });

  it("시드가 다르면 동률 후보 사이에서 선택이 갈린다", () => {
    const d = distWith({ 목: 0, 화: 2, 토: 2, 금: 2, 수: 0 });
    const picks = new Set<string>();
    for (let s = 0; s < 40; s++) picks.add(complementElement(d, s).element);
    expect(picks.size).toBe(2); // 두 후보가 모두 등장
  });
});

describe("행운 지수 — 경계·균형도", () => {
  it("완전 쏠림([6,0,0,0,0])은 하한 근처, 균형([2,1,1,1,1])은 상한 근처", () => {
    const skew = distWith({ 목: 6, 화: 0, 토: 0, 금: 0, 수: 0 });
    const even = distWith({ 목: 2, 화: 1, 토: 1, 금: 1, 수: 1 });
    expect(balanceRatio(skew)).toBeCloseTo(0, 5);
    expect(balanceRatio(even)).toBeGreaterThan(0.8);
    // 지터(±5) 포함해도 항상 구간 내
    for (let s = 0; s < 200; s++) {
      expect(luckScore(skew, s)).toBeGreaterThanOrEqual(LUCK.min);
      expect(luckScore(even, s)).toBeLessThanOrEqual(LUCK.max);
    }
  });
});

describe("카드·카테고리·메타 정합성", () => {
  it("카테고리 5종, 인장 문자 모두 고유", () => {
    expect(CATEGORIES).toHaveLength(5);
    const seals = new Set(CATEGORIES.map((c) => c.seal));
    expect(seals.size).toBe(5);
  });
  it("isCategoryId / getCategory", () => {
    expect(isCategoryId("exam")).toBe(true);
    expect(isCategoryId("nope")).toBe(false);
    expect(getCategory("wealth").seal).toBe("財");
  });
  it("composeCard 는 보완오행→배경, 카테고리→인장 반영", () => {
    const card = composeCard("수", "love", 999);
    expect(card.background).toBe("수");
    expect(card.colorHex).toBe(OHAENG_META.수.hex);
    expect(card.seal).toBe("戀");
    expect(card.category).toBe("love");
  });
  it("오행 메타는 5종 모두 색·방위 보유", () => {
    for (const el of OHAENG_ORDER) {
      expect(OHAENG_META[el].hex).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(OHAENG_META[el].direction.length).toBeGreaterThan(0);
    }
  });
});
