// 소원 카테고리 (5종) — 부적의 중앙 인장 문자·기원문 계열을 결정한다.
//
// id 는 URL 인코딩·시드에 쓰이므로 안정적이어야 한다(바꾸면 기존 공유 링크가 깨짐).

export type CategoryId = "exam" | "interview" | "love" | "wealth" | "health";

export interface Category {
  id: CategoryId;
  /** 화면 라벨 */
  label: string;
  /** 버튼용 이모지 */
  emoji: string;
  /** 부적 중앙 인장 한자 (1자) */
  seal: string;
  /** SEO/검색 키워드 (guide 페이지·메타에 사용) */
  keyword: string;
}

export const CATEGORIES: Category[] = [
  { id: "exam", label: "시험 합격", emoji: "📚", seal: "合", keyword: "수능 부적" },
  { id: "interview", label: "면접 성공", emoji: "💼", seal: "通", keyword: "면접 부적" },
  { id: "love", label: "연애 성취", emoji: "💗", seal: "戀", keyword: "연애 부적" },
  { id: "wealth", label: "재물 상승", emoji: "💰", seal: "財", keyword: "재물 부적" },
  { id: "health", label: "건강 기원", emoji: "🍀", seal: "康", keyword: "건강 부적" },
];

const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, Category>,
);

/** 카테고리 id 유효성 검사 (공유 URL 디코딩 시 사용) */
export function isCategoryId(v: unknown): v is CategoryId {
  return typeof v === "string" && v in CATEGORY_MAP;
}

/** id → 카테고리 (유효하지 않으면 첫 카테고리로 폴백) */
export function getCategory(id: CategoryId): Category {
  return CATEGORY_MAP[id] ?? CATEGORIES[0];
}
