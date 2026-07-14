# 행운부적 (bujeok)

이름 + 생년월일 + 소원 카테고리로 **나만의 부적 카드**를 결정적으로 생성하는
웹 서비스. 데일리 운세("오늘의 행운 한 줄") 내장으로 매일 재방문을 유도한다.

- 도메인(예정): `bujeok.fineboll.com`
- 스택: Next.js 15 (App Router) + TypeScript + Tailwind, Cloudflare Workers(OpenNext) 배포
- 원칙: DB 없음 · 실시간 AI 호출 없음(운영비 0원) · 같은 입력 → 항상 같은 결과

## 진행 상황

- [x] **Phase 1** — 공용 패키지 분리 + 부적 엔진 + 단위 테스트
- [x] **Phase 2** — 해석 문구 풀 280개 + SVG 부적 레이어(800 조합)
- [x] **Phase 3** — 랜딩·결과 UI + 카드 등장 애니메이션 + 수능 카운트다운
- [x] **Phase 4** — 공유(OG 이미지·PNG 저장·카카오 SDK)+SEO 가이드 5종+sitemap/robots
- [x] **Phase 5** — 광고 활성화 로직 + Analytics 계측 + Cloudflare 배포 설정·README  ← 완료

## 구조 (Phase 1)

```
saju-core/                     ← 별도 로컬 패키지 (만세력·오행 공용, 첫 소비자 = 이 앱)
bujeok/
  lib/
    bujeok-engine/             부적 도메인 로직 (프레임워크 무의존, 결정적)
      categories.ts            소원 5카테고리 (인장 문자·키워드)
      ohaeng-meta.ts           오행 5색·방위 메타
      seed.ts                  결정적 시드 유틸
      complement.ts            보완 오행 결정 (동률 시드 처리)
      luck.ts                  행운 지수 30~95 (오행 균형도)
      card.ts                  부적 카드 조합 (5×5×8×4 = 800)
      daily.ts                 데일리 운세 (날짜 시드)
      result.ts                buildBujeok(): 입력 → 결과 파이프라인
    copy/                      해석 문구 풀 (사전 생성, AI 호출 없음)
      reasons.ts               부적 해설 5×5×8 = 200
      tips.ts                  카테고리 팁 5×8 = 40
      daily.ts                 데일리 한 줄 10구간×4 = 40
      select.ts                selectBujeokCopy / selectDailyLine (결정적)
    bujeok-svg/                부적 카드 SVG (순수 문자열, 서버·클라 공용)
      layers.ts                배경5·인장5·문양8·장식4 레이어
      render.ts                renderBujeokSvg(card): 800 조합 → SVG
    share/
      encode.ts                결과 URL(?d=) base64url 인코딩 (개인정보 미저장)
    content/guides.ts          SEO 가이드 5종 콘텐츠(수능·면접·연애·재물·건강 부적)
    util/date.ts               todayKST / toISODate
    config/
      flags.ts                 PAYMENT_ENABLED / ADS_ENABLED / KAKAO_ENABLED
      season.ts                시즌 훅(수능 D-day) — 하드코딩 금지, 배열 config
      promos.ts                크로스 프로모션 배너 config
      site.ts                  절대 URL 해석
  app/
    page.tsx                   랜딩 (이름·생년월일·카테고리·수능 카운트다운, ?c= 딥링크)
    result/page.tsx            결과 (카드·행운지수·풀이·오늘의 한 줄·공유·배너)
    api/og/route.tsx           동적 OG 이미지 1200×630 (satori/next-og)
    guide/page.tsx             가이드 인덱스
    guide/[slug]/page.tsx      SEO 가이드 5종 (정적 생성)
    about|privacy/page.tsx     소개 · 개인정보처리방침
    sitemap.ts | robots.ts     SEO
    layout.tsx                 폰트·메타·EDEN 표준 푸터
  components/                  footer / SeasonCountdown / landing / result(SaveButtons·KakaoShare·…)
```

## 실행 (개발 서버)

```bash
npm run dev       # http://localhost:3000
npm run build     # 프로덕션 빌드 (/result·/api/og 동적, 가이드 5 정적)
npm test          # 엔진·문구·SVG·config 46 tests
```

## 배포 (Cloudflare Workers · OpenNext)

sibling 앱과 동일한 스택. 상세 레시피는 `goodday/docs/cloudflare-migration.md`.

```bash
# 1) 프로덕션 공개 env 설정 (.env.local 또는 .env.production)
#    NEXT_PUBLIC_SITE_URL=https://bujeok.fineboll.com
# 2) OpenNext 빌드 + 배포 (populate-cache 포함)
npm run cf:deploy       # = opennextjs-cloudflare deploy
```

- `wrangler.jsonc` 에 커스텀 도메인 `bujeok.fineboll.com` 라우트가 지정돼 있어요.
- **saju-core 의존**: 공용 패키지를 git-URL 의존(`github:hdyeon67/saju-core`)으로
  참조해요. `npm install` 이 GitHub 에서 직접 받아오므로 sibling 폴더 없이도
  **CI(Cloudflare Workers Builds)에서 그대로 빌드**돼요. saju-core 저장소는 공개라
  별도 토큰이 필요 없어요.
  - saju-core 를 수정할 땐 `saju-core` 저장소에 push 한 뒤, bujeok 에서
    `npm update saju-core` 로 갱신하세요(로컬 sibling 자동 반영은 안 됨).
  - 특정 버전에 고정하려면 커밋 SHA 나 태그를 붙이세요:
    `github:hdyeon67/saju-core#<sha>`.

## 기능 플래그 (env 로 해금)

| 기능 | 켜는 법 | 현재 |
|---|---|---|
| 결제(프리미엄) | `PAYMENT_ENABLED=true` | 잠금 (사업자 미등록) |
| 광고(애드센스) | `NEXT_PUBLIC_ADS_ENABLED=true` + `NEXT_PUBLIC_ADSENSE_CLIENT` | 잠금 (미신청) |
| 카카오 공유 | `NEXT_PUBLIC_KAKAO_JS_KEY` | 잠금 (키 미발급) |
| 계측 | `NEXT_PUBLIC_POSTHOG_KEY` (+ `NEXT_PUBLIC_CF_BEACON_TOKEN`) | 미설정 시 no-op |

계측 이벤트는 `analytics-spec.md` 스키마를 따르며 이름·생년월일 등 개인정보는
절대 전송하지 않아요(카테고리·점수 구간 등 비식별 값만).

`saju-core` 는 `file:../saju-core` 로 연결되며 심링크라 소스 수정이 즉시 반영된다.
Next 는 `transpilePackages: ["saju-core"]` 로 TS 소스를 트랜스파일한다.

## 핵심 엔진 사용 예

```ts
import { buildBujeok, dailyFortune } from "@/lib/bujeok-engine";
import { selectBujeokCopy, selectDailyLine } from "@/lib/copy";
import { renderBujeokSvg } from "@/lib/bujeok-svg";

const result = buildBujeok({ name: "홍길동", birth: "1998-03-21", category: "exam" });
// result.complement.element  → 보완 오행 (부족한 기운)
// result.card                → 배경/인장/문양/장식 인덱스
// result.luck                → 행운 지수 30~95

const copy = selectBujeokCopy(result);   // { fact, reason, tip, paragraph }
const svg = renderBujeokSvg(result.card, { wish: "시험 합격", emoji: "📚" }); // 세로 3:4

const today = dailyFortune("홍길동", "1998-03-21", "2026-07-14");
const line = selectDailyLine(today);     // "오늘의 행운 한 줄"
// today.band(0~9)·luckyColorName·luckyDirection·luckyNumber
```

## 테스트

```bash
npm test          # bujeok 엔진·문구·SVG·config (46 tests)
```

`saju-core` 자체 테스트는 그 폴더에서 `npm test` (55 tests).

검증 범위: **결정성**(같은 입력 1000회 동일), **분포**(행운 지수 30~95, 보완
오행·카드 인덱스 전 범위 커버), **일진**(2026-07-11=병술 등 알려진 값),
**시즌 훅**(2026-07-14 → 수능 D-128, 지난 뒤 자동 비활성), **문구 풀**(280개
규모·톤 금지어·종결·결정적 선택), **SVG**(800 조합 전부 유효·결정적).

## 환경변수

`.env.example` 참고. 전부 미설정 시 결제·광고·카카오 공유는 잠금(false) 상태로
안전하게 동작한다. (사업자등록·애드센스 승인·카카오 키 발급 시 해당 값만 켜면 됨)
