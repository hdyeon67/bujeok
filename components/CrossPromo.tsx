"use client";

// 크로스 프로모션 배너 — config(PROMOS) 배열로 관리. 앱 추가 시 config 만 갱신.
import { PROMOS } from "@/lib/config/promos";
import { track } from "@/lib/analytics";

export function CrossPromo() {
  if (PROMOS.length === 0) return null;
  return (
    <section className="w-full">
      <p className="mb-2 text-center text-sm font-medium text-ink-faint">
        이런 것도 궁금하다면
      </p>
      <div className="space-y-2">
        {PROMOS.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("cross_banner_click", { target_app: p.id })}
            className="flex items-center gap-3 rounded-xl border border-cream-deep/60 bg-white/50 px-4 py-3 transition hover:border-brand/40"
          >
            <span
              className="flex size-9 items-center justify-center rounded-lg text-xl"
              style={{ backgroundColor: `${p.color}1a` }}
              aria-hidden
            >
              {p.emoji}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-ink">{p.title}</span>
              <span className="block text-xs text-ink-faint">{p.desc}</span>
            </span>
            <span className="text-ink-faint" aria-hidden>
              ›
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
