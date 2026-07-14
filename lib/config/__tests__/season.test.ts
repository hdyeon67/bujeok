import { describe, expect, it } from "vitest";
import { activeSeasonHook, dDay, SEASON_HOOKS } from "../season";

describe("시즌 훅 — 수능 카운트다운", () => {
  it("수능 훅이 config 에 존재", () => {
    const s = SEASON_HOOKS.find((h) => h.id === "suneung-2026");
    expect(s?.targetISO).toBe("2026-11-19");
    expect(s?.featuredCategory).toBe("exam");
  });

  it("D-day 계산: 2026-07-14 → 수능까지 128일", () => {
    expect(dDay("2026-07-14", "2026-11-19")).toBe(128);
  });

  it("당일은 D-0, 지나면 음수", () => {
    expect(dDay("2026-11-19", "2026-11-19")).toBe(0);
    expect(dDay("2026-11-20", "2026-11-19")).toBe(-1);
  });

  it("target 이전엔 활성, 지난 뒤엔 null(범용 모드 전환)", () => {
    expect(activeSeasonHook("2026-07-14")?.id).toBe("suneung-2026");
    expect(activeSeasonHook("2026-11-19")?.id).toBe("suneung-2026"); // 당일 포함
    expect(activeSeasonHook("2026-11-20")).toBeNull();
  });
});
