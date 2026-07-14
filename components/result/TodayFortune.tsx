"use client";

import { useEffect, useState } from "react";
import { dailyFortune, type DailyFortune } from "@/lib/bujeok-engine";
import { selectDailyLine } from "@/lib/copy";
import { todayKST } from "@/lib/util/date";
import { track } from "@/lib/analytics";

// 오늘의 행운 한 줄 — "오늘"을 클라이언트에서 계산해 매일 갱신되고 캐시에
// 영향받지 않게 한다. 같은 날 재방문 시 항상 동일(날짜 시드).
export function TodayFortune({ name, birth }: { name: string; birth: string }) {
  const [f, setF] = useState<DailyFortune | null>(null);
  const [line, setLine] = useState<string>("");

  useEffect(() => {
    const today = todayKST();
    const fortune = dailyFortune(name, birth, today);
    setF(fortune);
    setLine(selectDailyLine(fortune));

    // 재방문 여부: 쿠키 대신 localStorage 불리언 플래그(비식별)
    let isReturn = false;
    try {
      isReturn = localStorage.getItem("bujeok_seen") === "1";
      localStorage.setItem("bujeok_seen", "1");
    } catch {
      /* 스토리지 차단 시 무시 */
    }
    track("daily_fortune_view", { is_return_visit: isReturn });
  }, [name, birth]);

  return (
    <div className="rounded-2xl border border-hanji-deep/60 bg-white/50 p-5">
      <p className="mb-2 text-sm font-semibold text-jusa">오늘의 행운 한 줄</p>
      {f ? (
        <>
          <p className="text-[15px] font-medium leading-relaxed text-meok">{line}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Attr label="행운 색" value={f.luckyColorName} swatch={f.luckyColorHex} />
            <Attr label="행운 숫자" value={String(f.luckyNumber)} />
            <Attr label="행운 방위" value={`${f.luckyDirection}쪽`} />
          </div>
        </>
      ) : (
        <div className="h-5 w-3/4 animate-pulse rounded bg-hanji-deep/50" />
      )}
    </div>
  );
}

function Attr({
  label,
  value,
  swatch,
}: {
  label: string;
  value: string;
  swatch?: string;
}) {
  return (
    <div className="rounded-xl bg-hanji-soft/70 py-2.5">
      <p className="text-xs text-meok-faint">{label}</p>
      <p className="mt-0.5 flex items-center justify-center gap-1.5 text-sm font-semibold text-meok">
        {swatch && (
          <span
            className="inline-block size-3 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: swatch }}
            aria-hidden
          />
        )}
        {value}
      </p>
    </div>
  );
}
