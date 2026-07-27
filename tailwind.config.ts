import type { Config } from "tailwindcss";
import { BRAND, CREAM, INK } from "./lib/config/brand";

// 행운부적 디자인 토큰 — 밝고 귀여운 캐릭터 굿즈 톤(최고심/earpearp 결).
// 크림 배경 + 잉크(검정 외곽) + 밝은 포인트. 카테고리 색은 lib/config/theme.ts.
// ⚠️ 빨강 계단은 lib/config/brand.ts 가 단일 출처다 — 여기에 새 빨강을 직접 적지 말 것.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: CREAM,
          soft: "#fdeccf",
          deep: "#f6dcae",
        },
        ink: {
          DEFAULT: INK,
          soft: "#5a534c",
          faint: "#8a8178",
        },
        // 빨강 계단(밝음→어두움). DEFAULT=light 라 기존 `bg-brand` 클래스는 그대로 동작한다.
        brand: {
          DEFAULT: BRAND.light,
          light: BRAND.light,
          deep: BRAND.deep,
          dark: BRAND.dark,
        },
        // shadcn 계열 토큰
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        // 손글씨 귀여운 제목용 (Gaegu)
        cute: ["Gaegu", "'Nanum Brush Script'", "Pretendard", "cursive"],
      },
      boxShadow: {
        pop: "5px 5px 0 0 rgba(43,39,36,0.14)",
        popsm: "3px 3px 0 0 rgba(43,39,36,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
