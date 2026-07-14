"use client";

import { useState } from "react";
import { renderBujeokSvg, type CardRatio } from "@/lib/bujeok-svg";
import type { BujeokCard } from "@/lib/bujeok-engine";
import { track } from "@/lib/analytics";

// 부적 카드 PNG 저장 — 페이지의 실제 SVG(한자 인장 포함)를 클라이언트에서
// 캔버스로 래스터화해 다운로드한다. 스토리 9:16 / 피드 1:1 두 레이아웃 제공.
// SVG 는 외부 리소스가 없어 캔버스가 오염되지 않으므로 toBlob 가능.

const SCALE = 2; // 선명하게 2배 렌더

async function svgToPng(svg: string, w: number, h: number): Promise<Blob> {
  // 웹폰트(인장 서체)가 로드된 뒤 그린다
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

const DIMS: Record<CardRatio, { w: number; h: number; label: string }> = {
  "9:16": { w: 480, h: 853, label: "스토리 저장" },
  "1:1": { w: 480, h: 480, label: "피드 저장" },
};

export function SaveButtons({ card }: { card: BujeokCard }) {
  const [busy, setBusy] = useState<CardRatio | null>(null);

  async function save(ratio: CardRatio) {
    if (busy) return;
    setBusy(ratio);
    try {
      const { w, h } = DIMS[ratio];
      const svg = renderBujeokSvg(card, { ratio, wish: undefined });
      const png = await svgToPng(svg, w, h);
      download(png, `행운부적_${card.category}_${ratio.replace(":", "x")}.png`);
      track("share_click", { channel: "png", ratio });
    } catch {
      /* 사용자에게 조용히 실패 — 링크 복사 대안 존재 */
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {(Object.keys(DIMS) as CardRatio[]).map((ratio) => (
        <button
          key={ratio}
          type="button"
          onClick={() => save(ratio)}
          disabled={busy !== null}
          className="rounded-xl border border-hanji-deep bg-white/60 py-3 text-sm font-semibold text-meok transition hover:border-jusa/50 active:scale-[0.99] disabled:opacity-50"
        >
          {busy === ratio ? "저장 중…" : `📥 ${DIMS[ratio].label}`}
        </button>
      ))}
    </div>
  );
}
