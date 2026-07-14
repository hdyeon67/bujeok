"use client";

import { useState } from "react";
import Link from "next/link";
import type { CategoryId } from "@/lib/bujeok-engine";
import { track } from "@/lib/analytics";
import { SaveButtons } from "./SaveButtons";
import { KakaoShareButton } from "./KakaoShareButton";

// 공유 행 — 이미지 저장, 링크 복사, 카카오 공유(키 있을 때), 친구 CTA.
export function ShareRow({
  category,
  wish,
  title,
  description,
}: {
  category: CategoryId;
  wish: string;
  title: string;
  description: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(url);
      track("share_click", { channel: "link" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-2.5">
      <SaveButtons category={category} wish={wish} />

      <button
        type="button"
        onClick={copyLink}
        className="w-full rounded-2xl border-[2.5px] border-ink bg-white py-3.5 text-base font-extrabold text-ink shadow-popsm transition hover:-translate-y-0.5 active:translate-y-0"
      >
        {copied ? "링크가 복사됐어요! ✓" : "🔗 결과 링크 복사"}
      </button>

      <KakaoShareButton title={title} description={description} />

      <Link
        href="/"
        onClick={() => track("cta_friend_click")}
        className="block w-full rounded-2xl border-[3px] border-ink bg-brand py-3.5 text-center text-base font-extrabold text-white shadow-pop transition hover:-translate-y-0.5 active:translate-y-0"
      >
        친구 부적도 만들어주기 →
      </Link>
    </div>
  );
}
