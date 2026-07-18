// 크로스 프로모션 대상 앱 목록 (config 배열).
// 앱이 늘면 항목만 추가하면 결과 페이지 하단 배너가 자동 노출된다.
//
// href 는 안정 커스텀 도메인(fineboll.com 서브도메인)을 쓴다 — 호스팅 컷오버와
// 무관하게 동일 유지.

export interface PromoApp {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  href: string;
  /** 배너 배경 힌트 컬러 */
  color: string;
}

export const PROMOS: PromoApp[] = [
  {
    id: "saju",
    emoji: "🔮",
    title: "내 사주가 궁금하다면?",
    desc: "생년월일로 보는 사주풀이",
    href: "https://saju.fineboll.com",
    color: "#7c5cff",
  },
  {
    id: "chemicheck",
    emoji: "💞",
    title: "궁합도 궁금하다면?",
    desc: "이름과 생년월일로 보는 케미체크",
    href: "https://chemicheck.fineboll.com",
    color: "#ff5db1",
  },
  {
    id: "goodday",
    emoji: "📅",
    title: "좋은 날 잡아야 한다면?",
    desc: "생년월일로 보는 택일, 좋은날",
    href: "https://goodday.fineboll.com",
    color: "#2f9e7d",
  },
  {
    id: "shinjo",
    emoji: "🗣️",
    title: "내 언어 나이는?",
    desc: "신조어로 재보는 언어 나이 테스트",
    href: "https://shinjo.fineboll.com",
    color: "#a24bff",
  },
];
