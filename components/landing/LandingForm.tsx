"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, isCategoryId, type CategoryId } from "@/lib/bujeok-engine";
import { resultHref } from "@/lib/share";
import { activeSeasonHook } from "@/lib/config/season";
import { categoryTheme } from "@/lib/config/theme";
import { todayKST } from "@/lib/util/date";
import { track, referrerType } from "@/lib/analytics";
import { SeasonCountdown } from "@/components/SeasonCountdown";

export function LandingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [busy, setBusy] = useState(false);

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

  const inputCls =
    "w-full rounded-2xl border-[2.5px] border-ink/15 bg-cream px-4 py-3 text-base font-medium outline-none transition focus:border-brand";

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center">
        <SeasonCountdown />
      </div>

      <label className="mb-1.5 block text-sm font-bold text-ink-soft">이름</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 또는 별명"
        maxLength={20}
        className={`mb-4 ${inputCls}`}
      />

      <label className="mb-1.5 block text-sm font-bold text-ink-soft">생년월일</label>
      <input
        type="date"
        value={birth}
        min="1920-01-01"
        max={maxDate}
        onChange={(e) => setBirth(e.target.value)}
        className={`mb-5 ${inputCls}`}
      />

      <label className="mb-2 block text-sm font-bold text-ink-soft">
        어떤 소원을 담을까요?
      </label>
      <div className="mb-6 grid grid-cols-3 gap-2">
        {CATEGORIES.map((c) => {
          const active = category === c.id;
          const t = categoryTheme(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className="flex flex-col items-center gap-1 rounded-2xl border-[2.5px] px-2 py-3 text-sm font-bold transition active:scale-95"
              style={{
                borderColor: active ? "var(--ink)" : "rgba(43,39,36,0.14)",
                backgroundColor: active ? t.bg : "#fff",
                boxShadow: active ? "3px 3px 0 0 rgba(43,39,36,0.16)" : "none",
              }}
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
        className="w-full rounded-2xl border-[3px] border-ink bg-brand py-4 text-lg font-extrabold text-white shadow-pop transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:border-ink/15 disabled:bg-cream-deep disabled:text-ink-faint disabled:shadow-none"
      >
        {busy ? "부적 만드는 중… 🐯" : "내 부적 만들기 🧧"}
      </button>

      <p className="mt-3 text-center text-xs font-medium text-ink-faint">
        입력 정보는 저장되지 않고 결과 링크에만 담겨요.
      </p>
    </div>
  );
}
