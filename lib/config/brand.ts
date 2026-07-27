// 행운부적 브랜드 색 — **단일 출처(single source of truth)**.
//
// 왜 이 파일이 생겼나(2026-07-27): 앱 안에 빨강이 5종 흩어져 있었다.
//   tailwind brand #ff5b3a · brand.deep #e8431f · OG 라벨 #e0564a(하드코딩) ·
//   아이콘 #c8352b→#a3231d · globals --primary hsl(12 100% 61%)=#ff6038(미세 드리프트).
// 값 자체는 같은 오렌지레드 계열(hue 35.6~42.0°)이었지만 **서로의 관계가 정의돼 있지 않아서**
// 새 화면을 만들 때마다 "비슷한 빨강"이 하나 더 생기는 구조였다. 이제 계단을 이름으로 고정한다.
//
// 계단(밝음 → 어두움). 색상은 건드리지 않았다 — 이미 라이브에 나가 있는 값들이다.
//   light  #ff5b3a  L* 60.8  주 액센트: 타이틀·CTA·시즌칩            (구 brand.DEFAULT)
//   deep   #e8431f  L* 53.2  호버·프레스, 크림 위 작은 텍스트          (구 brand.deep)
//   dark   #a3231d  L* 36.1  아이덴티티 판: 아이콘·PWA 테마, 고대비 텍스트
// 톤 다운(연한 배경)은 새 토큰을 만들지 말고 **알파 유틸리티**로 (`bg-brand/10`, `border-brand/40`).
//
// 대비(크림 #fff6e9 기준): light 2.88:1 · deep 3.73:1 · dark 6.97:1
//   → 크림 위 **작은 텍스트에는 light 를 쓰지 말 것**(AA 라지 3:1 미달). deep 이상을 쓴다.
//
// 미러링 주의: 아래 두 곳은 이 모듈을 import 할 수 없다(정적 파일).
//   app/icon.svg — 배경 fill 이 dark 와 같아야 한다
//   app/globals.css — CSS 변수. --brand/--primary 가 light 와 같아야 한다
// 둘의 드리프트는 lib/config/__tests__/brand.test.ts 가 잡는다(값을 바꾸면 테스트가 먼저 깨진다).

export const BRAND = {
  /** 주 액센트 — 타이틀·CTA·시즌칩 */
  light: "#ff5b3a",
  /** 호버·프레스, 크림 위 작은 텍스트(대비 3.73:1) */
  deep: "#e8431f",
  /** 아이덴티티 판 — 아이콘·PWA 테마색(대비 6.97:1) */
  dark: "#a3231d",
} as const;

/** 배경 크림 — 앱 body·OG 카드 바탕 */
export const CREAM = "#fff6e9";
/** 잉크 — 본문·외곽선 */
export const INK = "#2b2724";

export type BrandStep = keyof typeof BRAND;
