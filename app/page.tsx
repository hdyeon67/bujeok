import { LandingForm } from "@/components/landing/LandingForm";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-5 py-8">
      <header className="mb-7 text-center">
        <div className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl bg-jusa/10 text-3xl">
          🧧
        </div>
        <h1 className="font-brush text-4xl font-extrabold tracking-tight text-meok">
          행운부적
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-meok-soft">
          사주 오행을 분석해 <b className="text-jusa">부족한 기운</b>을 채우는
          <br />
          나만의 부적 카드를 만들어 드려요.
        </p>
      </header>

      <section className="rounded-2xl border border-hanji-deep/60 bg-hanji-soft/50 p-5 shadow-sm">
        <LandingForm />
      </section>

      <p className="mt-5 text-center text-xs leading-relaxed text-meok-faint">
        3초면 완성 · 매일 바뀌는 오늘의 행운 한 줄까지
      </p>
    </main>
  );
}
