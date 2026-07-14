import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { decodePayload } from "@/lib/share";
import { buildBujeok, getCategory } from "@/lib/bujeok-engine";
import { selectBujeokCopy } from "@/lib/copy";
import { renderBujeokSvg } from "@/lib/bujeok-svg";
import { BujeokCardView } from "@/components/result/BujeokCardView";
import { LuckGauge } from "@/components/result/LuckGauge";
import { TodayFortune } from "@/components/result/TodayFortune";
import { ShareRow } from "@/components/result/ShareRow";
import { CrossPromo } from "@/components/CrossPromo";
import { PremiumLock } from "@/components/PremiumLock";
import { AdSlot } from "@/components/AdSlot";
import { ResultAnalytics } from "@/components/result/ResultAnalytics";
import { scoreBand } from "@/lib/analytics";

// Next 15: searchParams 는 Promise 로 전달된다.
type SearchParams = Promise<{ d?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { d } = await searchParams;
  const payload = decodePayload(d);
  if (!payload) return { title: "행운부적" };
  const cat = getCategory(payload.c);
  const title = `${payload.n}님의 ${cat.label} 부적`;
  const result = buildBujeok({ name: payload.n, birth: payload.b, category: payload.c });
  const description = `사주에 부족한 ${result.complement.element} 기운을 채우는 나만의 부적. 행운 지수 ${result.luck}.`;
  const og = `/api/og?d=${encodeURIComponent(d ?? "")}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { d } = await searchParams;
  const payload = decodePayload(d);
  if (!payload) redirect("/");

  const input = { name: payload.n, birth: payload.b, category: payload.c };
  const result = buildBujeok(input);
  const copy = selectBujeokCopy(result);
  const cat = getCategory(payload.c);
  const svg = renderBujeokSvg(result.card, { ratio: "1:1", wish: cat.label });

  return (
    <main className="mx-auto w-full max-w-md px-5 py-6">
      <ResultAnalytics category={payload.c} scoreBand={scoreBand(result.luck)} />
      <header className="mb-5 flex items-center justify-between">
        <Link href="/" className="font-brush text-xl font-extrabold text-meok">
          🧧 행운부적
        </Link>
        <span className="rounded-full bg-jusa/10 px-3 py-1 text-xs font-semibold text-jusa">
          {cat.emoji} {cat.label}
        </span>
      </header>

      <p className="mb-3 text-center text-[15px] text-meok-soft">
        <b className="text-meok">{payload.n}</b>님을 위한 부적이 완성됐어요
      </p>

      {/* 부적 카드 (등장 애니메이션) */}
      <BujeokCardView svg={svg} className="mb-5" />

      {/* 행운 지수 */}
      <div className="mb-5 rounded-2xl border border-hanji-deep/60 bg-white/50 p-5">
        <LuckGauge luck={result.luck} />
      </div>

      {/* 해설 */}
      <div className="mb-5 rounded-2xl border border-hanji-deep/60 bg-hanji-soft/50 p-5">
        <p className="mb-2 text-sm font-semibold text-jusa">부적 풀이</p>
        <p className="text-[15px] leading-relaxed text-meok">{copy.paragraph}</p>
      </div>

      {/* 광고 슬롯 1 (카드 아래) — 현재 비활성 */}
      <AdSlot slot="result-top" className="mb-5" />

      {/* 오늘의 행운 한 줄 */}
      <div className="mb-5">
        <TodayFortune name={payload.n} birth={payload.b} />
      </div>

      {/* 프리미엄 (잠금) */}
      <div className="mb-5">
        <PremiumLock />
      </div>

      {/* 공유 + 친구 CTA */}
      <div className="mb-7">
        <ShareRow
          card={result.card}
          title={`${payload.n}님의 ${cat.label} 부적`}
          description={`사주에 부족한 ${result.complement.element} 기운을 채우는 나만의 부적 · 행운 ${result.luck}`}
        />
      </div>

      {/* 크로스 프로모션 */}
      <div className="mb-6">
        <CrossPromo />
      </div>

      {/* 광고 슬롯 2 (페이지 하단) — 현재 비활성 */}
      <AdSlot slot="result-bottom" />

      <p className="mt-6 text-center text-xs leading-relaxed text-meok-faint">
        재미·참고용 엔터테인먼트예요. 종교적·주술적 효력을 보장하지 않아요.
        <br />
        입력 정보는 서버에 저장되지 않아요.
      </p>
    </main>
  );
}
