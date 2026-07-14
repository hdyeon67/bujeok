// 부적 결과 조립 — 입력(이름·생년월일·카테고리) → 결정적 부적 결과.
//
// 파이프라인:
//   1) 오행 분석      : ohaengDistribution(birth)                  [saju-core]
//   2) 보완 오행 결정 : complementElement(dist, personSeed)         (동률 시드 처리)
//   3) 부적 카드 조합 : composeCard(complement, category, cardSeed)
//   4) 행운 지수      : luckScore(dist, personSeed)                 (30~95)
// 데일리 운세는 날짜에 의존하므로 이 정적 결과에 포함하지 않고 dailyFortune() 로
// 별도 계산한다(결과 페이지에서 오늘 날짜로 호출).

import { ohaengDistribution, type OhaengDistribution, type Ohaeng } from "saju-core";
import { type CategoryId } from "./categories";
import { complementElement, type ComplementResult } from "./complement";
import { composeCard, type BujeokCard } from "./card";
import { luckScore } from "./luck";
import { cardSeed, personSeed } from "./seed";

export interface BujeokInput {
  name: string;
  birth: string;
  category: CategoryId;
}

export interface BujeokResult {
  input: BujeokInput;
  /** 사주 오행 분포 */
  distribution: OhaengDistribution;
  /** 보완 오행 (부족한 기운) */
  complement: ComplementResult;
  /** 부적 카드 조합 */
  card: BujeokCard;
  /** 행운 지수 (30~95) */
  luck: number;
}

/** 입력 → 결정적 부적 결과. 같은 입력은 항상 완전히 동일한 결과. */
export function buildBujeok(input: BujeokInput): BujeokResult {
  const { name, birth, category } = input;
  const distribution = ohaengDistribution(birth);
  const pSeed = personSeed(name, birth);
  const complement = complementElement(distribution, pSeed);
  const card = composeCard(complement.element, category, cardSeed(name, birth, category));
  const luck = luckScore(distribution, pSeed);
  return { input, distribution, complement, card, luck };
}

/** 결과에서 보완 오행만 빠르게 얻는 헬퍼 */
export function complementOf(name: string, birth: string): Ohaeng {
  return complementElement(ohaengDistribution(birth), personSeed(name, birth))
    .element;
}
