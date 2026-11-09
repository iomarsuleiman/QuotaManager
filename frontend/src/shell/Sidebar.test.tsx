import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Sidebar } from "./Sidebar";
import { getPrefs, setPref, usePrefs } from "../lib/prefs";
import { loadLang, setLang } from "../lib/i18n";

beforeAll(async () => { await loadLang("en"); await loadLang("ar"); });
beforeEach(() => { setLang("en"); setPref("rail", false); setPref("navOrder", null); });
afterEach(() => { cleanup(); setLang("en"); vi.restoreAllMocks(); });

function Navigation({ mobile = false, onNavigate = () => {} }: { mobile?: boolean; onNavigate?: () => void }) {
  const prefs = usePrefs();
  return <Tooltip.Provider><Sidebar route="network" live="live" rail={!mobile && prefs.rail} mobile={mobile}
    onNavigate={onNavigate} onHelp={() => {}} onLogout={() => {}} /></Tooltip.Provider>;
}

describe("sidebar navigation", () => {
  it("keeps reordering out of ordinary navigation until requested", async () => {
    render(<Navigation />);
    expect(screen.getByRole("link", { name: "Network" }).getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("button", { name: /^Reorder:/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reorder" }));
    await screen.findByRole("button", { name: "Done" });
    expect(screen.getAllByRole("button", { name: /^Reorder:/ }).length).toBe(8);
    fireEvent.click(screen.getByRole("button", { name: "Reset to default" }));
    expect(getPrefs().navOrder).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("button", { name: /^Reorder:/ })).toBeNull());
  });

  it("keeps every destination named when collapsed, including Arabic", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(getPrefs().rail).toBe(true);
    expect(screen.getAllByRole("link")).toHaveLength(10);
    for (const link of screen.getAllByRole("link")) expect(link.getAttribute("aria-label")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Expand sidebar" }).getAttribute("aria-expanded")).toBe("false");
    cleanup();
    setLang("ar");
    render(<Navigation />);
    for (const link of screen.getAllByRole("link")) expect(link.getAttribute("aria-label")).toBeTruthy();
  });

  it("offers an explicit close button on mobile", () => {
    const close = vi.fn();
    render(<Navigation mobile onNavigate={close} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(close).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "Collapse sidebar" })).toBeNull();
  });
});
