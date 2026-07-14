// 데일리 운세 (결정적, 날짜 시드) — "오늘의 행운 한 줄"용 구조 데이터.
//
// 오늘 날짜의 60갑자 일진(日辰)과 사용자 일간(日干)·띠(연지)를 조합해 오늘의
// 운세 강도(밴드 0~9)와 행운 색·숫자·방위를 낸다. 같은 (사람, 날짜) 는 항상
// 동일하고, 날짜가 바뀌면 값도 바뀐다(날짜 포함 시드).
//
// 실제 문구(10 구간 × 4 변형 템플릿 풀)는 Phase 2 에서 band+variant 로 선택한다.

import {
  dayOhaeng,
  fnv1a,
  iljin,
  jijiScore,
  ohaengScore,
  OHAENG_ORDER,
  seededJitter,
  ttiJiji,
} from "saju-core";
import { ohaengMeta } from "./ohaeng-meta";

export const DAILY = {
  /** 밴드 개수 (0 ~ BAND_COUNT-1) */
  bandCount: 10,
  /** 문구 변형 개수 */
  variantCount: 4,
  /** 날짜 시드 미세 변동 폭 (±) */
  jitterRange: 6,
  /** 축별 가중치 (합 1.0) */
  weights: {
    /** 일간 오행 vs 오늘 일진 천간 오행 */
    gan: 0.5,
    /** 띠(연지) vs 오늘 일지 */
    jiji: 0.3,
    /** 일간 오행 vs 오늘 일지 오행 */
    ganJi: 0.2,
  },
} as const;

export interface DailyFortune {
  dateISO: string;
  /** 오늘의 일진 이름 (예: "병술") */
  iljinName: string;
  /** 운세 강도 원점수 (0~100) */
  score: number;
  /** 운세 밴드 (0 ~ bandCount-1) — 템플릿 그룹 선택용 */
  band: number;
  /** 문구 변형 (0 ~ variantCount-1) */
  variant: number;
  /** 행운 색 이름 */
  luckyColorName: string;
  /** 행운 색 HEX */
  luckyColorHex: string;
  /** 행운 방위 */
  luckyDirection: string;
  /** 행운 숫자 (1~9) */
  luckyNumber: number;
}

/**
 * 데일리 운세.
 * @param name  사용자 이름 (행운 숫자·색 개인화용)
 * @param birth 생년월일 YYYY-MM-DD
 * @param dateISO 오늘 날짜 YYYY-MM-DD
 */
export function dailyFortune(
  name: string,
  birth: string,
  dateISO: string,
): DailyFortune {
  const userOhaeng = dayOhaeng(birth);
  const userTti = ttiJiji(birth);
  const today = iljin(dateISO);

  const raw =
    DAILY.weights.gan * ohaengScore(userOhaeng, today.ganOhaeng) +
    DAILY.weights.jiji * jijiScore(userTti, today.jiji) +
    DAILY.weights.ganJi * ohaengScore(userOhaeng, today.jiOhaeng);

  const seed = fnv1a(`${name.trim()}|${birth.trim()}|${dateISO.trim()}`);
  const score = Math.max(
    0,
    Math.min(100, Math.round(raw + seededJitter(seed, DAILY.jitterRange))),
  );

  const band = Math.min(DAILY.bandCount - 1, Math.floor(score / 10));
  const variant = fnv1a(`variant#${seed}`) % DAILY.variantCount;

  // 행운 오행: 날짜 시드로 결정 → 색·방위 도출
  const luckyEl = OHAENG_ORDER[fnv1a(`lucky-el#${seed}`) % OHAENG_ORDER.length];
  const meta = ohaengMeta(luckyEl);
  const luckyNumber = (fnv1a(`lucky-num#${seed}`) % 9) + 1;

  return {
    dateISO,
    iljinName: today.gapjaName,
    score,
    band,
    variant,
    luckyColorName: meta.colorName,
    luckyColorHex: meta.hex,
    luckyDirection: meta.direction,
    luckyNumber,
  };
}
