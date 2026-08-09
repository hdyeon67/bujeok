import { describe, expect, it } from "vitest";
import {
  WISHES,
  activeWishes,
  getWish,
  isLimitedActive,
  isWishId,
  limitedBadge,
  todaysWish,
} from "../catalog";

const SUNEUNG = getWish("suneung");
const REGULAR_COUNT = WISHES.filter((w) => !getWish(w.id).limited).length;

describe("한정 부적 노출 경계 (8/11 ~ 11/19)", () => {
  it("오픈 전날 2026-08-10 → 미노출", () => {
    expect(isLimitedActive(SUNEUNG, "2026-08-10")).toBe(false);
  });

  it("오픈일 2026-08-11 → 노출", () => {
    expect(isLimitedActive(SUNEUNG, "2026-08-11")).toBe(true);
  });

  it("마감일 2026-11-19 → 노출 (이 날 포함)", () => {
    expect(isLimitedActive(SUNEUNG, "2026-11-19")).toBe(true);
  });

  it("마감 다음날 2026-11-20 → 자동 미노출", () => {
    expect(isLimitedActive(SUNEUNG, "2026-11-20")).toBe(false);
  });

  it("상시 소원은 어떤 날짜에도 항상 노출", () => {
    for (const iso of ["2026-08-10", "2026-11-20", "2030-01-01"]) {
      expect(isLimitedActive(getWish("exam"), iso)).toBe(true);
    }
  });
});

describe("배지 2단계 전환 (10/20)", () => {
  it("2026-08-11 → 수능 시즌 한정", () => {
    expect(limitedBadge(SUNEUNG, "2026-08-11")).toBe("수능 시즌 한정");
  });

  it("전환 전날 2026-10-19 → 수능 시즌 한정", () => {
    expect(limitedBadge(SUNEUNG, "2026-10-19")).toBe("수능 시즌 한정");
  });

  it("전환일 2026-10-20 → 11/19까지만", () => {
    expect(limitedBadge(SUNEUNG, "2026-10-20")).toBe("11/19까지만");
  });

  it("마감일 2026-11-19 → 11/19까지만", () => {
    expect(limitedBadge(SUNEUNG, "2026-11-19")).toBe("11/19까지만");
  });

  it("기간 밖 → null", () => {
    expect(limitedBadge(SUNEUNG, "2026-08-10")).toBeNull();
    expect(limitedBadge(SUNEUNG, "2026-11-20")).toBeNull();
  });

  it("상시 소원 → 항상 null", () => {
    expect(limitedBadge(getWish("exam"), "2026-09-01")).toBeNull();
  });
});

describe("잘못된 날짜 방어 — 조용히 통과하지 않는다", () => {
  const BAD = ["2026-13-01", "2026-02-30", "20261119", "", "not-a-date", "2026-11-19T00:00:00Z"];

  it("전부 미노출 (문자열 비교였다면 통과했을 값 포함)", () => {
    for (const iso of BAD) {
      expect(isLimitedActive(SUNEUNG, iso), iso).toBe(false);
      expect(limitedBadge(SUNEUNG, iso), iso).toBeNull();
    }
  });

  it("activeWishes 도 상시 소원만 남긴다", () => {
    for (const iso of BAD) {
      expect(activeWishes(iso).length, iso).toBe(REGULAR_COUNT);
    }
  });
});

describe("activeWishes — 정렬·개수", () => {
  it("기간 내: 한정 항목이 맨 앞", () => {
    expect(activeWishes("2026-08-11")[0].id).toBe("suneung");
    expect(activeWishes("2026-11-19")[0].id).toBe("suneung");
  });

  it("기간 내 11종 / 기간 밖 10종", () => {
    expect(activeWishes("2026-09-01").length).toBe(11);
    expect(activeWishes("2026-08-10").length).toBe(10);
    expect(activeWishes("2026-11-20").length).toBe(10);
  });

  it("상시 소원의 순서는 WISHES 순서 그대로 (안정 정렬)", () => {
    const regular = WISHES.filter((w) => !getWish(w.id).limited).map((w) => w.id);
    expect(activeWishes("2026-09-01").filter((w) => !w.limited).map((w) => w.id)).toEqual(regular);
    expect(activeWishes("2026-11-20").map((w) => w.id)).toEqual(regular);
  });
});

describe("todaysWish — 한정 부적을 절대 뽑지 않는다", () => {
  it("2026-01-01 ~ 2027-12-31 전 날짜에서 suneung 미출현", () => {
    const end = Date.UTC(2027, 11, 31);
    let days = 0;
    for (let t = Date.UTC(2026, 0, 1); t <= end; t += 86400000) {
      const d = new Date(t);
      const iso = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
        d.getUTCDate(),
      ).padStart(2, "0")}`;
      expect(todaysWish(iso), iso).not.toBe("suneung");
      days++;
    }
    expect(days).toBe(730);
  });

  it("같은 날짜 → 같은 결과 (결정적)", () => {
    expect(todaysWish("2026-08-11")).toBe(todaysWish("2026-08-11"));
  });
});

describe("결과 페이지 경로 보존", () => {
  it("기간과 무관하게 suneung 은 유효한 WishId (리다이렉트 대상 아님)", () => {
    expect(isWishId("suneung")).toBe(true);
    expect(getWish("suneung").phrase).toBe("찍어도 다 맞는!");
  });
});
