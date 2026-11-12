import { expect, it } from "vitest";
import { EDITOR_REMEMBER_MS, editorRememberValid } from "../editorRemember";

it("remembers an editor for at most 30 days", () => {
  expect(EDITOR_REMEMBER_MS).toBe(2592000000);
  expect(editorRememberValid(String(1000 + EDITOR_REMEMBER_MS), 1000)).toBe(true);
  expect(editorRememberValid(String(1001 + EDITOR_REMEMBER_MS), 1000)).toBe(false);
  expect(editorRememberValid("1000", 1000)).toBe(false);
});