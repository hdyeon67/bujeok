// 부적 카드 조합 (결정적) — SVG 레이어 인덱스를 산출한다.
//
// 조합 공간:  배경 5(보완 오행) × 인장 5(카테고리) × 문양 8(시드) × 장식 4(시드)
//            = 800 조합. 실제 SVG 에셋은 Phase 2 에서 인덱스에 매핑한다.
//
//   - 배경(background): 보완 오행이 결정 → 오행 5색 계열
//   - 인장(seal):       카테고리가 결정 → 중앙 인장 문자
//   - 문양(pattern):    카드 시드가 결정 → 8종 문양 계열
//   - 장식(decoration): 카드 시드가 결정 → 4종 테두리/장식 변형

import type { Ohaeng } from "saju-core";
import type { CategoryId } from "./categories";
import { getCategory } from "./categories";
import { ohaengMeta } from "./ohaeng-meta";
import { deriveIndex } from "./seed";

export const PATTERN_COUNT = 8;
export const DECORATION_COUNT = 4;
/** 이론상 총 조합 수 (배경 5 × 인장 5 × 문양 8 × 장식 4) */
export const TOTAL_COMBINATIONS = 5 * 5 * PATTERN_COUNT * DECORATION_COUNT;

export interface BujeokCard {
  /** 배경 오행 (보완 오행) */
  background: Ohaeng;
  /** 배경 대표색 HEX */
  colorHex: string;
  /** 중앙 인장 문자 (카테고리) */
  seal: string;
  /** 카테고리 id */
  category: CategoryId;
  /** 문양 인덱스 (0 ~ PATTERN_COUNT-1) */
  pattern: number;
  /** 장식 변형 인덱스 (0 ~ DECORATION_COUNT-1) */
  decoration: number;
}

/**
 * 부적 카드 조합.
 * @param complement 보완 오행 (배경 결정)
 * @param category   소원 카테고리 (인장 결정)
 * @param cardSeedValue cardSeed(name, birth, category)
 */
export function composeCard(
  complement: Ohaeng,
  category: CategoryId,
  cardSeedValue: number,
): BujeokCard {
  return {
    background: complement,
    colorHex: ohaengMeta(complement).hex,
    seal: getCategory(category).seal,
    category,
    pattern: deriveIndex(cardSeedValue, "pattern", PATTERN_COUNT),
    decoration: deriveIndex(cardSeedValue, "decoration", DECORATION_COUNT),
  };
}
