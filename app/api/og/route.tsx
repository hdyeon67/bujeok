import { ImageResponse } from "next/og";
import { isWishId, getWish } from "@/lib/bujeok/catalog";

export const runtime = "nodejs";

// 링크 프리뷰 OG(1200×630). 부적 소원 문구 + 이모지 + 카테고리 색. Pretendard fetch.
const FONT_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/public/static/Pretendard-Bold.otf";

async function font(url: string): Promise<ArrayBuffer | null> {
  try {
    const r = await fetch(url, { cache: "force-cache" });
    return r.ok ? await r.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const c = searchParams.get("c");
  const bold = await font(FONT_BOLD);
  const fonts = bold
    ? [{ name: "Pretendard", data: bold, weight: 700 as const, style: "normal" as const }]
    : undefined;

  const valid = c && isWishId(c);
  const e = valid ? getWish(c) : null;
  const bg = e ? e.bg : "#fff6e9";

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
          background: bg,
          fontFamily: "Pretendard",
          color: "#2b2724",
          padding: 60,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 120 }}>{e ? e.emoji : "🧧"}</div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, marginTop: 12 }}>
          {e ? e.phrase : "행운부적"}
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 30, color: "#5a534c" }}>
          🐯 행운부적 · 소원 골라 부적 뽑기
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
