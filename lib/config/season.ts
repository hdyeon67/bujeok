// 시즌 모드 config — 하드코딩 금지, 이 배열만 갱신하면 시즌 훅이 바뀐다.
//
// 활성 조건: 오늘(todayISO) <= targetISO 이면 해당 훅이 살아있고, 날짜가 지나면
// 자동으로 비활성 → 범용 모드로 전환된다. 여러 훅이 살아있으면 target 이 가장
// 가까운(임박한) 훅을 노출한다.
//
// 예) 수능(2026-11-19)이 지나면 이 배열에 신년/자격증 등 다음 훅을 추가만 하면 된다.
//
// ※ 수능 날짜(2026-11-19)는 커뮤니티 자료 기준 — 한국교육과정평가원 공식 공고로
//   교차 확인 후 확정할 것.

import type { CategoryId } from "@/lib/bujeok-engine";

export interface SeasonHook {
  id: string;
  /** 카운트다운 라벨 (예: "수능") */
  label: string;
  /** 목표 날짜 YYYY-MM-DD */
  targetISO: string;
  /** 이 시즌에 메인에 크게 노출할 카테고리 */
  featuredCategory: CategoryId;
}

export const SEASON_HOOKS: SeasonHook[] = [
  {
    id: "suneung-2026",
    label: "수능",
    targetISO: "2026-11-19",
    featuredCategory: "exam",
  },
];

/** "YYYY-MM-DD" → UTC 자정 ms (실패·범위초과 시 NaN) */
function utc(dateISO: string): number {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateISO.trim());
  if (!m) return NaN;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const ms = Date.UTC(y, mo - 1, d);
  // 라운드트립 검증 — 13월·40일 같은 오버플로가 조용히 다른 날짜로 넘어가는 것 방지
  const dt = new Date(ms);
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return NaN;
  }
  return ms;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** target 까지 남은 일수 (오늘 포함 D-day). 지났으면 음수 */
export function dDay(todayISO: string, targetISO: string): number {
  const a = utc(todayISO);
  const b = utc(targetISO);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / MS_PER_DAY);
}

/**
 * 오늘 기준 활성 시즌 훅 (없으면 null → 범용 모드).
 * 아직 지나지 않은(D-day >= 0) 훅 중 가장 임박한 것을 고른다.
 */
export function activeSeasonHook(
  todayISO: string,
  hooks: SeasonHook[] = SEASON_HOOKS,
): SeasonHook | null {
  const alive = hooks
    .map((h) => ({ h, d: dDay(todayISO, h.targetISO) }))
    .filter(({ d }) => Number.isFinite(d) && d >= 0)
    .sort((x, y) => x.d - y.d);
  return alive.length > 0 ? alive[0].h : null;
}
