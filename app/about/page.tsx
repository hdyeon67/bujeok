import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개",
  description: "행운부적은 사주 오행을 분석해 부족한 기운을 채우는 부적 카드를 만들어 주는 재미·참고용 서비스입니다.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <header className="mb-6">
        <Link href="/" className="text-sm text-ink-faint">
          ← 홈으로
        </Link>
        <h1 className="mt-3 font-cute text-3xl font-extrabold text-ink">
          행운부적 소개
        </h1>
      </header>

      <section className="space-y-5 text-[15px] leading-relaxed text-ink-soft">
        <p>
          <b className="text-ink">행운부적</b>은 이름과 생년월일, 그리고 담고 싶은
          소원을 입력하면 사주의 오행(목·화·토·금·수) 분포를 분석해 가장{" "}
          <b className="text-brand">부족한 기운</b>을 찾아, 그 기운을 채워 주는
          &lsquo;나만의 부적 카드&rsquo;를 만들어 드리는 서비스예요.
        </p>
        <p>
          같은 입력에는 항상 같은 부적이 나오도록 설계했고, 매일 바뀌는{" "}
          <b className="text-ink">오늘의 행운 한 줄</b>도 함께 담았어요. 실시간
          인공지능 호출 없이 미리 정해진 규칙과 문구로 만들어져 언제나 빠르게
          완성돼요.
        </p>

        <div className="rounded-2xl border border-cream-deep/60 bg-cream-soft/50 p-5">
          <h2 className="mb-2 text-base font-semibold text-ink">
            재미·참고용 안내
          </h2>
          <p className="text-sm">
            본 서비스는 <b>재미와 참고를 위한 엔터테인먼트</b>예요. 종교적·주술적
            효력을 보장하지 않으며, 결과는 중요한 결정의 근거가 아니라 가벼운
            응원으로 즐겨 주세요.
          </p>
        </div>

        <div className="rounded-2xl border border-cream-deep/60 bg-cream-soft/50 p-5">
          <h2 className="mb-2 text-base font-semibold text-ink">
            개인정보 보호
          </h2>
          <p className="text-sm">
            입력하신 이름과 생년월일은 <b>서버에 저장되지 않아요.</b> 결과는 URL에
            암호화된 형태로만 담겨 공유되며, 별도의 회원가입이나 데이터베이스가
            없어요. 자세한 내용은{" "}
            <Link href="/privacy" className="text-brand underline underline-offset-2">
              개인정보처리방침
            </Link>
            에서 확인할 수 있어요.
          </p>
        </div>

        <p className="pt-2 text-center text-sm text-ink-faint">
          만든 곳: EDEN APPWORKS · fineboll 연구소
        </p>
      </section>
    </main>
  );
}
