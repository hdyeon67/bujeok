import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { WISHES } from "../catalog";

// 소원별 공유 OG(public/og/{id}.jpg)는 빌드 타임 산출물이라 저장소에 커밋돼 있다.
// 부적을 추가하고 `npm run og:build` 를 잊으면 그 소원의 공유 미리보기가 404 로 죽는데,
// 화면상으로는 아무 표시가 없다. 그 누락을 여기서 잡는다.

const OG_DIR = path.resolve(__dirname, "../../../public/og");

/** JPEG 헤더에서 크기 추출 (SOFn 마커) — 런타임 의존성 없이 규격만 확인 */
function jpegSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  if (buf.readUInt16BE(0) !== 0xffd8) throw new Error(`JPEG 아님: ${file}`);
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    // SOF0~SOF15 (DHT·DAC·RST 제외) 에 크기가 들어 있다
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error(`크기 마커를 찾지 못함: ${file}`);
}

describe("소원별 정적 OG 이미지", () => {
  it("WISHES 전 항목에 대해 파일이 존재한다", () => {
    const missing = WISHES.filter((w) => !existsSync(path.join(OG_DIR, `${w.id}.jpg`))).map(
      (w) => w.id,
    );
    expect(missing, "npm run og:build 를 실행하세요").toEqual([]);
  });

  it("전부 1200×630", () => {
    for (const w of WISHES) {
      expect(jpegSize(path.join(OG_DIR, `${w.id}.jpg`)), w.id).toEqual({
        width: 1200,
        height: 630,
      });
    }
  });

  it("현재 11종 (상시 10 + 한정 1)", () => {
    expect(WISHES.length).toBe(11);
  });
});
