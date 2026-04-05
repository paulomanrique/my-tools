# AGENTS.md

## Project overview

`tools.paulo.dev` is a static frontend-only portal of useful browser tools. The app is built with React, TypeScript, Vite, Tailwind CSS, i18n, and route-level SEO metadata.

## Architecture rules

- Keep the site static and compatible with GitHub Pages.
- Prefer browser-native implementations first.
- If a feature cannot be implemented reliably in the browser, document the limitation clearly before proposing backend work.
- DNS propagation checks must stay on the approved public DNS-over-HTTPS approach unless the project scope explicitly changes.

## Routing and i18n

- Locale is part of the URL.
- Keep locale prefixes stable.
- Preserve per-tool routes for SEO.
- Maintain support for `en`, `pt`, `es`, `it`, `de`, `nl`, `ja`, `zh`, `ko`, `ar`, `ru`, `sr`.
- Arabic must keep proper RTL behavior.

## SEO requirements

- Every tool page must have unique title and description.
- Every tool page must expose canonical and `hreflang` metadata.
- Avoid thin pages. Each tool page must keep explanatory copy, usage steps, and FAQ content visible without interaction.
- Keep sitemap and robots current when routes change.

## AdSense

- All pages need reusable AdSense slots.
- Development should render placeholders safely when no AdSense client ID is configured.

## Documentation

- Keep `README.md` concise and practical.
- Update docs when build, deploy, or hosting assumptions change.

## Git workflow

- Each code alteration must be committed.
- Push the final branch state after the work is complete.
- Never rewrite unrelated user changes.
- If no git remote is configured, report that push is blocked and do not fabricate success.
