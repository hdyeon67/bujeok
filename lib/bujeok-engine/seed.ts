// 결정적 시드 유틸 — saju-core 의 fnv1a 를 감싼 파생 인덱스 헬퍼.
//
// 같은 (tag, seed) 는 항상 같은 인덱스를 낸다. tag 로 용도를 분리해 서로 다른
// 선택(문양·장식·행운숫자 등)이 상관되지 않게 한다.

import { fnv1a } from "saju-core";

/** 사람 단위 시드: 이름 + 생년월일 (카테고리·날짜 무관) */
export function personSeed(name: string, birth: string): number {
  return fnv1a(`${name.trim()}|${birth.trim()}`);
}

/** 카드 단위 시드: 이름 + 생년월일 + 카테고리 (소원마다 다른 카드) */
export function cardSeed(name: string, birth: string, category: string): number {
  return fnv1a(`${name.trim()}|${birth.trim()}|${category}`);
}

/**
 * tag 로 파생한 결정적 인덱스 (0 ~ n-1).
 * seed 를 tag 와 함께 재해시해 다른 tag 끼리 상관되지 않게 한다.
 */
export function deriveIndex(seed: number, tag: string, n: number): number {
  if (n <= 0) return 0;
  return fnv1a(`${tag}#${seed}`) % n;
}
