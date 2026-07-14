import { WishGrid } from "@/components/landing/WishGrid";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-5 py-8">
      <header className="mb-6 text-center">
        <div className="animate-wiggle mb-2 inline-block text-5xl">🐯</div>
        <h1 className="font-cute text-5xl font-bold tracking-tight text-brand">
          행운부적
        </h1>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-soft">
          소원 하나 고르면
          <br />
          <b className="text-ink">귀여운 행운부적</b>이 뿅! 🧧
        </p>
      </header>

      <section className="sticker p-5">
        <WishGrid />
      </section>
    </main>
  );
}
