import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getLang, privacyHidden, t } from "../lib/i18n";
import { useDashboard, useSession, DASH } from "../lib/session";
import { Loading, Banner, Button } from "../components/ui/primitives";
import type { Dashboard } from "../lib/types";

/*
 * Progressive migration: pages not yet rewritten in React (Internet, Security, VPN,
 * Share, and the System account/updates/logs tabs) are the original vanilla modules,
 * loaded on demand from /js/ and mounted inside the React shell. They get the same
 * ctx contract they always had, styled by the shared tokens.
 */
const LEGACY_V = "15";
type LegacyCtx = { dashboard?: Dashboard; live: boolean; getDashboard: () => Dashboard | undefined; refresh: () => Promise<unknown>; rerender: () => void; touch: () => void };
type LegacyFn = (ctx: LegacyCtx, meta?: object) => HTMLElement;
interface LegacyMods { i18n: { setLang: (l: string) => void; setPrivacyHidden: (v: boolean) => void }; drawer: { refreshDrawer: () => void; closeDrawer: () => void } }
let mods: Promise<LegacyMods> | null = null;
// Pages are fetched with ?v= (cache-busting on update); the shared core modules must be
// imported by the exact URL the pages import them by, or the browser creates a second copy.
const load = (p: string, versioned = true) => import(/* @vite-ignore */ versioned ? `${p}?v=${LEGACY_V}` : p);
function core(): Promise<LegacyMods> {
  if (!mods) {
    ensureCss();
    mods = Promise.all([load("/js/core/i18n.js", false), load("/js/components/drawer.js", false)]).then(([i18n, drawer]) => ({ i18n, drawer }) as LegacyMods);
  }
  return mods;
}
let cssDone = false;
function ensureCss() {
  if (cssDone) return; cssDone = true;
  const l = document.createElement("link"); l.rel = "stylesheet"; l.href = `/css/legacy.css?v=${LEGACY_V}`; document.head.append(l);
}
/** Keep the legacy modules' language + privacy mask in step with the React shell. */
export function syncLegacy() { if (mods) mods.then((m) => { m.i18n.setLang(getLang()); m.i18n.setPrivacyHidden(privacyHidden()); }).catch(() => {}); }

export function LegacyHost({ path, exportName = "default" }: { path: string; exportName?: string }) {
  const host = useRef<HTMLDivElement | null>(null);
  const dash = useDashboard();
  const { refresh, connected } = useSession();
  const qc = useQueryClient();
  const [fn, setFn] = useState<LegacyFn | null>(null), [err, setErr] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let gone = false;
    core().then(async (m) => { syncLegacy(); const mod = await load(path); if (!gone) setFn(() => mod[exportName] as LegacyFn); void m; })
      .catch((e) => { if (!gone) setErr(String(e?.message || e)); });
    return () => { gone = true; core().then((m) => m.drawer.closeDrawer()).catch(() => {}); };
  }, [path, exportName]);
  useEffect(() => {
    const el = host.current; if (!el || !fn) return;
    const a = document.activeElement;
    // never rebuild under someone's cursor (same rule as before): only the drawer refreshes
    if (a && el.contains(a) && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) { core().then((m) => m.drawer.refreshDrawer()); return; }
    const ctx: LegacyCtx = {
      dashboard: dash, live: connected, getDashboard: () => qc.getQueryData<Dashboard>(DASH),
      refresh: () => refresh(), rerender: () => setTick((x) => x + 1), touch: () => setTick((x) => x + 1),
    };
    try { el.replaceChildren(fn(ctx, {})); core().then((m) => m.drawer.refreshDrawer()); } catch (e) { setErr(String((e as Error).message || e)); }
  }, [fn, dash, connected, tick, qc, refresh]);
  useEffect(() => { const on = () => setTick((x) => x + 1); window.addEventListener("qm:privacy", on); return () => window.removeEventListener("qm:privacy", on); }, []);
  if (err) return <Banner tone="danger" title={t("legacy.fail")} action={<Button size="sm" onClick={() => location.reload()}>{t("conn.retry")}</Button>}>{err}</Banner>;
  return <>{!fn && <Loading what={t("boot.page")} h={240} />}<div ref={host} className="qm-legacy" /></>;
}
const cache: Record<string, () => JSX.Element> = {};
export function legacyPage(id: string) {
  return (cache[id] ||= function LegacyRoute() { return <LegacyHost path={`/js/pages/${id}.js`} />; });
}
