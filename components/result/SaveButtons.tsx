"use client";

import { useState } from "react";
import type { CategoryId } from "@/lib/bujeok-engine";
import { bujeokImage } from "@/lib/config/theme";
import { track } from "@/lib/analytics";

// 부적 카드 이미지(카테고리 일러스트 PNG) 저장. 정적 에셋을 fetch 해 다운로드.
export function SaveButtons({ category, wish }: { category: CategoryId; wish: string }) {
  const [busy, setBusy] = useState(false);

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(bujeokImage(category));
      if (!res.ok) throw new Error("no image");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `행운부적_${wish}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      track("share_click", { channel: "png" });
    } catch {
      /* 이미지 준비 전이면 조용히 무시 — 링크 복사 대안 존재 */
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={save}
      disabled={busy}
      className="w-full rounded-2xl border-[2.5px] border-ink bg-white py-3.5 text-base font-extrabold text-ink shadow-popsm transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
    >
      {busy ? "저장 중…" : "📥 이미지 저장"}
    </button>
  );
}
