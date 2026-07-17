import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AdRails } from "@/components/AdRails";
import { siteUrl } from "@/lib/config/site";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/config/flags";

const SITE_URL = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "행운부적 · 소원 골라 부적 뽑기",
    template: "%s · 행운부적",
  },
  description:
    "소원만 고르면 귀여운 행운부적이 뿅! 시험·연애·재물·건강… 소원별 캐릭터 부적을 저장하고 친구랑 공유하는 부적 생성기. 재미·참고용 콘텐츠입니다.",
  openGraph: {
    type: "website",
    siteName: "행운부적",
    title: "행운부적 · 소원 골라 부적 뽑기",
    description: "소원만 고르면 귀여운 행운부적이 뿅! 저장하고 친구랑 공유해요.",
    // 홈/기본 공유 OG: 정적 이미지(캐릭터 합성본).
    // satori 의 Workers(WASM) 빌드는 이미지를 렌더하지 못해(폰트는 됨) 런타임 합성이 불가 →
    // 로컬에서 렌더한 결과를 정적 에셋으로 고정한다. 결과 카드 OG(api/og?c=)는 그대로 유지.
    images: ["/og-home.jpg"],
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
          href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-cream text-ink antialiased">
        <AnalyticsProvider />
        <AdRails />{/* PC 좌·우 세로 레일 (xl+, 단위ID 있을 때) */}
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
