import { ImageResponse } from "next/og";
import { decodePayload } from "@/lib/share";
import { buildBujeok, getCategory, ohaengMeta } from "@/lib/bujeok-engine";

export const runtime = "nodejs";

// 링크 프리뷰용 OG 이미지(1200×630). 한자 인장은 satori 폰트 이슈가 있어
// 이모지 + 한글 라벨로 브랜드 카드를 구성한다(실제 부적 카드의 한자 버전은
// 페이지 내 SVG·PNG 저장에서 제공). Pretendard 를 fetch 해 satori 에 넘긴다.

const FONT_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/public/static/Pretendard-Bold.otf";
const FONT_REG =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/public/static/Pretendard-Regular.otf";

async function font(url: string): Promise<ArrayBuffer | null> {
  try {
    const r = await fetch(url, { cache: "force-cache" });
    return r.ok ? await r.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const HANJI = "#f5efe1";
const MEOK = "#26221c";
const JUSA = "#c8352b";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const payload = decodePayload(searchParams.get("d"));
  const [bold, reg] = await Promise.all([font(FONT_BOLD), font(FONT_REG)]);
  const fonts = [
    ...(bold ? [{ name: "Pretendard", data: bold, weight: 700 as const, style: "normal" as const }] : []),
    ...(reg ? [{ name: "Pretendard", data: reg, weight: 400 as const, style: "normal" as const }] : []),
  ];
  const fontOpt = fonts.length ? fonts : undefined;

  if (!payload) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: HANJI,
            color: JUSA,
            fontSize: 84,
            fontWeight: 700,
          }}
        >
          🧧 행운부적
        </div>
      ),
      { width: 1200, height: 630, fonts: fontOpt },
    );
  }

  const result = buildBujeok({ name: payload.n, birth: payload.b, category: payload.c });
  const cat = getCategory(payload.c);
  const meta = ohaengMeta(result.complement.element);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(135deg, ${HANJI} 55%, ${meta.hex}33 100%)`,
          fontFamily: "Pretendard",
          color: MEOK,
          padding: 72,
          alignItems: "center",
          gap: 56,
        }}
      >
        {/* 인장 메달 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 380,
            borderRadius: 28,
            background: JUSA,
            color: HANJI,
            boxShadow: "0 20px 50px -20px rgba(200,53,43,0.6)",
          }}
        >
          <div style={{ display: "flex", fontSize: 130 }}>{cat.emoji}</div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, marginTop: 10 }}>
            {cat.label}
          </div>
        </div>

        {/* 텍스트 */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 40, color: "#7c7462" }}>
            {payload.n}님의 부적
          </div>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, marginTop: 8 }}>
            나만의 {cat.label} 부적
          </div>
          <div style={{ display: "flex", marginTop: 34, gap: 16 }}>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                color: "#fff",
                background: meta.hex,
                borderRadius: 16,
                padding: "8px 22px",
              }}
            >
              보완 {result.complement.element} 기운
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 700,
                color: JUSA,
                background: "#fff",
                border: `2px solid ${JUSA}`,
                borderRadius: 16,
                padding: "8px 22px",
              }}
            >
              행운 {result.luck}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 44, color: "#a89a7a", letterSpacing: 4 }}>
            행운부적 · bujeok.fineboll.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: fontOpt },
  );
}
