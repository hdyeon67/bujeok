"use client";

// 광고 슬롯 — 애드센스 미신청이라 현재 비활성(NEXT_PUBLIC_ADS_ENABLED=false).
// 승인 후 env 를 켜면 슬롯이 노출되고 adsbygoogle 큐에 push 된다. 결과 페이지엔
// 2개 이내로만 배치.
import { useEffect } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/config/flags";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  useEffect(() => {
    if (!ADS_ENABLED) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* 스크립트 로드 전이면 조용히 무시 */
    }
  }, []);

  if (!ADS_ENABLED) return null;

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
