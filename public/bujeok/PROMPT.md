# 부적 일러스트 생성 프롬프트 (이미지 옆에 두는 사본)

> 원본·상세: `ai-staff/도담/2026-08-05-bujeok-asset-prompt-복원.md`
> 이 파일은 **이미지 폴더를 여는 사람이 반드시 마주치도록** 둔 사본입니다.
> 스타일 근거는 실물 20장 역분석(2026-08-08 복원). 프롬프트를 또 잃어버리지 않게 여기서 관리합니다.

---

## 0. 절대 규격

| 항목 | 값 |
|---|---|
| 비율·크기 | **세로 3:4** (기존 760×1013, 생성물 1086×1448도 가능) |
| 배경 | **채도 높은 플랫 단색.** 그라디언트·그림자·씬 없음 |
| 원근 | **없음.** 책상·바닥 같은 공간 구성 금지 |
| 주인공 | **한글 손글씨.** 캐릭터는 하단 조연 (2026-07-14 대표 확정) |
| 두들 | 별·하트·네잎클로버·반짝·색점을 여백에 빽빽하게 |

**프레임 2종**

- 캐릭터판 `{id}.png` — 굵은 노란 물결 테두리 + 안쪽 검정 라인 + 코너 소용돌이
- 글씨판 `{id}_word.png` — 얇은 검정 라운드 라인 + 바깥 흰 여백 (캐릭터 없음)

**마스코트 고정 사양** (바꾸면 시리즈가 깨집니다)

주황 몸 · 크림 배 · 짧고 뭉툭한 검정 줄무늬 · 줄무늬 꼬리 · **이마 검정 王** ·
큰 둥근 눈 + **흰 하이라이트 2점** · 작은 점 코 · 단순한 미소 · 분홍 볼터치 · 통통한 둥근 몸

---

## 1. 캐릭터판 템플릿

`{{배경색}}` `{{문구1}}` `{{문구2}}` `{{소품}}` 만 바꿔 씁니다.

```
Korean sticker-illustration talisman card, naive hand-drawn childlike look.
Vertical 3:4 portrait composition.

FRAME: thick wobbly yellow rounded border with a black outline inside it,
small curly swirl ornaments in the four corners. Flat, no perspective.

BACKGROUND: one flat saturated {{배경색}} color, no gradient, no shading,
no scene, no floor, no desk.

HERO (top 40% of the card): big playful hand-drawn wobbly Korean lettering
in two lines reading exactly:
"{{문구1}}"
"{{문구2}}"
Each syllable a different bright color (red, orange, yellow, green, blue,
purple, pink) with a bold black outline and a slight tilt. This lettering is
the main subject - bigger and louder than the character.

CHARACTER (bottom half, smaller than the lettering): a simple round baby tiger
mascot, original character. Orange body, cream belly, a few short blunt black
stripes, striped tail. A small black 王 mark on the forehead. Big round eyes
with two white highlight dots each, tiny dot nose, simple smile, pink blush
cheeks. Chubby rounded body, thick wobbly black outline.
{{소품}}

DOODLES: fill the empty margins densely with stars, four-leaf clovers, hearts,
sparkles, small colored dots.

STYLE: flat bright colors, marker and crayon texture, thick black outlines,
intentionally imperfect and wobbly, high saturation, sticker aesthetic,
completely flat with no depth.
--no realistic, --no gradient, --no shading, --no 3d, --no photoreal,
--no perspective, --no desk, --no cream background, --no square
```

## 2. 글씨판 템플릿

```
Korean sticker-illustration talisman card, lettering-only version, naive
hand-drawn childlike look. Vertical 3:4 portrait composition.

FRAME: a thin black rounded-rectangle line with a white margin outside it
(NOT the yellow wobbly border).

BACKGROUND: the same flat saturated {{배경색}}, no gradient, no shading.

HERO (center, very large): big playful hand-drawn wobbly Korean lettering
in two lines reading exactly:
"{{문구1}}"
"{{문구2}}"
Each syllable a different bright color with a bold black outline and a slight
tilt. Larger than in the character version - it fills the middle of the card.

NO CHARACTER. No tiger. Instead, place related props flat around the
lettering: {{소품목록}}.

DOODLES: fill every empty area densely with stars, four-leaf clovers, hearts,
sparkles, small colored dots, short white speed lines.

STYLE: flat bright colors, marker and crayon texture, thick black outlines,
intentionally imperfect and wobbly, high saturation, sticker aesthetic,
completely flat with no depth.
--no realistic, --no gradient, --no shading, --no 3d, --no photoreal,
--no perspective, --no tiger, --no character, --no square
```

---

## 3. 소원별 교체값

`{{문구1}}` `{{문구2}}`는 `lib/bujeok/catalog.ts`의 `phrase`를 두 줄로 나눈 것입니다.

| id | 문구 | 배경색(이미지) | 소품 |
|---|---|---|---|
| exam | 무엇이든 / 붙어버려! | 민트그린 | 안경 · 100점 시험지 · 합격 도장 |
| luck | 온 세상이 / 나를 도와! | 하늘파랑 | 무지개 · 네잎클로버 · 말굽 |
| **suneung** | **잘 보고 / 오자!** ⚠️2026-08-08 변경 | **연산호빛 분홍 #ffb3b3** | **화이팅 머리띠 · 연필 · OMR 답안지 · 오늘도 화이팅! 명패** |
| interview | 말문이 팡 / 터지는! | (기존 에셋 참조) | — |
| love · wealth · health · diet · calm · social · selfup | 〃 | 〃 | — |

> ⚠️ **금지어 2개** — 부적 이미지 어디에도 **`합격`·`수능`** 글자를 넣지 않습니다(2026-08-08 확정).
> `합격`은 보장 뉘앙스, `수능`은 자산을 그 시즌에 묶습니다. 응원 표현(`화이팅`)으로 씁니다.
> 수정 발주서: `ai-staff/도담/2026-08-08-bujeok-suneung-asset-fix.md`
>
> ⚠️ **OMR 답안지를 그릴 때는 행마다 1칸만 칠합니다.** 전부 칠하면 실제로는 무효 답안지입니다.
>
> ⚠️ **이미지 배경색 ≠ catalog의 `bg`.** catalog `bg`는 버튼·칩용이라 옅고,
> 이미지 배경은 훨씬 진합니다. 예: suneung은 catalog `#ffe0e0` / 이미지 `#ffb3b3`.

---

## 4. 생성 후 검수 9항목 — 하나라도 ✗면 재생성

| # | 확인 |
|---|---|
| **1** | **한글 문구가 정확한가** — AI가 가장 자주 깨뜨립니다. 뭉개지면 그 장은 버립니다 |
| 2 | 글씨가 캐릭터보다 큰가 |
| 3 | 세로 3:4인가 |
| 4 | 프레임이 맞는가 (캐릭터판=노란 물결 / 글씨판=얇은 검정 라인) |
| 5 | 배경이 플랫 단색인가 |
| 6 | 이마에 王이 있는가 |
| 7 | 눈 하이라이트가 2점인가 |
| 8 | 두들이 여백을 채우는가 |
| 9 | 기존 종과 배경색이 겹치지 않는가 |
