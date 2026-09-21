# Repository Guidelines

## Project Structure & Module Organization

Emmet is a PHP-served, client-side songbook application. `index.php` assembles the page, embeds files from `incl/`, and adds cache-busting timestamps to local assets. Keep page fragments in `incl/` and Mustache templates in `incl/templates/` (for example, `song.html`).

Application JavaScript is organized as AMD modules in `js/emmet/`; add a matching `define([...], function (...) {})` module there and load it through RequireJS. `js/main.js` configures third-party modules and starts the app. Committed vendor libraries belong in `js/lib/`. Styles, fonts, and icons live under `css/`; image assets live under `img/`. `changelog.json` provides in-app release notes. Song data (`songs.json`) is deliberately local and ignored by Git.

## Build, Test, and Development Commands

There is no build step, package manager, linter, or automated test suite. Serve the repository with PHP for local development:

```sh
php -S localhost:8000
```

Then open `http://localhost:8000/`. Exercise changed flows in a browser, including song loading, search, templates, and projector mode when relevant. Check the browser console for RequireJS and runtime errors. Do not add generated files or local `songs.json*` data to commits.

## Coding Style & Naming Conventions

Follow the existing style: four-space indentation, semicolons, double-quoted JavaScript strings, and `var` for local functions/variables unless adjacent code uses `const` or `let`. In new code, use modern JavaScript syntax. Keep AMD dependency lists accurate—modules that use `$` must declare `jquery`. Use lowercase, descriptive module filenames such as `songdisplay.js`; use `emmet-` prefixes for DOM IDs and CSS classes. Preserve the Hungarian UI copy and existing template conventions.

## Testing Guidelines

Manually verify the affected user journey before opening a PR. Test on a PHP server rather than opening `index.php` directly, because the app fetches JSON and loads AMD modules. For UI changes, check both desktop and narrow viewport behavior; include projector-specific verification when touching `projector.js` or related templates.

## Commit & Pull Request Guidelines

Use concise Conventional Commit-style subjects, e.g. `feat: add book query parameter`, `fix(projector): align toolbar`, or `chore(changelog): add version 8.3`. Keep each commit focused. PRs should explain the behavior change, link relevant issues, and include screenshots for visible UI changes. The PR workflow requires one of these labels: `új funkció`, `fejlesztés`, `hibajavítás`, or `infrastruktúra`.
