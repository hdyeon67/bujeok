import { describe, expect, it } from "vitest";
import { BUJEOK_REASONS } from "../reasons";
import { CATEGORY_TIPS } from "../tips";
import { DAILY_LINES } from "../daily";
import { selectBujeokCopy, selectDailyLine } from "../select";
import { buildBujeok, dailyFortune, CATEGORIES } from "@/lib/bujeok-engine";
import { OHAENG_ORDER } from "saju-core";

const CATS = CATEGORIES.map((c) => c.id);

describe("문구 풀 규모 & 구조", () => {
  it("부적 해설 = 카테고리5 × 오행5 × 8변형 = 200개", () => {
    let count = 0;
    for (const cat of CATS) {
      for (const el of OHAENG_ORDER) {
        const pool = BUJEOK_REASONS[cat][el];
        expect(pool.length).toBe(8);
        count += pool.length;
      }
    }
    expect(count).toBe(200);
  });

  it("카테고리 팁 = 5 × 8 = 40개", () => {
    let count = 0;
    for (const cat of CATS) {
      expect(CATEGORY_TIPS[cat].length).toBe(8);
      count += CATEGORY_TIPS[cat].length;
    }
    expect(count).toBe(40);
  });

  it("데일리 = 10구간 × 4변형 = 40개", () => {
    expect(DAILY_LINES.length).toBe(10);
    let count = 0;
    for (const band of DAILY_LINES) {
      expect(band.length).toBe(4);
      count += band.length;
    }
    expect(count).toBe(40);
  });

  it("전체 사전 생성 문구는 240개 이상", () => {
    const reasons = CATS.reduce(
      (s, c) => s + OHAENG_ORDER.reduce((t, e) => t + BUJEOK_REASONS[c][e].length, 0),
      0,
    );
    const tips = CATS.reduce((s, c) => s + CATEGORY_TIPS[c].length, 0);
    const daily = DAILY_LINES.reduce((s, b) => s + b.length, 0);
    expect(reasons + tips + daily).toBeGreaterThanOrEqual(240);
  });
});

describe("문구 품질 — 비어있지 않음 & 종결어미", () => {
  function allStrings(): string[] {
    const out: string[] = [];
    for (const c of CATS) {
      for (const e of OHAENG_ORDER) out.push(...BUJEOK_REASONS[c][e]);
      out.push(...CATEGORY_TIPS[c]);
    }
    for (const b of DAILY_LINES) out.push(...b);
    return out;
  }

  it("모든 문구가 충분한 길이", () => {
    for (const s of allStrings()) expect(s.trim().length).toBeGreaterThan(6);
  });

  it("모든 문구가 문장부호(. ! ?)로 끝난다", () => {
    for (const s of allStrings()) expect(/[.!?]$/.test(s.trim())).toBe(true);
  });
});

describe("톤 가이드 — 불안 조장·효력 보장 표현 금지", () => {
  function allStrings(): string[] {
    const out: string[] = [];
    for (const c of CATS) {
      for (const e of OHAENG_ORDER) out.push(...BUJEOK_REASONS[c][e]);
      out.push(...CATEGORY_TIPS[c]);
    }
    for (const b of DAILY_LINES) out.push(...b);
    return out;
  }

  it("불안 조장어(큰일/망하/불행/저주/액운 등) 없음", () => {
    const banned = ["큰일", "망하", "재수없", "불행", "저주", "액운", "화를 입", "위험해"];
    for (const s of allStrings()) {
      for (const w of banned) expect(s).not.toContain(w);
    }
  });

  it("효력 보장 표현(반드시/100%/절대/무조건) 없음", () => {
    const banned = ["반드시", "100%", "절대", "무조건", "확실히 됩니다"];
    for (const s of allStrings()) {
      for (const w of banned) expect(s).not.toContain(w);
    }
  });
});

describe("selectBujeokCopy / selectDailyLine — 결정적 선택", () => {
  const input = { name: "홍길동", birth: "1998-03-21", category: "exam" as const };

  it("같은 결과면 같은 문구", () => {
    const a = selectBujeokCopy(buildBujeok(input));
    const b = selectBujeokCopy(buildBujeok(input));
    expect(a).toEqual(b);
  });

  it("해설은 보완 오행 근거 + 풀 해설 + 팁을 모두 포함", () => {
    const copy = selectBujeokCopy(buildBujeok(input));
    expect(copy.paragraph).toContain(copy.fact);
    expect(copy.paragraph).toContain(copy.reason);
    expect(copy.paragraph).toContain(copy.tip);
    // 실제 보완 오행이 근거절에 인용된다
    const el = buildBujeok(input).complement.element;
    expect(copy.fact).toContain(el);
  });

  it("데일리 한 줄은 band/variant 에 맞는 문구", () => {
    const f = dailyFortune("홍길동", "1998-03-21", "2026-07-14");
    const line = selectDailyLine(f);
    expect(line).toBe(DAILY_LINES[f.band][f.variant]);
    // 같은 (사람·날짜) 는 항상 같은 줄
    expect(selectDailyLine(dailyFortune("홍길동", "1998-03-21", "2026-07-14"))).toBe(line);
  });

  it("카테고리별로 해설 풀이 실제 반영된다", () => {
    for (const cat of CATS) {
      const copy = selectBujeokCopy(buildBujeok({ ...input, category: cat }));
      const el = buildBujeok({ ...input, category: cat }).complement.element;
      expect(BUJEOK_REASONS[cat][el]).toContain(copy.reason);
    }
  });
});
