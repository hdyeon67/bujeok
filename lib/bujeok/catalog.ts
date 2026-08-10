// 부적 카탈로그 — 생성기의 데이터 소스. 부적 1개 = 여기 엔트리 + 이미지.
// 부적을 늘리려면 WISHES 에 엔트리 1줄 + public/bujeok 이미지 2장(캐릭터/글씨)만 추가.
//
// ★ WISHES 배열 순서 = 화면 노출 순서. 추가할 위치가 곧 노출될 위치다.
//   - 상시 소원은 짝수로 유지한다(그리드 2열 — 홀수면 마지막 행에 빈 칸이 생긴다).
//   - 기간 한정 부적은 limited 블록을 달면 activeWishes() 가 맨 앞으로 올린다.
//
// (사주 CategoryId 와 분리 — 보류된 사주 코드/테스트에 영향 없이 소원을 늘리기 위함)
// 이미지 파일명: 캐릭터 = /bujeok/{id}.png, 글씨 = /bujeok/{id}_word.png

import { utc } from "@/lib/config/season";

export type BujeokStyle = "character" | "word";

export interface WishEntry {
  id: string;
  label: string; // 버튼 라벨
  emoji: string;
  phrase: string; // 큰 손글씨 소원 문구
  cheer: string; // 카드 아래 짧은 응원
  bg: string; // 카드/칩 배경색 (일러스트와 동일 계열)
  accent: string; // 진한 액센트
  /** 기간 한정 부적 — 없으면 상시 노출 */
  limited?: {
    from: string; // "2026-08-11" — 이 날부터 노출
    until: string; // "2026-11-19" — 이 날 포함, 다음날 자동 제외
    badge: string; // "수능 시즌 한정"
    finalFrom?: string; // "2026-10-20" — 이 날부터 finalBadge 로 교체
    finalBadge?: string; // "11/19까지만"
  };
}

export const WISHES = [
  { id: "suneung", label: "수능 대박", emoji: "✏️", phrase: "잘 보고 오자!", cheer: "공부한 건 다 나오고, 안 한 건 안 나온다. 11월 19일, 넌 이미 준비됐어!", bg: "#ffe0e0", accent: "#d43d3d",
    limited: { from: "2026-08-11", until: "2026-11-19", badge: "수능 시즌 한정", finalFrom: "2026-10-20", finalBadge: "11/19까지만" } },
  { id: "exam", label: "시험 합격", emoji: "📚", phrase: "무엇이든 붙어버려!", cheer: "공부한 만큼 시험장에서 다 쏟아내자. 넌 이미 붙었어!", bg: "#c7e8ae", accent: "#4a9d54" },
  { id: "interview", label: "면접 성공", emoji: "💼", phrase: "말문이 팡 터지는!", cheer: "준비한 첫 마디만 떠올려. 오늘 넌 말빨 최강!", bg: "#ffdb3d", accent: "#d99400" },
  { id: "love", label: "연애 성취", emoji: "💗", phrase: "사랑이 굴러오는!", cheer: "먼저 웃어봐. 인연은 용기 낸 사람 편이야!", bg: "#f97cb2", accent: "#e0468d" },
  { id: "wealth", label: "재물 상승", emoji: "💰", phrase: "돈복이 팡팡 터지는!", cheer: "들어올 복은 다 들어온다. 지갑 활짝 열어둬!", bg: "#f8962e", accent: "#d96f0c" },
  { id: "health", label: "건강 기원", emoji: "🍀", phrase: "무병장수 파워업!", cheer: "물 한 잔, 스트레칭 한 번. 오늘도 파이팅!", bg: "#a6d63f", accent: "#5ea320" },
  { id: "luck", label: "행운 대박", emoji: "🌈", phrase: "온 세상이 나를 도와!", cheer: "오늘은 되는 날! 뭘 해도 술술 풀릴 거야.", bg: "#8fd3f4", accent: "#2f9fd6" },
  { id: "diet", label: "다이어트", emoji: "🍎", phrase: "살이 쏙 빠지는!", cheer: "물 한 잔, 한 정거장 걷기. 오늘부터 가벼워지자!", bg: "#b8ead0", accent: "#2fae7a" },
  { id: "calm", label: "마음 평온", emoji: "🌙", phrase: "마음이 편안해지는!", cheer: "숨 크게 한 번. 다 잘될 거야, 천천히 가자.", bg: "#cbb6f0", accent: "#7b5bd6" },
  { id: "social", label: "인싸력", emoji: "🎤", phrase: "인싸력 뿜뿜!", cheer: "먼저 인사 한마디. 오늘 너 인기 폭발이야!", bg: "#ff9a86", accent: "#e5603f" },
  { id: "selfup", label: "자존감", emoji: "👑", phrase: "나는야 최고!", cheer: "거울 보고 씨익. 넌 원래 최고였어!", bg: "#ffd98a", accent: "#e0a01f" },
] as const;

export type WishId = (typeof WISHES)[number]["id"];

const BY_ID: Record<string, WishEntry> = Object.fromEntries(WISHES.map((w) => [w.id, w]));

export function isWishId(v: unknown): v is WishId {
  return typeof v === "string" && v in BY_ID;
}

export function getWish(id: string): WishEntry {
  return BY_ID[id] ?? WISHES[0];
}

/** 부적 이미지 경로 (스타일별) */
export function wishImg(id: string, style: BujeokStyle): string {
  return `/bujeok/${id}${style === "word" ? "_word" : ""}.png`;
}

/**
 * 기간 한정 부적이 오늘 살아있는가. 비한정이면 항상 true.
 * 날짜는 utc() 로 ms 변환해 비교한다 — 문자열 비교 금지(잘못된 날짜가 조용히 통과한다).
 * 파싱 실패(13월·2월 30일·"20261119"·"")는 NaN → false = 미노출.
 */
export function isLimitedActive(entry: WishEntry, todayISO: string): boolean {
  if (!entry.limited) return true;
  const t = utc(todayISO);
  const from = utc(entry.limited.from);
  const until = utc(entry.limited.until);
  if (Number.isNaN(t) || Number.isNaN(from) || Number.isNaN(until)) return false;
  return t >= from && t <= until;
}

/** 오늘 붙일 배지 문구. 비한정·기간 밖이면 null. finalFrom 이후면 finalBadge */
export function limitedBadge(entry: WishEntry, todayISO: string): string | null {
  const l = entry.limited;
  if (!l || !isLimitedActive(entry, todayISO)) return null;
  if (l.finalFrom && l.finalBadge) {
    const f = utc(l.finalFrom);
    if (!Number.isNaN(f) && utc(todayISO) >= f) return l.finalBadge;
  }
  return l.badge;
}

/** 오늘 노출할 소원 목록 — 한정 항목을 맨 앞으로 (안정 정렬) */
export function activeWishes(todayISO: string): readonly WishEntry[] {
  const alive: WishEntry[] = WISHES.filter((w) => isLimitedActive(w, todayISO));
  return alive.sort((a, b) => (b.limited ? 1 : 0) - (a.limited ? 1 : 0));
}

const isLimited = (w: WishEntry) => !!w.limited;

/** 상시 소원 — 오늘의 부적 후보. 한정판이 걸리면 기간 밖 사용자에게 깨진 경로가 나간다 */
const REGULAR_WISHES = WISHES.filter((w) => !isLimited(w));

/** 오늘의 부적 — 날짜 시드로 1개 (같은 날 동일). 생일 불필요. 상시 소원에서만 뽑는다 */
export function todaysWish(todayISO: string): WishId {
  let h = 2166136261;
  for (let i = 0; i < todayISO.length; i++) {
    h ^= todayISO.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return REGULAR_WISHES[(h >>> 0) % REGULAR_WISHES.length].id;
}
