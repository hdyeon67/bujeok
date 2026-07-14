// 사이트 절대 URL 해석 (서버용) — OG 이미지·메타데이터 절대경로에 사용.
//
// 우선순위:
//   1) NEXT_PUBLIC_SITE_URL (명시 설정 시 최우선)
//   2) VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL
//   3) localhost (로컬)
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
