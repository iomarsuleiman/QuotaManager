import { useMemo, useState } from "react";
import type { SortProps } from "./SortableNav";
import clsx from "clsx";
import { Icon } from "../components/ui/Icon";
import { IconButton, Meter, Tip } from "../components/ui/primitives";
import { useToast } from "../components/ui/overlays";
import { t, tf, num } from "../lib/i18n";
import { usePrefs, setPref } from "../lib/prefs";
import { GROUPS, mergeOrder, prefetchRoute, routeById, type RouteId } from "./routes";
import type { Dashboard } from "../lib/types";
import type { LiveState } from "../lib/live";

type DndMod = typeof import("./SortableNav");
let dndMod: DndMod | null = null;
let dndLoading: Promise<DndMod> | null = null;
const loadDnd = () => (dndLoading ||= import("./SortableNav").then((m) => (dndMod = m)));

interface Props { route: RouteId; dash?: Dashboard; live: LiveState; onNavigate?: () => void; rail?: boolean; onLogout: () => void; onHelp: () => void; mobile?: boolean }

export function Sidebar({ route, dash, live, onNavigate, rail, onLogout, onHelp, mobile }: Props) {
  const prefs = usePrefs();
  const toast = useToast();
  const [dnd, setDnd] = useState<DndMod | null>(dndMod);
  const wantDnd = () => { if (!dnd) loadDnd().then(setDnd).catch(() => {}); };
  const order = useMemo(() => mergeOrder(prefs.navOrder), [prefs.navOrder]);
  const label = (id: string) => t("nav." + id);

  const counts: Partial<Record<RouteId, { n: number; tone: "neutral" | "warning" }>> = {};
  if (dash) {
    counts.people = { n: dash.users.filter((u) => !u.protected).length, tone: "neutral" };
    const attention = dash.users.filter((u) => u.guest && u.blocked).length + (dash.rogue || []).length + (dash.security?.default_password ? 1 : 0) + (dash.internet === false ? 1 : 0);
    if (attention) counts.overview = { n: attention, tone: "warning" };
  }
  // Optimistic: the new order shows at once; if this browser cannot store it, say so (it still applies for this visit).
  const save = (next: Record<string, string[]>) => {
    if (!setPref("navOrder", { v: 1, groups: next })) toast({ kind: "warning", title: t("nav.order.nosave") });
  };
  const b = dash?.bundle, pct = b && b.total_gb > 0 ? (b.used_gb / b.total_gb) * 100 : 0;
  const liveTxt = live === "live" ? t("conn.live") : live === "polling" ? t("conn.polling") : live === "offline" ? t("conn.offline") : t("conn.reconnecting");
  return (
    <aside className={clsx("flex h-full flex-col gap-3 bg-frame py-3", rail ? "w-[68px] items-center px-2" : "w-[248px] px-3", !mobile && "border-e border-line")} aria-label={t("nav.aria")}>
      <div className={clsx("flex items-center gap-2.5 px-1.5", rail && "flex-col px-0")}>
        <img src="/logo.svg" alt="" className="size-7" />
        {!rail && <div className="min-w-0 flex-1 leading-tight"><div className="truncate text-[14.5px] font-semibold text-fg" dir="ltr">QuotaManager</div><div className="truncate text-[11.5px] text-fg-3">{t("nav.gateway")}{dash?.version ? ` · v${dash.version}` : ""}</div></div>}
        {!mobile && <IconButton icon="panel" label={rail ? t("common.expand") : t("common.collapse")} onClick={() => setPref("rail", !rail)} className={clsx(rail ? "rotate-180 rtl:rotate-0" : "rtl:rotate-180", "size-8")} size={16} />}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden" aria-label={t("nav.aria")} onPointerEnter={wantDnd} onFocusCapture={wantDnd} onTouchStart={wantDnd}>
        {GROUPS.filter((g) => g.id !== "settings").map((g) => (
          <div key={g.id} role="group" aria-labelledby={rail ? undefined : `ng-${g.id}`} aria-label={rail ? t(g.label) : undefined} className={clsx(rail && "w-full border-t border-line pt-3 first:border-0 first:pt-0")}>
            {!rail && <div id={`ng-${g.id}`} className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-[.08em] text-fg-3 rtl:text-[12px] rtl:normal-case rtl:tracking-normal">{t(g.label)}</div>}
            <ul className="flex flex-col gap-px">
              {(() => {
                const ids = order[g.id] || [];
                const row = (id: string, sp?: SortProps) => (
                  <NavItem key={id} id={id as RouteId} active={route === id} rail={!!rail} count={counts[id as RouteId]} sp={sp}
                    onNavigate={onNavigate} sortable={ids.length > 1} />
                );
                return dnd && !rail && ids.length > 1
                  ? <dnd.SortableGroup ids={ids} labelOf={label} onReorder={(next) => save({ ...order, [g.id]: next })}>{(id, sp) => row(id, sp)}</dnd.SortableGroup>
                  : ids.map((id) => row(id));
              })()}
            </ul>
          </div>
        ))}
      </nav>

      {b && !rail && (
        <a href="#/quota" onClick={onNavigate} className="block rounded-md border border-line bg-surface p-3 hover:border-line-strong">
          <div className="flex items-baseline justify-between text-[12px] text-fg-2"><span>{t("side.bundle")}</span><b className="text-[13px] text-fg tabular-nums">{num(pct, 0)}%</b></div>
          <Meter value={pct} className="my-2" label={t("side.bundle")} />
          <div className="text-[12px] text-fg-3">{num(Math.max(0, b.remaining_gb))} {t("common.gb")} {t("side.left")}{b.days_left >= 0 ? ` · ${tf("side.resets", { n: num(b.days_left, 0) })}` : ""}</div>
        </a>
      )}

      <div className={clsx("flex flex-col gap-px border-t border-line pt-2", rail && "w-full items-center")}>
        <ul className={clsx(rail && "flex w-full justify-center")}><NavItem id="system" active={route === "system"} rail={!!rail} onNavigate={onNavigate} sortable={false} /></ul>
        <FootButton icon="help" label={t("help.title")} rail={!!rail} onClick={onHelp} />
      </div>
      <div className={clsx("flex items-center gap-2.5 px-1.5", rail && "flex-col")}>
        <span className="grid size-8 place-items-center rounded-full border border-line bg-surface text-[13px] font-semibold text-fg-2" aria-hidden>A</span>
        {!rail && <div className="min-w-0 flex-1 leading-tight"><b className="block text-[13px] text-fg">{t("nav.admin")}</b>
          <span className="flex items-center gap-1.5 text-[11.5px] text-fg-3"><span className={clsx("size-1.5 rounded-full", live === "live" ? "bg-success" : live === "offline" ? "bg-danger" : "bg-warning")} aria-hidden />{liveTxt}</span></div>}
        <IconButton icon="logout" label={t("common.logout")} onClick={onLogout} size={16} className="size-8" />
      </div>
    </aside>
  );
}

function FootButton({ icon, label, rail, onClick }: { icon: string; label: string; rail: boolean; onClick: () => void }) {
  const b = (
    <button type="button" onClick={onClick} aria-label={rail ? label : undefined}
      className={clsx("flex h-[var(--navh)] items-center gap-2.5 rounded-md text-[13px] font-medium text-fg-2 hover:bg-raised hover:text-fg max-md:h-11", rail ? "w-11 justify-center" : "w-full px-2.5")}>
      <Icon name={icon} size={17} />{!rail && label}
    </button>
  );
  return rail ? <Tip label={label} side="right">{b}</Tip> : b;
}

function NavItem({ id, active, rail, count, onNavigate, sortable, sp }: {
  id: RouteId; active: boolean; rail: boolean; count?: { n: number; tone: "neutral" | "warning" }; onNavigate?: () => void;
  sortable: boolean; sp?: SortProps;
}) {
  const r = routeById(id)!;
  const name = t("nav." + id);
  const link = (
    <a href={"#/" + id} aria-current={active ? "page" : undefined} onClick={onNavigate}
      onPointerEnter={() => prefetchRoute(id)} onFocus={() => prefetchRoute(id)} onTouchStart={() => prefetchRoute(id)}
      className={clsx("relative flex h-[var(--navh)] min-w-0 flex-1 items-center gap-2.5 rounded-md text-[13px] transition-colors max-md:h-11",
        rail ? "w-11 flex-none justify-center" : "px-2.5",
        active ? "bg-raised font-semibold text-fg before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-full before:bg-accent" : "font-medium text-fg-2 hover:bg-raised/70 hover:text-fg")}>
      <Icon name={r.icon} size={17} className={active ? "text-fg" : ""} />
      {!rail && <span className="min-w-0 flex-1 truncate">{name}</span>}
      {count && (rail
        ? <span className={clsx("absolute end-1.5 top-1.5 size-2 rounded-full", count.tone === "warning" ? "bg-warning" : "bg-fg-3")} aria-label={tf("nav.count", { n: count.n })} />
        : <span className={clsx("min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold tabular-nums", count.tone === "warning" ? "bg-warning-soft text-warning" : "bg-canvas text-fg-3")} aria-label={tf("nav.count", { n: count.n })}>{num(count.n, 0)}</span>)}
    </a>
  );
  return (
    <li ref={sp?.setNodeRef} style={sp?.style} className={clsx("group/nav relative flex items-center", sp?.isDragging && "z-10 rounded-md bg-surface shadow-raised", sp?.isOver && !sp?.isDragging && "qm-drop-line")}>
      {sortable && !rail && (
        // The six-dot handle is the only drag source: clicking the row still navigates.
        <button type="button" {...(sp?.handle || {})} aria-label={`${t("nav.reorder")}: ${name}`} aria-roledescription={t("nav.handle")}
          className={clsx("absolute -start-2.5 grid h-7 w-4 cursor-grab touch-none place-items-center rounded text-fg-3 hover:text-fg-2 active:cursor-grabbing",
            "opacity-0 focus-visible:opacity-100 group-hover/nav:opacity-100 group-focus-within/nav:opacity-100 max-md:opacity-60")}>
          <Icon name="grip" size={14} />
        </button>
      )}
      {rail ? <Tip label={name} side="right">{link}</Tip> : link}
    </li>
  );
}
