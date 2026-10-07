import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "../app/components/MarkdownContent";

describe("MarkdownContent", () => {
  it("renders formatting and safe links without interpreting raw HTML", () => {
    const html = renderToStaticMarkup(
      <MarkdownContent
        content={"## A heading\n\n**Bold text** [safe](https://example.com) [unsafe](javascript:alert(1))\n\n<script>alert(1)</script>"}
      />,
    );

    expect(html).toContain("<h2");
    expect(html).toContain("<strong>Bold text</strong>");
    expect(html).toContain('href="https://example.com"');
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });
});
