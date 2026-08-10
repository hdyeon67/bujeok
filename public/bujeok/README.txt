부적 일러스트 에셋 폴더
=======================

★ 새 부적을 만들기 전에 반드시 PROMPT.md 를 읽으세요.
   같은 폴더의 PROMPT.md 에 생성 프롬프트·스타일 규격·검수 9항목이 있습니다.
   (원본: ai-staff/도담/2026-08-05-bujeok-asset-prompt-복원.md)
   2026-08-08: 원본 프롬프트 분실 사고가 있었습니다. 실물 역분석으로 복원했고,
   이제 프롬프트는 이미지와 같은 폴더에서 관리합니다. 여기서 옮기지 마세요.

소원별 부적 일러스트(PNG, 세로 3:4)를 아래 파일명으로 넣어주세요.
스타일 2종: 캐릭터(호랑이) = {id}.png, 글씨 = {id}_word.png

  [상시 10종]
  exam.png / exam_word.png            — 시험 합격  ("무엇이든 붙어버려!")
  interview.png / interview_word.png  — 면접 성공  ("말문이 팡 터지는!")
  love.png / love_word.png            — 연애 성취  ("사랑이 굴러오는!")
  wealth.png / wealth_word.png        — 재물 상승  ("돈복이 팡팡 터지는!")
  health.png / health_word.png        — 건강 기원  ("무병장수 파워업!")
  luck.png / luck_word.png            — 행운 대박  ("온 세상이 나를 도와!")
  diet.png / diet_word.png            — 다이어트  ("살이 쏙 빠지는!")
  calm.png / calm_word.png            — 마음 평온  ("마음이 편안해지는!")
  social.png / social_word.png        — 인싸력    ("인싸력 뿜뿜!")
  selfup.png / selfup_word.png        — 자존감    ("나는야 최고!")

  [기간 한정]
  suneung.png / suneung_word.png      — 수능 대박  ("잘 보고 오자!")
                                         노출 기간: catalog.ts 의 limited 필드 참조

- 파일이 없으면 결과 화면은 카테고리 색 플레이스홀더(문구+이모지)로 대체됩니다.
- 넣은 뒤 재배포(cf:build && cf:deploy)해야 라이브 반영. cf:deploy 만으로는 재빌드되지 않습니다.
- 카탈로그: lib/bujeok/catalog.ts (엔트리 1줄 + 이미지 2장 = 부적 1종)
- 기간 한정 부적은 catalog.ts 의 limited { from, until, badge } 로 노출 기간을 제어합니다.
