import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isWishId, getWish } from "@/lib/bujeok/catalog";
import { ResultBujeok } from "@/components/result/ResultBujeok";
import { CrossPromo } from "@/components/CrossPromo";
import { PremiumLock } from "@/components/PremiumLock";
import { AdBottomMobile } from "@/components/AdRails";

type SearchParams = Promise<{ c?: string; s?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { c } = await searchParams;
  if (!c || !isWishId(c)) return { title: "행운부적" };
  const e = getWish(c);
  const title = `${e.label} 부적 — ${e.phrase}`;
  const description = `${e.phrase} 귀여운 행운부적을 뽑아보세요!`;
  const og = `/api/og?c=${c}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { c, s } = await searchParams;
  if (!c || !isWishId(c)) redirect("/");

  const e = getWish(c);
  const initialStyle = s === "word" ? "word" : "character";

  return (
    <main className="mx-auto w-full max-w-md px-5 py-6">
      <header className="mb-5 flex items-center justify-between">
        <Link href="/" className="font-cute text-2xl font-bold text-brand">
          🐯 행운부적
        </Link>
        <span
          className="rounded-full border-[2px] border-ink px-3 py-1 text-xs font-extrabold"
          style={{ backgroundColor: e.bg }}
        >
          {e.emoji} {e.label}
        </span>
      </header>

      <p className="mb-4 text-center text-[15px] font-extrabold text-ink">
        {e.phrase} 🎉
      </p>

      <ResultBujeok
        wishId={e.id}
        wish={e.label}
        phrase={e.phrase}
        bg={e.bg}
        accent={e.accent}
        initialStyle={initialStyle}
        title={`${e.label} 부적 — ${e.phrase}`}
        description={`${e.phrase} 나도 뽑아보기!`}
      />

      {/* 응원 한 줄 */}
      <div className="sticker mt-6 p-5 text-center">
        <p className="text-[15px] font-bold leading-relaxed text-ink">🍀 {e.cheer}</p>
      </div>

      {/* 프리미엄 (잠금) */}
      <div className="mt-5">
        <PremiumLock />
      </div>

      {/* 크로스 프로모션 */}
      <div className="mt-7">
        <CrossPromo />
      </div>

      {/* 모바일 하단 가로 배너 (PC는 좌·우 레일이 대신) */}
      <AdBottomMobile className="mt-6" />

      <p className="mt-6 text-center text-xs leading-relaxed text-ink-faint">
        재미·참고용 엔터테인먼트예요. 종교적·주술적 효력을 보장하지 않아요.
      </p>
    </main>
  );
}
