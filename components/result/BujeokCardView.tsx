"use client";

// 부적 카드 표시 — 서버에서 생성한 세로형 SVG 를 그대로 그린다(결정적).
// 인라인 SVG 를 컨테이너 폭에 맞춰 반응형으로(잘림 방지). 마운트 시 등장 애니메이션.
export function BujeokCardView({
  svg,
  className = "",
}: {
  svg: string;
  className?: string;
}) {
  return (
    <div
      className={`animate-bujeok-rise mx-auto w-full max-w-[300px] overflow-hidden rounded-3xl shadow-lg [&>svg]:block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      // 신뢰된 자체 생성 SVG (사용자 입력은 텍스트 이스케이프 처리됨)
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
