import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // 1. Import MemoryRouter

import App from "./App";

describe("something truthy and falsy", () => {
  it("true to be true", () => {
    expect(true).toBe(true);
  });

  it("false to be false", () => {
    expect(false).toBe(false);
  });
});

describe("App", () => {
  it("renders paragraph", () => {
    // 2. Wrap your component in the MemoryRouter
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("paragraph").textContent).toMatch(
      /Here are some examples of links to other pages/i
    );
  });
});
