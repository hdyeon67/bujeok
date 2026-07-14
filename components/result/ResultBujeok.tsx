"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CategoryId } from "@/lib/bujeok-engine";
import { bujeokImg, type BujeokStyle } from "@/lib/bujeok/catalog";
import { categoryTheme } from "@/lib/config/theme";
import { track } from "@/lib/analytics";
import { KakaoShareButton } from "./KakaoShareButton";

// 부적 카드(이미지) + 스타일 토글(🐯 캐릭터 / ✍️ 글씨) + 저장/복사/카카오/친구 CTA.
export function ResultBujeok({
  category,
  wish,
  phrase,
  initialStyle = "character",
  title,
  description,
}: {
  category: CategoryId;
  wish: string;
  phrase: string;
  initialStyle?: BujeokStyle;
  title: string;
  description: string;
}) {
  const [style, setStyle] = useState<BujeokStyle>(initialStyle);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const theme = categoryTheme(category);
  const src = bujeokImg(category, style);

  useEffect(() => {
    track("result_view", { category });
  }, [category]);

  // 스타일 바꿀 때 실패 상태 초기화 + 하이드레이션 전 로드 실패 감지
  useEffect(() => {
    setFailed(false);
  }, [style]);
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [style]);

  function toggle() {
    const next = style === "character" ? "word" : "character";
    setStyle(next);
    track("style_toggle", { style: next });
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error("no image");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `행운부적_${wish}${style === "word" ? "_글씨" : ""}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      track("share_click", { channel: "png", style });
    } catch {
      /* 이미지 준비 전이면 조용히 무시 */
    } finally {
      setSaving(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      track("share_click", { channel: "link" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const btn =
    "w-full rounded-2xl border-[2.5px] border-ink bg-white py-3.5 text-base font-extrabold text-ink shadow-popsm transition hover:-translate-y-0.5 active:translate-y-0";

  return (
    <div>
      {/* 카드 */}
      <div
        key={style}
        className="animate-bujeok-rise mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px] border-[3px] border-ink shadow-[6px_6px_0_0_rgba(43,39,36,0.15)]"
        style={{ aspectRatio: "3 / 4", backgroundColor: theme.bg }}
      >
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={src}
            alt={`${wish} 부적`}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="font-cute text-3xl font-bold leading-tight" style={{ color: theme.accent }}>
              {phrase}
            </span>
            <span className="text-xs text-ink/50">
              ({style === "word" ? `${category}_word` : category}.png 준비 중)
            </span>
            <div className="text-2xl" aria-hidden>🍀 ⭐ 💖 ✨</div>
          </div>
        )}
      </div>

      {/* 스타일 토글 */}
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          className="rounded-full border-[2.5px] border-ink bg-cream px-5 py-2 text-sm font-extrabold text-ink shadow-popsm transition hover:-translate-y-0.5 active:translate-y-0"
        >
          {style === "character" ? "✍️ 글씨 버전으로" : "🐯 호랑이 버전으로"}
        </button>
      </div>

      {/* 액션 */}
      <div className="mt-5 space-y-2.5">
        <button type="button" onClick={save} disabled={saving} className={`${btn} disabled:opacity-50`}>
          {saving ? "저장 중…" : "📥 이미지 저장"}
        </button>
        <button type="button" onClick={copyLink} className={btn}>
          {copied ? "링크가 복사됐어요! ✓" : "🔗 링크 복사"}
        </button>
        <KakaoShareButton title={title} description={description} />
        <Link
          href="/"
          onClick={() => track("cta_friend_click")}
          className="block w-full rounded-2xl border-[3px] border-ink bg-brand py-3.5 text-center text-base font-extrabold text-white shadow-pop transition hover:-translate-y-0.5 active:translate-y-0"
        >
          다른 부적도 뽑으러 가기 →
        </Link>
      </div>
    </div>
  );
}
