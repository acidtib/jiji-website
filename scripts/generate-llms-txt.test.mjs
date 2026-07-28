import { describe, expect, test } from "bun:test";

import {
  bodyWithoutTitle,
  escapeXml,
  excerpt,
  metaTitle,
  nestHeadings,
  pageTitle,
  urlSet,
} from "./generate-llms-txt.mjs";

describe("documentation metadata", () => {
  test("uses configured titles and fallbacks", () => {
    expect(metaTitle("Guides", "guides")).toBe("Guides");
    expect(metaTitle({ title: "Reference" }, "reference")).toBe("Reference");
    expect(metaTitle(undefined, "fallback")).toBe("fallback");
  });

  test("extracts and removes the page title", () => {
    const markdown = "# Quick start\n\nInstall Jiji.";

    expect(pageTitle(markdown, "Fallback")).toBe("Quick start");
    expect(bodyWithoutTitle(markdown)).toBe("Install Jiji.");
    expect(pageTitle("No heading", "Fallback")).toBe("Fallback");
  });
});

describe("LLM text formatting", () => {
  test("builds a plain-text excerpt from the first content block", () => {
    const markdown = [
      "# Install",
      "",
      "## Requirements",
      "",
      "- Use **Linux**",
      "- Read the [guide](/docs/guide) and run `jiji up`",
    ].join("\n");

    expect(excerpt(markdown)).toBe(
      "Use Linux Read the guide and run jiji up"
    );
  });

  test("truncates excerpts at the requested length", () => {
    expect(excerpt("# Title\n\nA long summary", 8)).toBe("A long…");
  });

  test("nests headings without changing fenced code", () => {
    const markdown = [
      "## Outside",
      "",
      "```md",
      "# Inside",
      "```",
      "",
      "### After",
    ].join("\n");

    expect(nestHeadings(markdown, 3)).toBe(
      ["#### Outside", "", "```md", "# Inside", "```", "", "##### After"].join(
        "\n"
      )
    );
  });
});

describe("sitemap formatting", () => {
  test("escapes XML-sensitive URL characters", () => {
    expect(escapeXml(`&<>'"`)).toBe("&amp;&lt;&gt;&apos;&quot;");
  });

  test("renders routes with the configured site URL", () => {
    expect(urlSet(["/", "/docs?a=1&b=2"], "https://example.com")).toContain(
      "<loc>https://example.com/docs?a=1&amp;b=2</loc>"
    );
  });
});
