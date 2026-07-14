import { describe, expect, it } from "vitest";
import {
  buildBujeok,
  dailyFortune,
  complementElement,
  composeCard,
  luckScore,
  personSeed,
  cardSeed,
  type BujeokInput,
} from "../index";
import { ohaengDistribution } from "saju-core";
import { CATEGORIES } from "../categories";

const INPUT: BujeokInput = {
  name: "홍길동",
  birth: "1998-03-21",
  category: "exam",
};

describe("결정성 — 같은 입력은 항상 같은 출력", () => {
  it("buildBujeok 1000회 반복 완전 동일", () => {
    const first = JSON.stringify(buildBujeok(INPUT));
    for (let i = 0; i < 1000; i++) {
      expect(JSON.stringify(buildBujeok(INPUT))).toBe(first);
    }
  });

  it("각 서브 로직도 재호출에 동일", () => {
    const dist = ohaengDistribution(INPUT.birth);
    const ps = personSeed(INPUT.name, INPUT.birth);
    const cs = cardSeed(INPUT.name, INPUT.birth, INPUT.category);
    for (let i = 0; i < 50; i++) {
      expect(complementElement(dist, ps)).toEqual(complementElement(dist, ps));
      expect(luckScore(dist, ps)).toBe(luckScore(dist, ps));
      expect(composeCard("목", INPUT.category, cs)).toEqual(
        composeCard("목", INPUT.category, cs),
      );
    }
  });

  it("데일리 운세는 같은 (사람·날짜) 에 동일, 날짜 바뀌면 바뀔 수 있음", () => {
    for (let i = 0; i < 20; i++) {
      expect(dailyFortune("홍길동", "1998-03-21", "2026-07-14")).toEqual(
        dailyFortune("홍길동", "1998-03-21", "2026-07-14"),
      );
    }
    // 서로 다른 날짜들에서 밴드가 최소 2가지 이상 나와야 한다(상수 아님)
    const bands = new Set<number>();
    for (let d = 1; d <= 28; d++) {
      const iso = `2026-07-${String(d).padStart(2, "0")}`;
      bands.add(dailyFortune("홍길동", "1998-03-21", iso).band);
    }
    expect(bands.size).toBeGreaterThan(1);
  });

  it("입력이 다르면(이름·생일·카테고리) 결과도 달라진다", () => {
    const a = JSON.stringify(buildBujeok(INPUT));
    const b = JSON.stringify(buildBujeok({ ...INPUT, name: "김철수" }));
    const c = JSON.stringify(buildBujeok({ ...INPUT, birth: "2001-11-02" }));
    expect(a).not.toBe(b);
    expect(a).not.toBe(c);
    // 같은 사람이라도 카테고리가 다르면 카드 인장/세부가 달라진다
    const seals = new Set(
      CATEGORIES.map((cat) => buildBujeok({ ...INPUT, category: cat.id }).card.seal),
    );
    expect(seals.size).toBe(CATEGORIES.length);
  });
});
