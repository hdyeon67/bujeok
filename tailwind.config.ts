import type { Config } from "tailwindcss";

// 행운부적 디자인 토큰: "전통 부적 × 모던 카드".
// 한지 텍스처 배경 + 전통 주사(朱砂) 레드 포인트. 오행 5색은 카드 렌더 시
// lib/bujeok-engine 의 오행 메타(색)에서 직접 가져온다(Phase 2~3).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 한지 배경 계열
        hanji: {
          DEFAULT: "#f5efe1",
          soft: "#ece3cf",
          deep: "#ddd0b3",
        },
        // 먹색 텍스트 계열
        meok: {
          DEFAULT: "#26221c",
          soft: "#4a443a",
          faint: "#7c7462",
        },
        // 주사(朱砂) 레드 포인트
        jusa: {
          DEFAULT: "#c8352b",
          deep: "#9e241d",
        },
        // shadcn 계열 토큰 (EDEN 표준 푸터 등이 사용)
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        // 부적 인장·기원문용 붓글씨 계열 (Phase 3에서 웹폰트 연결)
        brush: ["'Nanum Brush Script'", "'Noto Serif KR'", "ui-serif", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
