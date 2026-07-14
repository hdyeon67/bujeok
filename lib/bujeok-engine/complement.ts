// 보완 오행 결정 — 부적이 채워줄 "가장 부족한 기운".
//
// 사주 오행 분포에서 개수가 가장 적은 오행을 고른다. 동률이면 시드(이름+생년월일)
// 로 결정적으로 하나를 선택한다. 같은 사람은 소원 카테고리와 무관하게 항상 같은
// 보완 오행을 갖는다(부족한 기운은 사주에서 오는 것이므로 카테고리 독립).

import { OHAENG_ORDER, type Ohaeng, type OhaengDistribution } from "saju-core";
import { deriveIndex } from "./seed";

export interface ComplementResult {
  /** 보완할(부족한) 오행 */
  element: Ohaeng;
  /** 해당 오행의 개수 */
  count: number;
  /** 동률로 시드 선택이 일어났는지 */
  tied: boolean;
  /** 동률 후보들 */
  candidates: Ohaeng[];
}

/**
 * 오행 분포 + 시드 → 보완 오행.
 * @param dist ohaengDistribution 결과
 * @param seed personSeed(name, birth)
 */
export function complementElement(
  dist: OhaengDistribution,
  seed: number,
): ComplementResult {
  const min = Math.min(...OHAENG_ORDER.map((el) => dist.counts[el]));
  const candidates = OHAENG_ORDER.filter((el) => dist.counts[el] === min);
  const tied = candidates.length > 1;
  const element = tied
    ? candidates[deriveIndex(seed, "complement", candidates.length)]
    : candidates[0];
  return { element, count: min, tied, candidates };
}
