// 오행별 표현 메타데이터 (색·방위·상징) — 부적 카드와 데일리 운세가 공유.
//
// 전통 오방색·오방위를 현대적으로 쓴다. 값은 결정적 매핑이며 앱 전반에서
// 동일하게 참조한다.

import type { Ohaeng } from "saju-core";

export interface OhaengMeta {
  ohaeng: Ohaeng;
  /** 전통 색 이름 */
  colorName: string;
  /** 카드/UI 대표 HEX (오방색의 현대적 변형) */
  hex: string;
  /** 방위 */
  direction: string;
  /** 한 글자 상징(계절 이미지) */
  symbol: string;
}

// 목=청(동), 화=적(남), 토=황(중앙), 금=백(서), 수=흑(북)
export const OHAENG_META: Record<Ohaeng, OhaengMeta> = {
  목: { ohaeng: "목", colorName: "청록", hex: "#2f9e7d", direction: "동", symbol: "木" },
  화: { ohaeng: "화", colorName: "주홍", hex: "#e0563b", direction: "남", symbol: "火" },
  토: { ohaeng: "토", colorName: "황토", hex: "#d9a441", direction: "중앙", symbol: "土" },
  금: { ohaeng: "금", colorName: "백금", hex: "#c9ccce", direction: "서", symbol: "金" },
  수: { ohaeng: "수", colorName: "먹빛", hex: "#3a4a63", direction: "북", symbol: "水" },
};

export function ohaengMeta(o: Ohaeng): OhaengMeta {
  return OHAENG_META[o];
}
