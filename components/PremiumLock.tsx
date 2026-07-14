"use client";

// 프리미엄 부적(고해상도·인쇄용) — 사업자 미등록이라 결제 잠금.
// PAYMENT_ENABLED=true 가 되면 실제 구매 버튼으로 교체(Phase 별도).
// 잠금 상태 클릭은 premium_lock_click 으로 계측해 결제 수요를 사전 측정한다.
import { PAYMENT_ENABLED } from "@/lib/config/flags";
import { track } from "@/lib/analytics";

export function PremiumLock() {
  if (PAYMENT_ENABLED) {
    return (
      <button
        type="button"
        className="w-full rounded-xl border border-jusa bg-jusa/10 py-3.5 text-base font-semibold text-jusa"
      >
        ✨ 고해상도·인쇄용 프리미엄 부적 받기
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => track("premium_lock_click")}
      className="w-full rounded-xl border border-dashed border-hanji-deep bg-hanji-soft/40 px-4 py-3.5 text-center"
    >
      <span className="block text-sm font-semibold text-meok-soft">
        ✨ 고해상도·인쇄용 프리미엄 부적{" "}
        <span className="ml-1 rounded-full bg-meok/10 px-2 py-0.5 text-xs">
          오픈 준비 중
        </span>
      </span>
      <span className="mt-1 block text-xs text-meok-faint">
        준비되면 가장 먼저 알려드릴게요. (탭해서 관심 표시)
      </span>
    </button>
  );
}
