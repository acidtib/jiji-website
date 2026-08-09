# AGENTS.md

## Commands

```bash
bun run dev      # Start development server with Turbopack
bun run build    # Production build (static export to ./out)
bun run start    # Start production server
bun test         # Test documentation generation and sitemap formatting
bun run llms     # Regenerate public/llms.txt, llms-full.txt, and sitemaps from docs content
```

`bun run build` runs `bun run llms` first, so editing any `.mdx` under `app/docs/` or
`app/page.mdx` and rebuilding is enough to keep `public/llms.txt`, `public/llms-full.txt`,
`public/sitemap.xml`, `public/docs/sitemap.xml`, and `public/robots.txt` current - no manual
sitemap or llms.txt edits needed.

Do not edit generated files in `public/` by hand. Change the MDX source, then
run `bun run llms` or `bun run build`.

## Architecture

Next.js 16 documentation website using Nextra v4 with the docs theme. Documents the Jiji container orchestration tool.

**Key files:**
- `next.config.mjs` - Nextra plugin config, static export enabled
- `mdx-components.js` - MDX component overrides (extends nextra-theme-docs)
- `app/_meta.global.js` - Global navigation configuration
- `scripts/generate-llms-txt.mjs` - Builds `public/llms*.txt` and sitemaps from `app/docs/` content

**Route structure:**
- `app/page.jsx` - Landing page (React components, not MDX)
- `app/layout.jsx` - Root layout with fonts and metadata
- `app/globals.css` - Tailwind CSS with custom theme variables and animations
- `app/docs/` - Documentation section with Nextra layout
  - `layout.jsx` - Docs layout with navbar, footer, banner
  - `_meta.js` - Navigation ordering for each directory
  - `*.mdx` - Documentation pages

**UI Components:**
- `components/ui/` - shadcn/ui components (Button, Badge, Card)
- `components/shared/` - Site-wide chrome (Navbar, Footer)
- Uses Tailwind CSS with CSS variables for theming (primary color is green `hsl(142 71% 45%)`)

**Documentation sections:**
- `app/docs/getting-started/` - Installation, quick start, architecture
- `app/docs/guides/` - Deployment, CI/CD, testing, troubleshooting
- `app/docs/reference/` - Configuration, commands, cron, features, network, proxy, registry, logs

**Adding documentation pages:** Create `.mdx` files in the appropriate directory. Update the `_meta.js` file in that directory to add navigation entries.

## Deployment

Static site deployed to GitHub Pages via `.github/workflows/deploy.yml`. Builds output to `./out` directory.

Triggers on push to `main`, manual `workflow_dispatch`, and `repository_dispatch` (event type
`jiji-release`) fired by `acidtib/jiji`'s own release workflow after a new version is published --
this keeps the landing page's version badge current without the two repos needing to be updated in
lockstep by hand. The "Resolve jiji version" step sets `NEXT_PUBLIC_JIJI_VERSION` (from the dispatch
payload if present, otherwise the latest GitHub release via `gh api`), which `app/page.jsx` reads at
build time (`const JIJI_VERSION = process.env.NEXT_PUBLIC_JIJI_VERSION || "dev"`, falls back to
`"dev"` locally where the env var isn't set).

## Related Projects

The documentation content is based on:
- `/home/acidtib/Code/jiji` - Main Jiji orchestration tool (source of truth for all docs content)

## Documentation synchronization

Use these files in the Jiji repository as the source of truth:

- `crates/jiji-cli/src/cli.rs` and `jiji --help` for commands and flags.
- `crates/jiji-config/src/schema.rs` for configuration fields and defaults.
- `crates/jiji-config/src/validation.rs` for limits and invalid combinations.
- `crates/jiji-config/src/jiji.yml` for the generated configuration reference.
- `docs/architecture-notes.md` and `AGENTS.md` for runtime invariants.
- `docs/todo.md` for advertised behavior that is not implemented.

Do not present a schema-only field as an implemented feature. State the gap
and link to the current supported behavior.

After a documentation change, run `bun test` and `bun run build`. Then run
`bun run dev` and load each changed route to make sure that it renders.

## Writing style

- Do not use emojis anywhere: code, comments, commit messages, or chat replies.
- Do not use em-dashes. Use commas, colons, parentheses, or separate sentences.
- Avoid filler "LLM-tell" phrasing. Write plainly and directly.

# Code comments

- Comment to explain why something is done or to flag a non-obvious constraint.
- Do not write summary comments that just restate what the next line does.
- Skip section-header and narration comments. Let the code speak for itself.

## Git

- Never add a co-author trailer to commits (no "Co-Authored-By" line).
- Keep commit messages short and factual.
- Never use `git commit --no-verify` - if hooks fail, fix every issue before
  committing
- Never use destructive commands (`git reset --hard`, `git checkout --`)
  unless explicitly approved
- Never force push to main
- No revert commits for unpushed work: use `git reset HEAD~1` instead of
  `git revert`
- Do not amend a commit unless explicitly requested
