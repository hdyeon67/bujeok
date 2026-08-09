"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWish, isLimitedActive, limitedBadge } from "@/lib/bujeok/catalog";
import { todayKST } from "@/lib/util/date";

// 결과 페이지는 서버 컴포넌트라 날짜 판정을 서버에서 하면 정적 셸에 빌드 시각이 굳는다.
// 그래서 배지·안내문만 이 클라이언트 조각으로 떼어내 마운트 후 계산한다.
// ※ 기간이 지나도 결과 페이지 자체는 그대로 렌더한다(공유 링크·OG 보존). 리다이렉트하지 않는다.
function useTodayISO(): string | null {
  const [iso, setIso] = useState<string | null>(null);
  useEffect(() => setIso(todayKST()), []);
  return iso;
}

/** 헤더 라벨 칩 옆 기간 배지 — 기간 내에만 보인다 */
export function LimitedBadge({ wishId }: { wishId: string }) {
  const todayISO = useTodayISO();
  if (!todayISO) return null;
  const badge = limitedBadge(getWish(wishId), todayISO);
  if (!badge) return null;
  const e = getWish(wishId);
  return (
    <span
      className="rounded-full border-[2px] border-ink px-2.5 py-1 text-[11px] font-extrabold text-white"
      style={{ backgroundColor: e.accent }}
    >
      {badge}
    </span>
  );
}

/** 기간이 지난 한정 부적에만 붙는 안내 한 줄 */
export function LimitedEndedNote({ wishId }: { wishId: string }) {
  const todayISO = useTodayISO();
  if (!todayISO) return null;
  const e = getWish(wishId);
  if (!e.limited || isLimitedActive(e, todayISO)) return null;
  return (
    <p className="mt-3 text-center text-xs font-bold text-ink-faint">
      수능 시즌에만 있던 부적이에요{" "}
      <Link href="/" className="underline">
        다른 소원 고르기
      </Link>
    </p>
  );
}
