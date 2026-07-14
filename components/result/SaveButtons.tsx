"use client";

import { useState } from "react";
import { renderBujeokSvg, CARD_W, CARD_H } from "@/lib/bujeok-svg";
import type { BujeokCard } from "@/lib/bujeok-engine";
import { track } from "@/lib/analytics";

// 부적 카드 PNG 저장 — 페이지의 실제 세로형 SVG(한자 인장 포함)를 클라이언트에서
// 캔버스로 래스터화해 다운로드. SVG 는 외부 리소스가 없어 캔버스가 오염되지 않음.

const SCALE = 2.5; // 선명하게

async function svgToPng(svg: string, w: number, h: number): Promise<Blob> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("이미지 로드 실패"));
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w * SCALE;
    canvas.height = h * SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 미지원");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG 변환 실패"))), "image/png"),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SaveButtons({
  card,
  wish,
  emoji,
}: {
  card: BujeokCard;
  wish?: string;
  emoji?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      const svg = renderBujeokSvg(card, { wish, emoji });
      const png = await svgToPng(svg, CARD_W, CARD_H);
      download(png, `행운부적_${card.category}.png`);
      track("share_click", { channel: "png" });
    } catch {
      /* 조용히 실패 — 링크 복사 대안 존재 */
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={save}
      disabled={busy}
      className="w-full rounded-xl border border-hanji-deep bg-white/60 py-3.5 text-base font-semibold text-meok transition hover:border-jusa/50 active:scale-[0.99] disabled:opacity-50"
    >
      {busy ? "저장 중…" : "📥 이미지 저장"}
    </button>
  );
}
