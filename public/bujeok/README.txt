부적 일러스트 에셋 폴더
=======================

소원별 부적 일러스트(PNG, 세로 3:4)를 아래 파일명으로 넣어주세요.
스타일 2종: 캐릭터(호랑이) = {id}.png, 글씨 = {id}_word.png

  exam.png / exam_word.png            — 시험 합격  ("무엇이든 붙어버려!")
  interview.png / interview_word.png  — 면접 성공  ("말문이 팡 터지는!")
  love.png / love_word.png            — 연애 성취  ("사랑이 굴러오는!")
  wealth.png / wealth_word.png        — 재물 상승  ("돈복이 팡팡 터지는!")
  health.png / health_word.png        — 건강 기원  ("무병장수 파워업!")

- 파일이 없으면 결과 화면은 카테고리 색 플레이스홀더(문구+이모지)로 대체됩니다.
- 넣은 뒤 재배포(cf:build && cf:deploy)해야 라이브 반영.
- 확장 예정(2단계): luck/diet/calm/social/selfup 5소원 × 2스타일 = 10장 더.
  카탈로그: lib/bujeok/catalog.ts (CategoryId 확장 + PHRASE 추가 + 이미지).
