import type { Config } from "tailwindcss";

// 행운부적 디자인 토큰 — 밝고 귀여운 캐릭터 굿즈 톤(최고심/earpearp 결).
// 크림 배경 + 잉크(검정 외곽) + 밝은 포인트. 카테고리 색은 lib/config/theme.ts.
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
          DEFAULT: "#fff6e9",
          soft: "#fdeccf",
          deep: "#f6dcae",
        },
        ink: {
          DEFAULT: "#2b2724",
          soft: "#5a534c",
          faint: "#8a8178",
        },
        brand: {
          DEFAULT: "#ff5b3a",
          deep: "#e8431f",
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
