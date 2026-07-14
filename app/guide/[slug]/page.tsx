import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, GUIDE_SLUGS } from "@/lib/content/guides";
import { getCategory } from "@/lib/bujeok-engine";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(decodeURIComponent(slug));
  if (!guide) return { title: "가이드" };
  return {
    title: guide.metaTitle,
    description: guide.description,
    openGraph: { title: guide.metaTitle, description: guide.description, images: ["/logo.png"] },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = getGuide(decodeURIComponent(slug));
  if (!guide) notFound();

  const cat = getCategory(guide.category);

  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <nav className="mb-5 text-sm text-ink-faint">
        <Link href="/guide" className="hover:text-brand">
          가이드
        </Link>
        <span className="mx-1.5">›</span>
        <span>{guide.keyword}</span>
      </nav>

      <header className="mb-6">
        <div className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-2xl">
          {cat.emoji}
        </div>
        <h1 className="text-[26px] font-extrabold leading-snug text-ink">
          {guide.title}
        </h1>
      </header>

      <p className="mb-7 text-[15px] leading-relaxed text-ink-soft">{guide.lead}</p>

      {/* 상단 CTA */}
      <Link
        href={`/result?c=${guide.category}`}
        className="mb-8 block w-full rounded-xl bg-brand py-4 text-center text-lg font-bold text-white shadow-md transition hover:bg-brand-deep"
      >
        {cat.label} 부적 만들기 →
      </Link>

      <article className="space-y-6">
        {guide.sections.map((s) => (
          <section key={s.h}>
            <h2 className="mb-2 text-lg font-bold text-ink">{s.h}</h2>
            <p className="text-[15px] leading-relaxed text-ink-soft">{s.p}</p>
          </section>
        ))}
      </article>

      <section className="mt-9">
        <h2 className="mb-3 text-lg font-bold text-ink">자주 묻는 질문</h2>
        <div className="space-y-3">
          {guide.faq.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-cream-deep/60 bg-cream-soft/50 p-4"
            >
              <p className="mb-1.5 text-[15px] font-semibold text-ink">Q. {f.q}</p>
              <p className="text-sm leading-relaxed text-ink-soft">A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <Link
        href={`/result?c=${guide.category}`}
        className="mt-9 block w-full rounded-xl bg-brand py-4 text-center text-lg font-bold text-white shadow-md transition hover:bg-brand-deep"
      >
        지금 내 {cat.label} 부적 만들기 →
      </Link>

      <p className="mt-6 text-center text-xs leading-relaxed text-ink-faint">
        행운부적은 재미·참고용 엔터테인먼트예요. 종교적·주술적 효력을 보장하지
        않아요.
      </p>
    </main>
  );
}
