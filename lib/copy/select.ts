// 문구 선택 로직 — 결정적으로 (보완 근거 + 해설 + 팁)을 조합한다.
//
// 같은 결과면 항상 같은 문구가 나오도록 카드 인덱스·시드로 변형을 고른다.
// AI 호출 없음, 사전 생성 풀에서만 뽑는다.

import {
  ohaengMeta,
  deriveIndex,
  personSeed,
  type BujeokResult,
  type DailyFortune,
} from "@/lib/bujeok-engine";
import { BUJEOK_REASONS } from "./reasons";
import { CATEGORY_TIPS } from "./tips";
import { DAILY_LINES } from "./daily";

export interface BujeokCopy {
  /** 보완 오행 근거절 */
  fact: string;
  /** 카테고리×오행 해설 (풀에서 선택) */
  reason: string;
  /** 행동 팁 (풀에서 선택) */
  tip: string;
  /** fact + reason + tip 을 이은 완성 해설 */
  paragraph: string;
}

/** 인덱스로 배열에서 하나 고르기 (안전 범위) */
function at<T>(arr: T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length];
}

/**
 * 부적 결과 → 해설 문구.
 * 해설(reason)은 카드 문양 인덱스(0~7)로, 팁은 사람 시드의 다른 축으로 골라
 * 두 선택이 상관되지 않게 한다.
 */
export function selectBujeokCopy(result: BujeokResult): BujeokCopy {
  const el = result.complement.element;
  const meta = ohaengMeta(el);
  const { name, birth, category } = result.input;

  const fact = `당신의 사주에서 가장 옅은 기운은 ${el}(${meta.symbol})이에요. 이 부적은 ${meta.colorName}빛으로 그 기운을 살며시 채워 줘요.`;

  // 문양 인덱스(0~7)가 곧 8변형 축 → 해설 선택에 그대로 사용
  const reason = at(BUJEOK_REASONS[category][el], result.card.pattern);

  // 팁은 사람 시드의 별도 축으로 (문양과 상관 없이)
  const tipIdx = deriveIndex(
    personSeed(name, birth),
    "tip",
    CATEGORY_TIPS[category].length,
  );
  const tip = at(CATEGORY_TIPS[category], tipIdx);

  return { fact, reason, tip, paragraph: `${fact} ${reason} ${tip}` };
}

/** 데일리 운세 → 오늘의 한 줄. band(구간)×variant(변형)로 결정적 선택 */
export function selectDailyLine(fortune: DailyFortune): string {
  return at(at(DAILY_LINES, fortune.band), fortune.variant);
}
