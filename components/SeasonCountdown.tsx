"use client";

import { useEffect, useState } from "react";
import { activeSeasonHook, dDay, type SeasonHook } from "@/lib/config/season";
import { todayKST } from "@/lib/util/date";

// 시즌 카운트다운 배지. "오늘"은 클라이언트에서 계산해 캐시 staleness 를 피한다.
// 활성 시즌이 없으면(수능이 지나면) 아무것도 렌더하지 않아 자동으로 범용 모드가 된다.
export function SeasonCountdown({ className = "" }: { className?: string }) {
  const [hook, setHook] = useState<SeasonHook | null>(null);
  const [d, setD] = useState<number>(0);

  useEffect(() => {
    const today = todayKST();
    const active = activeSeasonHook(today);
    setHook(active);
    if (active) setD(dDay(today, active.targetISO));
  }, []);

  if (!hook) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-jusa/30 bg-jusa/10 px-4 py-1.5 text-sm font-semibold text-jusa ${className}`}
    >
      <span aria-hidden>🔥</span>
      <span>
        {hook.label} D-{d === 0 ? "DAY" : d}
      </span>
    </div>
  );
}
