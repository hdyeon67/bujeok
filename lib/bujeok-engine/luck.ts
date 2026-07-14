// 행운 지수 (30~95, 결정적) — 사주 오행 균형도 기반.
//
// 극단값(0·100)은 공유 심리를 죽이므로 30~95 구간으로 압축한다(케미체크에서
// 검증된 설계). 오행이 고루 퍼질수록 높고, 한쪽으로 쏠릴수록 낮다.
// 마지막에 시드(이름+생년월일) 기반 ±미세 변동을 더하되 재계산 시 동일.
//
// 가중치·구간은 아래 상수 객체(LUCK)로 분리해 조정 가능하게 한다.

import {
  OHAENG_ORDER,
  seededJitter,
  type OhaengDistribution,
} from "saju-core";

export const LUCK = {
  /** 행운 지수 하한 */
  min: 30,
  /** 행운 지수 상한 */
  max: 95,
  /** 시드 기반 미세 변동 폭 (±) */
  jitterRange: 5,
} as const;

/**
 * 오행 균형도 0~1.
 * 6글자가 5오행에 얼마나 고르게 퍼졌는지를 (최대-최소) 스프레드로 측정.
 *   가장 고름 [2,1,1,1,1] → spread 1 → 0.83
 *   가장 쏠림 [6,0,0,0,0] → spread 6 → 0
 */
export function balanceRatio(dist: OhaengDistribution): number {
  const counts = OHAENG_ORDER.map((el) => dist.counts[el]);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const spread = max - min; // 0 ~ total
  const denom = dist.total || 1;
  return 1 - spread / denom;
}

/**
 * 행운 지수 (LUCK.min ~ LUCK.max 정수).
 * @param dist ohaengDistribution 결과
 * @param seed personSeed(name, birth)
 */
export function luckScore(dist: OhaengDistribution, seed: number): number {
  const balance = balanceRatio(dist); // 0~1
  const span = LUCK.max - LUCK.min;
  const base = LUCK.min + balance * span;
  const jitter = seededJitter(seed, LUCK.jitterRange);
  const raw = Math.round(base + jitter);
  return Math.max(LUCK.min, Math.min(LUCK.max, raw));
}
