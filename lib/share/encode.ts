// URL 공유용 페이로드 인코딩 (DB 없이 결과 URL 생성)
//   입력값(이름·생년월일·카테고리)을 JSON → UTF-8 → base64url 로 인코딩해 ?d= 에 싣는다.
//   서버(OG 이미지)·클라이언트 양쪽에서 동작하도록 Buffer/btoa 의존 없이
//   TextEncoder/TextDecoder + 수동 base64url 코덱을 사용한다.
//   개인정보(이름·생년월일)는 서버에 저장하지 않고 URL 에만 실린다.

import { isCategoryId, type CategoryId } from "@/lib/bujeok-engine";

/** 공유 페이로드 */
export interface SharePayload {
  /** 이름 */
  n: string;
  /** 생년월일 YYYY-MM-DD */
  b: string;
  /** 카테고리 id */
  c: CategoryId;
}

const B64URL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const B64URL_LOOKUP: Record<string, number> = Object.fromEntries(
  [...B64URL].map((c, i) => [c, i]),
);

function bytesToBase64Url(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : undefined;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : undefined;
    out += B64URL[b0 >> 2];
    out += B64URL[((b0 & 0x03) << 4) | ((b1 ?? 0) >> 4)];
    if (b1 === undefined) break;
    out += B64URL[((b1 & 0x0f) << 2) | ((b2 ?? 0) >> 6)];
    if (b2 === undefined) break;
    out += B64URL[b2 & 0x3f];
  }
  return out;
}

function base64UrlToBytes(str: string): Uint8Array {
  const clean = str.replace(/[^A-Za-z0-9\-_]/g, "");
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const c0 = B64URL_LOOKUP[clean[i]];
    const c1 = B64URL_LOOKUP[clean[i + 1]];
    const c2 = clean[i + 2] !== undefined ? B64URL_LOOKUP[clean[i + 2]] : undefined;
    const c3 = clean[i + 3] !== undefined ? B64URL_LOOKUP[clean[i + 3]] : undefined;
    bytes.push((c0 << 2) | (c1 >> 4));
    if (c2 === undefined) break;
    bytes.push(((c1 & 0x0f) << 4) | (c2 >> 2));
    if (c3 === undefined) break;
    bytes.push(((c2 & 0x03) << 6) | c3);
  }
  return new Uint8Array(bytes);
}

function isValidPayload(v: unknown): v is SharePayload {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.n === "string" &&
    p.n.trim().length > 0 &&
    typeof p.b === "string" &&
    /^\d{4}-\d{1,2}-\d{1,2}$/.test(p.b) &&
    typeof p.c === "string" &&
    isCategoryId(p.c)
  );
}

/** 페이로드 → base64url 문자열 */
export function encodePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  return bytesToBase64Url(new TextEncoder().encode(json));
}

/** base64url 문자열 → 페이로드 (유효하지 않으면 null) */
export function decodePayload(
  encoded: string | undefined | null,
): SharePayload | null {
  if (!encoded) return null;
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(encoded));
    const parsed = JSON.parse(json);
    return isValidPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** 이름·생년월일·카테고리 → 결과 URL 경로 (?d=) */
export function resultHref(name: string, birth: string, category: CategoryId): string {
  return `/result?d=${encodePayload({ n: name, b: birth, c: category })}`;
}
