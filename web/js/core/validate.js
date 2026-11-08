// Typed checks for the vanilla pages (same rules as the React NumberField / TextField).
import { t } from "./i18n.js";

const DIGITS = /[٠-٩]/g;
const latin = (s) => String(s).trim().replace(DIGITS, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
/** Whole number in [min, max]; returns {value} or {error} (never silently 0). */
export function parseInt2(raw, min, max) {
  const s = latin(raw);
  if (s === "") return { error: t("f.required") };
  if (!/^-?\d+$/.test(s)) return { error: t("f.whole") };
  const v = Number(s);
  if (min != null && v < min) return { error: t("f.min").replace("{n}", String(min)) };
  if (max != null && v > max) return { error: t("f.max").replace("{n}", String(max)) };
  return { value: v };
}
export const isIPv4 = (s) => { const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(String(s).trim()); return !!m && m.slice(1).every((x) => +x <= 255 && String(+x) === x); };
export const isCidr4 = (s) => { const [ip, p] = String(s).trim().split("/"); return isIPv4(ip) && (p === undefined || (/^\d{1,2}$/.test(p) && +p <= 32)); };
/** Mark a field invalid (native constraint message + aria-invalid) without clearing what was typed. */
export function flag(el, msg) {
  el.setCustomValidity(msg || ""); el.setAttribute("aria-invalid", msg ? "true" : "false");
  if (msg) { el.reportValidity(); el.focus(); }
  return !msg;
}
