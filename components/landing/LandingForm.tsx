"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, isCategoryId, type CategoryId } from "@/lib/bujeok-engine";
import { resultHref } from "@/lib/share";
import { activeSeasonHook } from "@/lib/config/season";
import { todayKST } from "@/lib/util/date";
import { track, referrerType } from "@/lib/analytics";
import { SeasonCountdown } from "@/components/SeasonCountdown";

export function LandingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [busy, setBusy] = useState(false);

  // 카테고리 기본 선택: 가이드에서 넘어온 ?c= 가 우선, 없으면 시즌(수능 등).
  useEffect(() => {
    track("landing_view", { referrer_type: referrerType() });
    const fromQuery = new URLSearchParams(window.location.search).get("c");
    if (fromQuery && isCategoryId(fromQuery)) {
      setCategory((prev) => prev ?? fromQuery);
      return;
    }
    const season = activeSeasonHook(todayKST());
    if (season) setCategory((prev) => prev ?? season.featuredCategory);
  }, []);

  const nameOk = name.trim().length >= 1 && name.trim().length <= 20;
  const birthOk = /^\d{4}-\d{2}-\d{2}$/.test(birth);
  const ready = nameOk && birthOk && category !== null;

  const maxDate = useMemo(() => todayKST(), []);

  function submit() {
    if (!ready || busy) return;
    setBusy(true);
    track("input_submit", { category });
    router.push(resultHref(name.trim(), birth, category as CategoryId));
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center">
        <SeasonCountdown />
      </div>

      {/* 이름 */}
      <label className="mb-1.5 block text-sm font-medium text-meok-soft">이름</label>
      <input
        type="text"
        inputMode="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 또는 별명"
        maxLength={20}
        className="mb-4 w-full rounded-xl border border-hanji-deep bg-white/60 px-4 py-3 text-base outline-none transition focus:border-jusa focus:ring-2 focus:ring-jusa/20"
      />

      {/* 생년월일 */}
      <label className="mb-1.5 block text-sm font-medium text-meok-soft">생년월일</label>
      <input
        type="date"
        value={birth}
        min="1920-01-01"
        max={maxDate}
        onChange={(e) => setBirth(e.target.value)}
        className="mb-5 w-full rounded-xl border border-hanji-deep bg-white/60 px-4 py-3 text-base outline-none transition focus:border-jusa focus:ring-2 focus:ring-jusa/20"
      />

      {/* 소원 카테고리 */}
      <label className="mb-2 block text-sm font-medium text-meok-soft">
        어떤 소원을 담을까요?
      </label>
      <div className="mb-6 grid grid-cols-3 gap-2">
        {CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-sm font-medium transition ${
                active
                  ? "border-jusa bg-jusa/10 text-jusa shadow-sm"
                  : "border-hanji-deep bg-white/50 text-meok-soft hover:border-jusa/40"
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {c.emoji}
              </span>
              {c.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!ready || busy}
        className="w-full rounded-xl bg-jusa py-4 text-lg font-bold text-white shadow-md transition enabled:hover:bg-jusa-deep enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "부적을 그리는 중…" : "내 부적 만들기"}
      </button>

      <p className="mt-3 text-center text-xs text-meok-faint">
        입력 정보는 저장되지 않고 결과 링크에만 담겨요.
      </p>
    </div>
  );
}
