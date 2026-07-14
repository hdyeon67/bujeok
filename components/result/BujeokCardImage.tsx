"use client";

import { useEffect, useRef, useState } from "react";
import type { CategoryId } from "@/lib/bujeok-engine";
import { categoryTheme, bujeokImage } from "@/lib/config/theme";

// 부적 카드 = 카테고리 일러스트 이미지(세로 3:4). 이미지가 아직 없으면 카테고리
// 색 플레이스홀더로 대체(문구+이모지+두들)해 레이아웃이 항상 보이게 한다.
export function BujeokCardImage({
  category,
  wish,
  emoji,
  className = "",
}: {
  category: CategoryId;
  wish: string;
  emoji: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const theme = categoryTheme(category);

  // 하이드레이션 전에 이미지가 이미 실패했으면 onError 를 놓치므로 마운트 시 확인
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div
      className={`animate-bujeok-rise mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px] border-[3px] border-ink shadow-[6px_6px_0_0_rgba(43,39,36,0.15)] ${className}`}
      style={{ aspectRatio: "3 / 4", backgroundColor: theme.bg }}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={bujeokImage(category)}
          alt={`${wish} 부적`}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl" aria-hidden>
            {emoji}
          </span>
          <span
            className="font-cute text-3xl font-bold leading-tight"
            style={{ color: theme.accent }}
          >
            {wish}
          </span>
          <span className="text-sm text-ink/60">
            (일러스트 준비 중 — public/bujeok/{category}.png)
          </span>
          <div className="mt-1 flex gap-2 text-2xl" aria-hidden>
            🍀 ⭐ 💖 ✨
          </div>
        </div>
      )}
    </div>
  );
}
