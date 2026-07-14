"use client";

// 부적 카드 표시 — 서버에서 생성한 SVG 문자열을 그대로 그린다(결정적).
// 마운트 시 등장 애니메이션. reduce-motion 사용자는 CSS 에서 자동 비활성.
export function BujeokCardView({
  svg,
  className = "",
}: {
  svg: string;
  className?: string;
}) {
  return (
    <div
      className={`animate-bujeok-rise mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl ring-1 ring-hanji-deep animate-bujeok-glow ${className}`}
      // 신뢰된 자체 생성 SVG (사용자 입력은 텍스트 이스케이프 처리됨)
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
