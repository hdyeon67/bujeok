import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/content/guides";
import { getCategory } from "@/lib/bujeok-engine";

export const metadata: Metadata = {
  title: "부적 가이드",
  description:
    "수능 부적, 면접 부적, 연애 부적, 재물 부적, 건강 부적까지 — 소원별 부적 이야기와 나만의 부적 만들기.",
};

export default function GuideIndex() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <header className="mb-6">
        <Link href="/" className="text-sm text-meok-faint">
          ← 홈으로
        </Link>
        <h1 className="mt-3 font-brush text-3xl font-extrabold text-meok">
          부적 가이드
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-meok-soft">
          소원별 부적 이야기를 읽고, 나에게 맞는 부적을 만들어 보세요.
        </p>
      </header>

      <div className="space-y-2.5">
        {GUIDES.map((g) => {
          const cat = getCategory(g.category);
          return (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              className="flex items-center gap-3 rounded-xl border border-hanji-deep/60 bg-white/50 px-4 py-4 transition hover:border-jusa/40"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-jusa/10 text-xl">
                {cat.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-meok">
                  {g.keyword}
                </span>
                <span className="block text-xs text-meok-faint">{g.metaTitle}</span>
              </span>
              <span className="text-meok-faint" aria-hidden>
                ›
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
