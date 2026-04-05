# tools.paulo.dev

Open-source browser tools published at `tools.paulo.dev`.

Current tools:
- YouTube thumbnail grabber
- Image converter
- DNS propagation checker with public DNS-over-HTTPS resolvers

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- react-router-dom
- i18next
- react-helmet-async

## Frontend-only notes

- All tools run in the browser.
- No backend is required for the current feature set.
- The DNS checker is limited to public DNS-over-HTTPS endpoints that allow browser access. It is not a full global raw-DNS network like `whatsmydns.net`.
- Advanced image formats such as `HEIC/HEIF` are not included in the first release. They may require WASM later.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

The build pipeline also generates `public/sitemap.xml` before bundling.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow that:

1. installs dependencies with `pnpm`
2. runs the production build
3. publishes `dist/` to the `gh-pages` branch

For production:
- configure GitHub Pages to serve from `gh-pages`
- point the custom domain `tools.paulo.dev` to GitHub Pages
- add `VITE_ADSENSE_CLIENT` as a repository secret if you want live AdSense rendering

## SEO approach

- Locale-specific clean URLs
- Tool-specific titles and meta descriptions
- canonical and `hreflang` tags
- JSON-LD for app and FAQ content
- static `robots.txt` and sitemap generation

## Open source

The project is intended to stay source-available on GitHub with a lightweight contributor workflow.
