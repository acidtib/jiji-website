#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// _meta.js files are ESM ("export default {...}"), which plain Node can't
// import without the package declaring "type": "module". They're just
// object literals though, so strip the export and eval the expression.
function loadMeta(dir) {
  const source = readFileSync(path.join(dir, "_meta.js"), "utf8").replace(
    /export default/,
    ""
  );
  return new Function(`"use strict"; return (${source});`)();
}

export function metaTitle(entry, fallback) {
  if (!entry) return fallback;
  return typeof entry === "string" ? entry : (entry.title ?? fallback);
}

export function pageTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

export function bodyWithoutTitle(markdown) {
  return markdown.replace(/^#[^\n]*\n/, "").trim();
}

export function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;")
    .replaceAll(">", "&gt;")
    .replaceAll("<", "&lt;");
}

export function urlSet(routes, siteUrl) {
  const urls = routes
    .map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route}`)}</loc></url>`)
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function nestHeadings(markdown, wrapperLevel) {
  let fence = null;

  return markdown
    .split("\n")
    .map((line) => {
      const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
      if (
        fence &&
        fenceMatch?.[1][0] === fence.marker &&
        fenceMatch[1].length >= fence.length &&
        !fenceMatch[2].trim()
      ) {
        fence = null;
        return line;
      }
      if (fence) return line;
      if (fenceMatch) {
        fence = {
          marker: fenceMatch[1][0],
          length: fenceMatch[1].length,
        };
        return line;
      }

      return line.replace(/^(\s{0,3})(#{1,6})(\s+)/, (_, indent, hashes, space) => {
        const level = Math.min(6, hashes.length + wrapperLevel - 1);
        return `${indent}${"#".repeat(level)}${space}`;
      });
    })
    .join("\n");
}

// First real prose/list paragraph after the H1, skipping bare heading lines
// and fenced code blocks, flattened to one line for use as a link summary.
export function excerpt(markdown, maxLen = 220) {
  const blocks = bodyWithoutTitle(markdown).split(/\n\s*\n/);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("```")) {
      continue;
    }
    const text = trimmed
      .split("\n")
      .map((line) => line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""))
      .join(" ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[`*_]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text) {
      return text.length > maxLen
        ? `${text.slice(0, maxLen - 1).trimEnd()}…`
        : text;
    }
  }
  return "";
}

export function generate({
  projectRoot = root,
  siteUrl = process.env.SITE_URL || "https://jiji.run",
} = {}) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const docsDir = path.join(projectRoot, "app/docs");
  const topMeta = loadMeta(docsDir);
  const introSource = readFileSync(path.join(docsDir, "page.mdx"), "utf8");
  const introTitle = pageTitle(
    introSource,
    metaTitle(topMeta.index, "Introduction")
  );
  const introSummary = excerpt(introSource);
  const sectionKeys = Object.keys(topMeta).filter((key) => key !== "index");
  const docsRoutes = ["/docs"];

  const llms = [
    "# Jiji",
    "",
    `> ${introSummary}`,
    "",
    "## Documentation",
    "",
    `- [${introTitle}](${normalizedSiteUrl}/docs): ${introSummary}`,
  ];

  const full = [
    "# Jiji",
    "",
    `> ${introSummary}`,
    "",
    `## ${introTitle}`,
    "",
    nestHeadings(bodyWithoutTitle(introSource), 2),
  ];

  for (const sectionKey of sectionKeys) {
    const sectionDir = path.join(docsDir, sectionKey);
    const sectionTitle = metaTitle(topMeta[sectionKey], sectionKey);
    const sectionMeta = loadMeta(sectionDir);

    llms.push("", `## ${sectionTitle}`);
    full.push("", `## ${sectionTitle}`);

    for (const pageKey of Object.keys(sectionMeta)) {
      const pagePath = path.join(sectionDir, pageKey, "page.mdx");
      const source = readFileSync(pagePath, "utf8");
      const heading = pageTitle(source, metaTitle(sectionMeta[pageKey], pageKey));
      const summary = excerpt(source);
      const route = `/docs/${sectionKey}/${pageKey}`;
      const url = `${normalizedSiteUrl}${route}`;

      docsRoutes.push(route);
      llms.push(`- [${heading}](${url}): ${summary}`);

      full.push(
        "",
        `### ${heading}`,
        "",
        `Source: ${url}`,
        "",
        nestHeadings(bodyWithoutTitle(source), 3)
      );
    }
  }

  writeFileSync(
    path.join(projectRoot, "public/llms.txt"),
    llms.join("\n") + "\n"
  );
  writeFileSync(
    path.join(projectRoot, "public/llms-full.txt"),
    full.join("\n") + "\n"
  );
  writeFileSync(
    path.join(projectRoot, "public/sitemap.xml"),
    urlSet(["/"], normalizedSiteUrl)
  );
  writeFileSync(
    path.join(projectRoot, "public/docs/sitemap.xml"),
    urlSet(docsRoutes, normalizedSiteUrl)
  );
  writeFileSync(
    path.join(projectRoot, "public/robots.txt"),
    [
      "User-agent: *",
      `Sitemap: ${normalizedSiteUrl}/sitemap.xml`,
      `Sitemap: ${normalizedSiteUrl}/docs/sitemap.xml`,
      "Allow: /",
      "",
    ].join("\n")
  );
}

if (import.meta.main) {
  generate();
  console.log("Generated LLM resources and sitemaps in public/");
}
