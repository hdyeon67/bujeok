// 카테고리별 색 테마 — 생성한 부적 일러스트(최고심/earpearp 결)의 배경색에서 추출.
// 결과 페이지 액센트·칩·배지에 사용. 밝고 채도 높은 플랫 컬러.

import type { CategoryId } from "@/lib/bujeok-engine";

export interface CategoryTheme {
  /** 카드 배경색(일러스트와 동일 계열) */
  bg: string;
  /** 진한 액센트(버튼·배지·텍스트) */
  accent: string;
  /** 액센트 위 텍스트색 */
  on: string;
}

export const CATEGORY_THEME: Record<CategoryId, CategoryTheme> = {
  exam: { bg: "#c7e8ae", accent: "#4a9d54", on: "#ffffff" },
  interview: { bg: "#ffdb3d", accent: "#d99400", on: "#ffffff" },
  love: { bg: "#f97cb2", accent: "#e0468d", on: "#ffffff" },
  wealth: { bg: "#f8962e", accent: "#d96f0c", on: "#ffffff" },
  health: { bg: "#a6d63f", accent: "#5ea320", on: "#ffffff" },
};

export function categoryTheme(id: CategoryId): CategoryTheme {
  return CATEGORY_THEME[id] ?? CATEGORY_THEME.exam;
}

/** 부적 일러스트 에셋 경로 (public/bujeok/{id}.png) */
export function bujeokImage(id: CategoryId): string {
  return `/bujeok/${id}.png`;
}
