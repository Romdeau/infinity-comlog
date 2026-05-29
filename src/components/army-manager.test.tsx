import * as React from "react";

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { ArmyManager } from "./army-manager";
import { ArmyContext, type ArmyContextType } from "@/context/army-context-core";
import { SettingsProvider } from "@/context/settings-context";
import type { EnrichedArmyList, StoredArmyList } from "@/lib/unit-service";
import { unitService } from "@/lib/unit-service";

const makeList = (overrides: Partial<StoredArmyList> = {}): StoredArmyList => ({
  armyName: "Baseline List",
  sectoralId: 101,
  sectoralName: "PanOceania",
  points: 300,
  combatGroups: [],
  rawCode: "baseline-code",
  rawBase64: "baseline-code",
  schemaVersion: 1,
  importTimestamp: 1,
  validationHash: "baseline-hash",
  ...overrides,
});

const renderArmyManager = ({
  activeLists,
  storedLists,
  setLists = vi.fn(),
}: {
  activeLists: ArmyContextType["lists"];
  storedLists: Record<string, StoredArmyList>;
  setLists?: ArmyContextType["setLists"];
}) => {
  const contextValue: ArmyContextType = {
    lists: activeLists,
    setLists,
    storedLists,
    saveList: vi.fn(),
    deleteList: vi.fn(),
    reimportAllLists: vi.fn(async () => {}),
    importErrors: [],
    clearImportErrors: vi.fn(),
  };

  render(
    <SettingsProvider>
      <ArmyContext.Provider value={contextValue}>
        <ArmyManager />
      </ArmyContext.Provider>
    </SettingsProvider>
  );

  return { setLists };
};

describe("ArmyManager pair validation", () => {
  afterEach(() => {
    cleanup();
  });

  it("rejects assigning a saved list with a mismatched sectoral", () => {
    const listA = makeList({ armyName: "List A", sectoralId: 101, sectoralName: "PanOceania" });
    const candidate = makeList({ armyName: "Nomads Candidate", sectoralId: 102, sectoralName: "Nomads" });
    const { setLists } = renderArmyManager({
      activeLists: { listA: listA as EnrichedArmyList, listB: null },
      storedLists: { candidate },
    });

    fireEvent.click(screen.getByRole("button", { name: /set as b/i }));

    expect(screen.getByText(/Both active lists need to use the same sectoral/i)).toBeTruthy();
    expect(setLists).not.toHaveBeenCalled();
  });

  it("rejects assigning a saved list with a mismatched points value", () => {
    const listA = makeList({ armyName: "List A", points: 300 });
    const candidate = makeList({ armyName: "Small Candidate", points: 250 });
    const { setLists } = renderArmyManager({
      activeLists: { listA: listA as EnrichedArmyList, listB: null },
      storedLists: { candidate },
    });

    fireEvent.click(screen.getByRole("button", { name: /set as b/i }));

    expect(screen.getByText(/Both active lists need the same points value/i)).toBeTruthy();
    expect(setLists).not.toHaveBeenCalled();
  });

  it("passes the current measurement unit when importing a parsed list", async () => {
    window.localStorage.setItem("comlog_settings", JSON.stringify({ measurementUnit: "metric" }));
    const enrich = vi.spyOn(unitService, "enrichArmyList").mockResolvedValue(makeList({ armyName: "Imported" }));
    const setLists = vi.fn(() => ({ valid: true as const }));
    renderArmyManager({
      activeLists: { listA: null, listB: null },
      storedLists: {},
      setLists,
    });

    fireEvent.change(screen.getByLabelText(/Paste Army Code/i), {
      target: { value: "gr8Kb3BlcmF0aW9ucwEggSwCAQoAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgA=" },
    });
    fireEvent.click(screen.getByRole("button", { name: /parse & import list/i }));

    await vi.waitFor(() => {
      expect(enrich).toHaveBeenCalledWith(expect.objectContaining({ sectoralId: 703 }), "metric");
    });
  });
});
