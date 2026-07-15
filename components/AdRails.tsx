"use client";

import { usePathname } from "next/navigation";
import { AdFit } from "./AdFit";
import {
  ADFIT_UNIT_PC_LEFT,
  ADFIT_UNIT_PC_RIGHT,
  ADFIT_UNIT_MOBILE,
} from "@/lib/config/flags";

/**
 * PC 좌·우 세로 사이드 광고(160×600). xl(1280px) 이상에서만 노출.
 * 그 미만(모바일·태블릿)에선 숨기고 하단 가로 배너(320×100)를 쓴다.
 * 단위 ID가 없으면 렌더하지 않는다.
 * 랜딩("/")에는 광고를 두지 않는다(기획: 랜딩 광고 없음).
 */
export function AdRails() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  if (!ADFIT_UNIT_PC_LEFT && !ADFIT_UNIT_PC_RIGHT) return null;
  return (
    <>
      <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden items-center pl-3 xl:flex">
        <div className="pointer-events-auto">
          <AdFit unit={ADFIT_UNIT_PC_LEFT} width={160} height={600} />
        </div>
      </div>
      <div className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden items-center pr-3 xl:flex">
        <div className="pointer-events-auto">
          <AdFit unit={ADFIT_UNIT_PC_RIGHT} width={160} height={600} />
        </div>
      </div>
    </>
  );
}

/** 모바일 하단 가로 배너(320×100). xl 미만에서만, 본문 하단 흐름에 배치. */
export function AdBottomMobile({ className = "" }: { className?: string }) {
  if (!ADFIT_UNIT_MOBILE) return null;
  return (
    <div className={`xl:hidden ${className}`}>
      <AdFit unit={ADFIT_UNIT_MOBILE} width={320} height={100} />
    </div>
  );
}
