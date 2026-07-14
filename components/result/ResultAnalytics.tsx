"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import type { CategoryId } from "@/lib/bujeok-engine";

// 결과 페이지 진입 계측. 비식별 값(카테고리·점수 구간)만 전송.
export function ResultAnalytics({
  category,
  scoreBand,
}: {
  category: CategoryId;
  scoreBand: string;
}) {
  useEffect(() => {
    track("result_view", { category, score_band: scoreBand });
  }, [category, scoreBand]);
  return null;
}
