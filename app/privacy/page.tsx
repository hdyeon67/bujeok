import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "행운부적은 개인정보를 서버에 저장하지 않습니다.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <header className="mb-6">
        <Link href="/" className="text-sm text-meok-faint">
          ← 홈으로
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-meok">개인정보처리방침</h1>
      </header>

      <section className="space-y-5 text-[15px] leading-relaxed text-meok-soft">
        <div>
          <h2 className="mb-1.5 font-semibold text-meok">1. 수집하는 정보</h2>
          <p>
            행운부적은 회원가입이 없으며 별도의 데이터베이스를 두지 않아요.
            부적 생성을 위해 입력하는 이름과 생년월일은{" "}
            <b className="text-meok">서버에 저장되지 않고</b>, 브라우저에서 결과를
            계산하는 데에만 쓰여요.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-semibold text-meok">2. 결과 공유 방식</h2>
          <p>
            결과는 입력값을 인코딩한 URL(<code className="text-sm">?d=</code>)에만
            담겨요. 링크를 받은 사람은 동일한 결과를 볼 수 있으나, 그 정보가 우리
            서버에 남지는 않아요. 링크를 공유하지 않으면 아무 데도 전달되지 않아요.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-semibold text-meok">3. 광고·분석</h2>
          <p>
            향후 서비스 운영을 위해 광고(Google AdSense) 또는 방문 통계 도구가
            도입될 수 있으며, 이 경우 쿠키 등을 통해 비식별 정보가 수집될 수
            있어요. 도입 시 본 방침을 갱신해 안내할게요.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-semibold text-meok">4. 문의</h2>
          <p>운영: EDEN APPWORKS (fineboll 연구소)</p>
        </div>

        <p className="pt-2 text-sm text-meok-faint">최종 갱신: 2026-07-14</p>
      </section>
    </main>
  );
}
