import { mkdirSync, mkdtempSync, rmSync, writeFileSync as writeFile } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import {
  bodyWithoutTitle,
  escapeXml,
  excerpt,
  metaTitle,
  nestHeadings,
  pageTitle,
  topLevelRoutes,
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

  test("removes Next.js metadata from generated documentation", () => {
    const markdown = `export const metadata = {
  description: 'Install Jiji.',
  alternates: { canonical: '/docs/install' }
}

# Installation

Install the binary.`;

    expect(bodyWithoutTitle(markdown)).toBe("Install the binary.");
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

describe("topLevelRoutes", () => {
  function withFixtureProject(pages, run) {
    const projectRoot = mkdtempSync(path.join(tmpdir(), "jiji-website-"));
    const appDir = path.join(projectRoot, "app");
    mkdirSync(appDir, { recursive: true });
    for (const relativePath of pages) {
      const filePath = path.join(appDir, relativePath);
      mkdirSync(path.dirname(filePath), { recursive: true });
      writeFile(filePath, "");
    }
    try {
      run(projectRoot);
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  }

  test("discovers every app/<name>/page.* directory, root included", () => {
    withFixtureProject(
      ["page.jsx", "docs/page.mdx", "privacy/page.jsx", "terms/page.jsx"],
      (projectRoot) => {
        expect(topLevelRoutes(projectRoot)).toEqual([
          "/",
          "/docs",
          "/privacy",
          "/terms",
        ]);
      }
    );
  });

  test("a new page directory is picked up without editing this script", () => {
    withFixtureProject(
      ["page.jsx", "docs/page.mdx", "pricing/page.tsx"],
      (projectRoot) => {
        expect(topLevelRoutes(projectRoot)).toContain("/pricing");
      }
    );
  });

  test("ignores directories with no page file and Next.js private/group/dynamic segments", () => {
    withFixtureProject(
      [
        "page.jsx",
        "docs/page.mdx",
        "api/route.js",
        "_components/button.jsx",
        "(marketing)/about/page.jsx",
        "[slug]/page.jsx",
      ],
      (projectRoot) => {
        expect(topLevelRoutes(projectRoot)).toEqual(["/", "/docs"]);
      }
    );
  });
});
