# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Production build (static export to ./out)
npm run start    # Start production server
```

## Architecture

Next.js 16 documentation website using Nextra v4 with the docs theme. Documents the Jiji container orchestration tool and jiji-dns.

**Key files:**
- `next.config.mjs` - Nextra plugin config, static export enabled
- `mdx-components.js` - MDX component overrides (extends nextra-theme-docs)
- `app/_meta.global.js` - Global navigation configuration

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
- Uses Tailwind CSS with CSS variables for theming (primary color is green `hsl(142 71% 45%)`)

**Documentation sections:**
- `app/docs/getting-started/` - Installation, quick start, architecture
- `app/docs/guides/` - Deployment, CI/CD, troubleshooting
- `app/docs/reference/` - Configuration, commands, network, registry, logs
- `app/docs/jiji-dns/` - jiji-dns overview, configuration, architecture

**Adding documentation pages:** Create `.mdx` files in the appropriate directory. Update the `_meta.js` file in that directory to add navigation entries.

## Deployment

Static site deployed to GitHub Pages via `.github/workflows/deploy.yml`. Builds output to `./out` directory.

## Related Projects

The documentation content is based on:
- `/home/acidtib/Code/jiji` - Main Jiji orchestration tool
- `/home/acidtib/Code/jiji-dns` - DNS server for service discovery
