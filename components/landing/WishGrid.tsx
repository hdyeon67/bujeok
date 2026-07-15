"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WISHES, todaysWish, type WishId } from "@/lib/bujeok/catalog";
import { todayKST } from "@/lib/util/date";
import { track, referrerType } from "@/lib/analytics";
import { SeasonCountdown } from "@/components/SeasonCountdown";

// 제로 입력 생성기 — 소원만 고르면 부적으로. + 오늘의 부적(날짜 시드).
export function WishGrid() {
  const router = useRouter();
  const [today, setToday] = useState<WishId | null>(null);

  useEffect(() => {
    track("landing_view", { referrer_type: referrerType() });
    setToday(todaysWish(todayKST()));
  }, []);

  function pick(id: WishId, from: string) {
    track("bujeok_generate", { category: id, from });
    router.push(`/result?c=${id}`);
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center">
        <SeasonCountdown />
      </div>

      {/* 오늘의 부적 */}
      {today && (
        <button
          type="button"
          onClick={() => pick(today, "today")}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-brand py-4 text-lg font-extrabold text-white shadow-pop transition hover:-translate-y-0.5 active:translate-y-0"
        >
          🎁 오늘의 부적 뽑기
        </button>
      )}

      <p className="mb-2 text-center text-sm font-bold text-ink-soft">
        또는 소원을 골라봐 👇
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {WISHES.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => pick(e.id, "grid")}
            className="flex flex-col items-center gap-1 rounded-2xl border-[2.5px] border-ink py-4 text-base font-extrabold text-ink shadow-popsm transition hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: e.bg }}
          >
            <span className="text-3xl" aria-hidden>
              {e.emoji}
            </span>
            {e.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs font-medium text-ink-faint">
        입력 없이 바로! 저장하고 친구랑 공유해요 ✨
      </p>
    </div>
  );
}
