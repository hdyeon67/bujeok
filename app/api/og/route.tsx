// 동적 OG 이미지 — 링크/카톡 미리보기에 부적 소원 문구 노출 (바이럴 유도).
//   next/og(satori) 기반, 외부 키·CDN 불필요. ChemiCheck 하드닝 패턴 적용:
//   - 한글 폰트는 워커 ASSETS 의 KS X 1001 서브셋(337KB) — 모듈 스코프 캐시로 1회만 로드
//   - 솔리드 배경/카드(그라데이션·섀도 없음), 600×315 캔버스로 메모리 최소화
//   - Cache API 로 c(소원)별 1회만 렌더 후 엣지 캐시
//   ※ 서브셋 폰트엔 이모지 글리프가 없어 이모지는 넣지 않는다(두부 방지).

import { ImageResponse } from "next/og";
import { isWishId, getWish } from "@/lib/bujeok/catalog";

export const runtime = "nodejs";

const FONT_PATH = "/fonts/pretendard-kr-subset.ttf";
const W = 600;
const H = 315;
const CREAM = "#fff6e9";
const INK = "#2b2724";

// 폰트를 아이솔레이트당 한 번만 받아 재사용(매 렌더 재fetch/파싱 방지)
let cachedFont: ArrayBuffer | null = null;
async function loadFont(origin: string): Promise<ArrayBuffer | null> {
  if (cachedFont) return cachedFont;
  try {
    const res = await fetch(new URL(FONT_PATH, origin), { cache: "force-cache" });
    if (!res.ok) return null;
    cachedFont = await res.arrayBuffer();
    return cachedFont;
  } catch {
    return null;
  }
}

// OG 이미지는 c별로 결정적 → 엣지에서 오래 캐시.
const OG_HEADERS = {
  "Cache-Control": "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
};

// Cloudflare 는 Worker 가 "생성한" 응답을 헤더만으로 자동 캐시하지 않는다.
// Cache API 로 명시적으로 캐시해, 같은 c 요청은 한 번만 렌더한다.
export async function GET(req: Request): Promise<Response> {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const cacheKey = new Request(new URL(req.url).toString(), { method: "GET" });

  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  const res = await render(req);

  if (cache && res.ok) {
    try {
      await cache.put(cacheKey, res.clone());
    } catch {
      /* 캐시 저장 실패는 무시 */
    }
  }
  return res;
}

async function render(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const c = searchParams.get("c");
  const font = await loadFont(req.url);
  const fonts = font
    ? [{ name: "Pretendard", data: font, weight: 700 as const, style: "normal" as const }]
    : undefined;

  const e = c && isWishId(c) ? getWish(c) : null;

  // 잘못된 소원(c): 브랜드 텍스트 카드로 폴백.
  //   ※ 홈/기본 공유 OG 는 여기서 만들지 않는다 — satori 의 Workers(WASM) 빌드는 이미지를
  //     렌더하지 못해(폰트는 정상) 캐릭터 합성이 불가. 홈 OG 는 정적 /og-home.jpg 를 쓴다.
  if (!e) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            fontFamily: "Pretendard",
            background: CREAM,
            padding: "48px 72px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#e0564a" }}>
              소원 하나 고르면
            </div>
            <div style={{ display: "flex", fontSize: 128, fontWeight: 700, color: INK, marginTop: 10 }}>
              행운부적
            </div>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 700, color: "#7a6f63", marginTop: 20 }}>
              귀여운 행운부적이 뿅 나오는 생성기
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts, headers: OG_HEADERS },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Pretendard",
          background: e.bg,
          padding: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 520,
            padding: "34px 28px",
            borderRadius: 28,
            background: "#ffffff",
            border: `4px solid ${INK}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: e.accent }}>
            {e.label} 부적
          </div>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              marginTop: 10,
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.15,
              color: INK,
            }}
          >
            {e.phrase}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 16, fontSize: 18, fontWeight: 700, color: INK }}>
          행운부적 · 소원 골라 부적 뽑기
        </div>
      </div>
    ),
    { width: W, height: H, fonts, headers: OG_HEADERS },
  );
}
