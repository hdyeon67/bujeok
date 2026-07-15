import { describe, expect, it } from "vitest";
import {
  dDay,
  activeSeasonHook,
  SEASON_HOOKS,
  type SeasonHook,
} from "../season";

const SUNEUNG = "2026-11-19";

describe("시즌 경계 — 수능 D-day", () => {
  it("수능 당일 → dDay=0", () => {
    expect(dDay(SUNEUNG, SUNEUNG)).toBe(0);
  });

  it("수능 당일 → activeSeasonHook 활성(suneung-2026)", () => {
    expect(activeSeasonHook(SUNEUNG)?.id).toBe("suneung-2026");
  });

  it("전날 2026-11-18 → dDay=1", () => {
    expect(dDay("2026-11-18", SUNEUNG)).toBe(1);
  });

  it("다음날 2026-11-20 → dDay=-1", () => {
    expect(dDay("2026-11-20", SUNEUNG)).toBe(-1);
  });

  it("다음날 → activeSeasonHook null (범용 모드 복귀)", () => {
    expect(activeSeasonHook("2026-11-20")).toBeNull();
  });

  it("해 바뀜 2027-01-01 → dDay=-43, 활성 훅 없음", () => {
    expect(dDay("2027-01-01", SUNEUNG)).toBe(-43);
    expect(activeSeasonHook("2027-01-01")).toBeNull();
  });
});

describe("시즌 경계 — 잘못된 날짜 방어", () => {
  it("13월·40일 등 범위초과 → dDay NaN", () => {
    expect(dDay("2026-13-40", SUNEUNG)).toBeNaN();
    expect(dDay("2026-02-30", SUNEUNG)).toBeNaN();
  });

  it("빈 문자열·형식오류 → dDay NaN", () => {
    expect(dDay("", SUNEUNG)).toBeNaN();
    expect(dDay("not-a-date", SUNEUNG)).toBeNaN();
  });

  it("잘못된 today → activeSeasonHook null (조용히 다른 날짜로 해석 안 함)", () => {
    expect(activeSeasonHook("2026-13-40")).toBeNull();
    expect(activeSeasonHook("")).toBeNull();
    expect(activeSeasonHook("not-a-date")).toBeNull();
  });

  it("한 자리 월·일 표기 2026-1-5 허용 (유효 파싱)", () => {
    expect(Number.isNaN(dDay("2026-1-5", SUNEUNG))).toBe(false);
    expect(dDay("2026-01-05", SUNEUNG)).toBe(dDay("2026-1-5", SUNEUNG));
  });
});

describe("시즌 훅 선택 규칙", () => {
  it("복수 훅 중 가장 임박한(가까운) 훅 선택", () => {
    const hooks: SeasonHook[] = [
      { id: "far", label: "먼시즌", targetISO: "2026-12-25", featuredCategory: "exam" },
      { id: "near", label: "가까운시즌", targetISO: "2026-03-01", featuredCategory: "exam" },
    ];
    // 2026-01-01 기준 near(3/1)가 far(12/25)보다 임박
    expect(activeSeasonHook("2026-01-01", hooks)?.id).toBe("near");
    // 둘 다 지난 뒤엔 null
    expect(activeSeasonHook("2027-01-01", hooks)).toBeNull();
  });

  it("SEASON_HOOKS 전 항목의 targetISO 가 유효한 날짜", () => {
    for (const h of SEASON_HOOKS) {
      // 유효한 날짜면 자기 자신과의 dDay 가 0
      expect(dDay(h.targetISO, h.targetISO)).toBe(0);
    }
  });
});
