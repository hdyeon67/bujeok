import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { siteUrl } from "@/lib/config/site";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/config/flags";

const SITE_URL = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "행운부적 · 나만의 부적 카드",
    template: "%s · 행운부적",
  },
  description:
    "이름과 생년월일, 소원을 입력하면 사주 오행을 분석해 부족한 기운을 채우는 '나만의 부적 카드'를 만들어 드려요. 오늘의 행운 한 줄도 함께. 재미·참고용 콘텐츠입니다.",
  openGraph: {
    type: "website",
    siteName: "행운부적",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@700;800&family=Noto+Serif+KR:wght@500;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-hanji text-meok antialiased">
        <AnalyticsProvider />
        {ADS_ENABLED && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
        {children}
        <Footer
          logoSrc={null}
          links={[
            { label: "부적 가이드", href: "/guide" },
            { label: "소개", href: "/about" },
            { label: "개인정보처리방침", href: "/privacy" },
          ]}
          note="본 서비스는 재미·참고용 엔터테인먼트예요 · 개인정보를 저장하지 않아요"
        />
      </body>
    </html>
  );
}
