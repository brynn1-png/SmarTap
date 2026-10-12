# SmarTap website

## AI development harness

Start with [AGENTS.md](AGENTS.md). It points to the working rules, current architecture, workflow, and project context in `.ai/`. Put larger task specifications in `.ai/tasks/`; keep `progress.md`, `decisions.md`, and `results.md` current after a development session. [plan.md](plan.md) describes a proposed profile app and is not implemented yet.

Responsive SmarTap product website, built with React and Vite. The Starter example card is at `/demo/index.html`, and the fictional coffee shop Business showcase is at `/demo/business.html`.

The homepage is editable in `src/App.jsx` and `src/site.css`. The Starter and Business demos are React pages in `src/StarterDemo.jsx` and `src/BusinessDemo.jsx`, with styles in `src/starter.css` and `src/business.css`. Their small HTML entry files are in `demo/`. `public/` contains the photos, phone cutout, logos, and fonts used by these three pages.

## Run

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/`. The Starter card is at `http://127.0.0.1:5173/demo/index.html` and has Light and Dark modes. The Business coffee shop demo is at `http://127.0.0.1:5173/demo/business.html`.

## Production build

```sh
npm run build
npm run preview
```

Deploy only `dist/` to a static host, preserving its directory structure. The build includes the homepage and both demos. Design previews and archived reference assets have been removed. Repository documentation and AI instructions are development files and are not included in `dist/`.

The transparent wordmark in `public/smartap-logo.svg` uses the supplied vector artwork. `public/smartap-logo-dark.svg` is its dark ink version for light surfaces. The small `public/smartap-mark.svg` icon also has a dark ink version in `public/smartap-mark-dark.svg`.

The homepage footer contains Lloyd's SmarTap contact details and quick actions. Package demo links remain in the Packages section.

The Starter card uses Lloyd's Facebook and Instagram profiles. Its portrait is illustrative; replace it with Lloyd's photo before using the card as a live personal profile.
