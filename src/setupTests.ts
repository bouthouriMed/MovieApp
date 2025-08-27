// extend { expect, ...} with jest-dom matchers ---
import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset DOM after each test
afterEach(() => {
  cleanup();
});
