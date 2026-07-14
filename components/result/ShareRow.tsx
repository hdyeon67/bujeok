"use client";

import { useState } from "react";
import Link from "next/link";
import type { BujeokCard } from "@/lib/bujeok-engine";
import { track } from "@/lib/analytics";
import { SaveButtons } from "./SaveButtons";
import { KakaoShareButton } from "./KakaoShareButton";

// 공유 행 — 카드 PNG 저장(스토리·피드), 링크 복사, 카카오 공유(키 있을 때),
// 친구 CTA. PNG 저장은 페이지의 실제 부적 SVG 를 그대로 래스터화한다.
export function ShareRow({
  card,
  wish,
  emoji,
  title,
  description,
}: {
  card: BujeokCard;
  wish?: string;
  emoji?: string;
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
      <SaveButtons card={card} wish={wish} emoji={emoji} />

      <button
        type="button"
        onClick={copyLink}
        className="w-full rounded-xl border border-hanji-deep bg-white/60 py-3.5 text-base font-semibold text-meok transition hover:border-jusa/50 active:scale-[0.99]"
      >
        {copied ? "링크가 복사됐어요 ✓" : "🔗 결과 링크 복사"}
      </button>

      <KakaoShareButton title={title} description={description} />

      <Link
        href="/"
        onClick={() => track("cta_friend_click")}
        className="block w-full rounded-xl bg-jusa py-3.5 text-center text-base font-bold text-white shadow-md transition hover:bg-jusa-deep active:scale-[0.99]"
      >
        친구 부적도 만들어주기 →
      </Link>
    </div>
  );
}
