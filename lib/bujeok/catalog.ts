// 부적 카탈로그 — 생성기의 데이터 소스. 부적 1개 = 여기 엔트리 + 이미지.
// 부적을 늘리려면 CategoryId 확장 + 아래 PHRASE 추가 + public/bujeok 이미지만 추가.
//
// 이미지 파일명 규칙: 캐릭터 = /bujeok/{id}.png, 글씨 = /bujeok/{id}_word.png

import { CATEGORIES, type CategoryId } from "@/lib/bujeok-engine";
import { categoryTheme } from "@/lib/config/theme";

export type BujeokStyle = "character" | "word";

export interface BujeokEntry {
  category: CategoryId;
  label: string;
  emoji: string;
  /** 큰 손글씨 소원 문구 */
  phrase: string;
  /** 카드 아래 짧은 응원 한 줄 */
  cheer: string;
  /** 배경색 */
  bg: string;
}

// 소원별 문구·응원 (사주 해설 대체 — 짧고 유쾌하게)
const PHRASE: Record<CategoryId, { phrase: string; cheer: string }> = {
  exam: { phrase: "무엇이든 붙어버려!", cheer: "공부한 만큼 시험장에서 다 쏟아내자. 넌 이미 붙었어!" },
  interview: { phrase: "말문이 팡 터지는!", cheer: "준비한 첫 마디만 떠올려. 오늘 넌 말빨 최강!" },
  love: { phrase: "사랑이 굴러오는!", cheer: "먼저 웃어봐. 인연은 용기 낸 사람 편이야!" },
  wealth: { phrase: "돈복이 팡팡 터지는!", cheer: "들어올 복은 다 들어온다. 지갑 활짝 열어둬!" },
  health: { phrase: "무병장수 파워업!", cheer: "물 한 잔, 스트레칭 한 번. 오늘도 파이팅!" },
};

export const CATALOG: BujeokEntry[] = CATEGORIES.map((c) => ({
  category: c.id,
  label: c.label,
  emoji: c.emoji,
  phrase: PHRASE[c.id].phrase,
  cheer: PHRASE[c.id].cheer,
  bg: categoryTheme(c.id).bg,
}));

const BY_ID: Record<string, BujeokEntry> = Object.fromEntries(
  CATALOG.map((e) => [e.category, e]),
);

export function getEntry(id: CategoryId): BujeokEntry {
  return BY_ID[id] ?? CATALOG[0];
}

/** 부적 이미지 경로 (스타일별) */
export function bujeokImg(id: CategoryId, style: BujeokStyle): string {
  return `/bujeok/${id}${style === "word" ? "_word" : ""}.png`;
}

/** 오늘의 부적 — 날짜 시드로 카탈로그에서 1개 (같은 날 동일). 생일 불필요 */
export function todaysBujeok(todayISO: string): CategoryId {
  let h = 2166136261;
  for (let i = 0; i < todayISO.length; i++) {
    h ^= todayISO.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return CATALOG[(h >>> 0) % CATALOG.length].category;
}
