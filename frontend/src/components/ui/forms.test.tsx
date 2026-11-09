import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Select } from "./forms";

afterEach(cleanup);

function SortChoice() {
  const [value, setValue] = useState("default");
  return <Select label="Sort people" value={value} onChange={setValue} options={[
    { value: "default", label: "Default order" },
    { value: "usage", label: "Most used" },
    { value: "disabled", label: "Unavailable", disabled: true },
  ]} />;
}

describe("themed choice menu", () => {
  it("opens by keyboard, selects a value and restores trigger focus", async () => {
    render(<SortChoice />);
    const trigger = screen.getByRole("button", { name: "Sort people" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const choice = await screen.findByRole("menuitemradio", { name: "Most used" });
    expect(screen.getByRole("menuitemradio", { name: "Unavailable" }).getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(choice);
    await waitFor(() => expect(trigger.textContent).toContain("Most used"));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(document.querySelector("select")).toBeNull();
  });

  it("Escape closes without changing the selection", async () => {
    render(<SortChoice />);
    const trigger = screen.getByRole("button", { name: "Sort people" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const menu = await screen.findByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger.textContent).toContain("Default order");
  });
});
