import { describe, expect, it } from "vitest";
import { buildBujeok, dailyFortune, type BujeokInput } from "../index";
import { LUCK } from "../luck";
import { CATEGORIES, type CategoryId } from "../categories";
import { PATTERN_COUNT, DECORATION_COUNT, TOTAL_COMBINATIONS } from "../card";
import type { Ohaeng } from "saju-core";

// 결정적으로 넓은 입력 표본을 만든다 (Math.random 미사용 → 테스트도 재현적).
const NAMES = ["김민준", "이서연", "박도윤", "최지우", "정하은", "강시우"];
const CATS: CategoryId[] = CATEGORIES.map((c) => c.id);

function sampleInputs(): BujeokInput[] {
  const out: BujeokInput[] = [];
  for (let y = 1980; y <= 2011; y++) {
    for (const m of [1, 4, 7, 11]) {
      for (const d of [3, 17, 26]) {
        const birth = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const name = NAMES[(y + m + d) % NAMES.length];
        const category = CATS[(y + m) % CATS.length];
        out.push({ name, birth, category });
      }
    }
  }
  return out;
}

const SAMPLE = sampleInputs();

describe("분포 — 행운 지수", () => {
  it(`모든 표본에서 ${LUCK.min}~${LUCK.max} 정수`, () => {
    for (const input of SAMPLE) {
      const { luck } = buildBujeok(input);
      expect(Number.isInteger(luck)).toBe(true);
      expect(luck).toBeGreaterThanOrEqual(LUCK.min);
      expect(luck).toBeLessThanOrEqual(LUCK.max);
    }
  });

  it("상수가 아니라 여러 값으로 퍼진다", () => {
    const values = new Set(SAMPLE.map((i) => buildBujeok(i).luck));
    expect(values.size).toBeGreaterThan(8);
  });
});

describe("분포 — 보완 오행", () => {
  it("표본 전체에서 5오행 중 최소 4종 이상 등장(치우침 없음)", () => {
    const seen = new Set<Ohaeng>();
    for (const input of SAMPLE) seen.add(buildBujeok(input).complement.element);
    expect(seen.size).toBeGreaterThanOrEqual(4);
  });

  it("보완 오행은 항상 분포상 최소 개수 오행이다", () => {
    for (const input of SAMPLE) {
      const r = buildBujeok(input);
      const min = Math.min(...Object.values(r.distribution.counts));
      expect(r.distribution.counts[r.complement.element]).toBe(min);
    }
  });
});

describe("분포 — 카드 조합", () => {
  it("문양(8)·장식(4) 인덱스가 전 범위를 커버", () => {
    const patterns = new Set<number>();
    const decos = new Set<number>();
    for (const input of SAMPLE) {
      const { card } = buildBujeok(input);
      patterns.add(card.pattern);
      decos.add(card.decoration);
      expect(card.pattern).toBeGreaterThanOrEqual(0);
      expect(card.pattern).toBeLessThan(PATTERN_COUNT);
      expect(card.decoration).toBeGreaterThanOrEqual(0);
      expect(card.decoration).toBeLessThan(DECORATION_COUNT);
    }
    expect(patterns.size).toBe(PATTERN_COUNT);
    expect(decos.size).toBe(DECORATION_COUNT);
  });

  it("이론 조합 수는 800", () => {
    expect(TOTAL_COMBINATIONS).toBe(800);
  });
});

describe("분포 — 데일리 운세", () => {
  it("band 0~9, luckyNumber 1~9, score 0~100", () => {
    for (let d = 1; d <= 28; d++) {
      const iso = `2026-07-${String(d).padStart(2, "0")}`;
      for (const input of SAMPLE.slice(0, 30)) {
        const f = dailyFortune(input.name, input.birth, iso);
        expect(f.band).toBeGreaterThanOrEqual(0);
        expect(f.band).toBeLessThan(10);
        expect(f.luckyNumber).toBeGreaterThanOrEqual(1);
        expect(f.luckyNumber).toBeLessThanOrEqual(9);
        expect(f.score).toBeGreaterThanOrEqual(0);
        expect(f.score).toBeLessThanOrEqual(100);
      }
    }
  });
});
