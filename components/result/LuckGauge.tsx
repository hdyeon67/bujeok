// 행운 지수 게이지 (30~95). 순수 표시 컴포넌트.
import { LUCK } from "@/lib/bujeok-engine";

function luckLabel(v: number): string {
  if (v >= 85) return "오늘 최고의 행운";
  if (v >= 72) return "기분 좋은 흐름";
  if (v >= 58) return "무난하고 편안";
  if (v >= 45) return "잔잔한 기운";
  return "차분히 채우는 날";
}

export function LuckGauge({ luck }: { luck: number }) {
  const pct = Math.round(((luck - LUCK.min) / (LUCK.max - LUCK.min)) * 100);
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-meok-soft">행운 지수</span>
        <span className="text-sm text-meok-faint">{luckLabel(luck)}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-hanji-deep/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-jusa/70 to-jusa"
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
        <span className="w-12 text-right font-brush text-2xl font-extrabold text-jusa">
          {luck}
        </span>
      </div>
    </div>
  );
}
