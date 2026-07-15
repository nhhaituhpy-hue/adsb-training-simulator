import { describe, expect, it } from "vitest";

import { getActionIdentity, gradeActions } from "../../src/lib/grading";
import type {
  RecordedAction,
  RecordedActionKind,
} from "../../src/lib/types";

function action(
  step: number,
  menuId: string,
  input: string,
  kind: RecordedActionKind = "menu-selection",
): RecordedAction {
  return {
    step,
    kind,
    menuId,
    menuTitle: menuId,
    input,
    resultLabel: `${menuId}:${input}`,
    timestamp: step,
  };
}

describe("getActionIdentity", () => {
  it("normalizes menu IDs, x/X, and empty Enter/RETURN/0", () => {
    expect(getActionIdentity(action(1, " SA.Network ", " x "))).toBe(
      getActionIdentity(action(2, "sa.network", "X")),
    );
    expect(getActionIdentity(action(1, "sa.network", ""))).toBe(
      getActionIdentity(action(2, "SA.NETWORK", "RETURN")),
    );
    expect(getActionIdentity(action(1, "sa.network", "RETURN"))).toBe(
      getActionIdentity(action(2, "sa.network", "0")),
    );
  });

  it("does not match the same input in different menu contexts", () => {
    expect(getActionIdentity(action(1, "sa.root", "1"))).not.toBe(
      getActionIdentity(action(2, "sa.general", "1")),
    );
  });
});

describe("gradeActions", () => {
  it("passes an exact normalized sequence", () => {
    const expected = [
      action(1, "sa.root", "01"),
      action(2, "sa.general", "1"),
      action(3, "sa.general", "RETURN"),
    ];
    const submitted = [
      action(1, "SA.ROOT", "1"),
      action(2, "sa.general", " 1 "),
      action(3, "sa.general", ""),
    ];

    const result = gradeActions(expected, submitted);

    expect(result).toMatchObject({
      passed: true,
      score: 100,
      correctSteps: 3,
      totalExpected: 3,
      totalSubmitted: 3,
    });
    expect(result.steps.map((step) => step.status)).toEqual([
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("marks a same-position mismatch as incorrect", () => {
    const expected = [
      action(1, "sa.root", "1"),
      action(2, "sa.general", "1"),
      action(3, "sa.general", "0"),
    ];
    const submitted = [
      action(1, "sa.root", "1"),
      action(2, "sa.general", "2"),
      action(3, "sa.general", "0"),
    ];

    const result = gradeActions(expected, submitted);

    expect(result.passed).toBe(false);
    expect(result.score).toBe(66.67);
    expect(result.steps.map((step) => step.status)).toEqual([
      "correct",
      "incorrect",
      "correct",
    ]);
  });

  it("uses LCS to identify missing and redundant actions after reordering", () => {
    const expected = [
      action(1, "sa.root", "1"),
      action(2, "sa.general", "2"),
    ];
    const submitted = [
      action(1, "sa.general", "2"),
      action(2, "sa.root", "1"),
    ];

    const result = gradeActions(expected, submitted);

    expect(result.passed).toBe(false);
    expect(result.score).toBe(50);
    expect(result.steps.filter((step) => step.status === "correct")).toHaveLength(1);
    expect(result.steps.some((step) => step.status === "missing")).toBe(true);
    expect(result.steps.some((step) => step.status === "redundant")).toBe(true);
  });

  it("fails on redundant actions even when every expected step matches", () => {
    const expected = [
      action(1, "sa.root", "1"),
      action(2, "sa.general", "2"),
    ];
    const submitted = [
      action(1, "sa.root", "1"),
      action(2, "sa.general", "99"),
      action(3, "sa.general", "2"),
    ];

    const result = gradeActions(expected, submitted);

    expect(result.score).toBe(100);
    expect(result.passed).toBe(false);
    expect(result.steps.map((step) => step.status)).toEqual([
      "correct",
      "redundant",
      "correct",
    ]);
  });

  it("excludes login and password actions from grading", () => {
    const expected = [
      action(1, "authentication", "sysadmin", "authentication"),
      action(2, "sa.root", "2"),
    ];
    const submitted = [
      action(1, "authentication", "wrong-user", "authentication"),
      action(2, "authentication", "wrong-password", "authentication"),
      action(3, "sa.root", "2"),
    ];

    const result = gradeActions(expected, submitted);

    expect(result).toMatchObject({
      passed: true,
      score: 100,
      totalExpected: 1,
      totalSubmitted: 1,
    });
  });

  it("handles empty expected and submitted sequences", () => {
    expect(gradeActions([], [])).toMatchObject({
      passed: true,
      score: 100,
      totalExpected: 0,
      totalSubmitted: 0,
    });

    expect(gradeActions([], [action(1, "sa.root", "1")])).toMatchObject({
      passed: false,
      score: 0,
      totalExpected: 0,
      totalSubmitted: 1,
    });
  });
});

