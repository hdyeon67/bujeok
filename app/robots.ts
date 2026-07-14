import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 결과 페이지는 개인 입력 기반이라 색인 제외
      disallow: "/result",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
