"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  activeWishes,
  limitedBadge,
  todaysWish,
  type WishEntry,
  type WishId,
} from "@/lib/bujeok/catalog";
import { todayKST } from "@/lib/util/date";
import { track, referrerType } from "@/lib/analytics";
import { SeasonCountdown } from "@/components/SeasonCountdown";

// 제로 입력 생성기 — 소원만 고르면 부적으로. + 오늘의 부적(날짜 시드).
export function WishGrid() {
  const router = useRouter();
  const [today, setToday] = useState<WishId | null>(null);
  // 날짜는 반드시 마운트 후(클라이언트)에 구한다. 렌더 시점에 todayKST() 를 부르면
  // Cloudflare 정적 셸에 빌드 시각이 굳어 한정 부적이 8/11에 안 켜지거나 11/20에 안 꺼진다.
  // 마운트 전(SSR/정적 셸)에는 todayISO 가 null → 상시 소원만 그린다.
  const [todayISO, setTodayISO] = useState<string | null>(null);

  useEffect(() => {
    track("landing_view", { referrer_type: referrerType() });
    const iso = todayKST();
    setTodayISO(iso);
    setToday(todaysWish(iso));
  }, []);

  // todayISO 가 null 이면 "" 로 판정 → 모든 한정 항목이 미노출(상시만)
  const wishes = activeWishes(todayISO ?? "");
  const limited = wishes.filter((e) => e.limited);
  const regular = wishes.filter((e) => !e.limited);

  function pick(id: string, from: string, isLimited: boolean) {
    // 공통 퍼널 단계(앱 간 비교용) + 앱 고유 이벤트를 함께 발사한다.
    // input_submit 은 앱 간 퍼널 비교용이라 스키마 고정 — 속성 추가 금지.
    track("input_submit", { category: id });
    track("bujeok_generate", { category: id, from, limited: isLimited });
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
          onClick={() => pick(today, "today", false)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-brand py-4 text-lg font-extrabold text-white shadow-pop transition hover:-translate-y-0.5 active:translate-y-0"
        >
          🎁 오늘의 부적 뽑기
        </button>
      )}

      <p className="mb-2 text-center text-sm font-bold text-ink-soft">
        또는 소원을 골라봐 👇
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {/* 기간 한정 — 2열 전체 폭으로 맨 위. 상시 10종이 5행으로 딱 떨어진다 */}
        {limited.map((e) => (
          <LimitedButton
            key={e.id}
            entry={e}
            badge={limitedBadge(e, todayISO ?? "")}
            onPick={() => pick(e.id, "grid", true)}
          />
        ))}

        {regular.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => pick(e.id, "grid", false)}
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

// 기간 한정 부적 버튼 — 전체 폭 + 배지 오버레이.
// 배지 문구는 catalog 의 limited 에서 온다(이미지에 굽지 않음) → 10/20 전환이 배포 없이 일어난다.
function LimitedButton({
  entry,
  badge,
  onPick,
}: {
  entry: WishEntry;
  badge: string | null;
  onPick: () => void;
}) {
  return (
    <div className="relative col-span-2">
      <button
        type="button"
        onClick={onPick}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-[2.5px] border-ink py-5 text-lg font-extrabold text-ink shadow-popsm transition hover:-translate-y-0.5 active:translate-y-0"
        style={{ backgroundColor: entry.bg }}
      >
        <span className="text-3xl" aria-hidden>
          {entry.emoji}
        </span>
        {entry.label}
      </button>
      {badge && (
        <span
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-[2px] border-ink px-3 py-0.5 text-[11px] font-extrabold text-white shadow-popsm"
          style={{ backgroundColor: entry.accent }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
