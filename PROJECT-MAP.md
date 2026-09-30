# Project Map

This package was conservatively tidied without changing runtime behavior.

## Main runtime pages
- `index.html` — main entry
- `dashboard-pinjaman.html` — loan dashboard
- `dormant.html` — dormant account page
- `login-pinjaman.html` — loan login flow
- `admin.html` — admin interface

## Shared runtime files
- `flow-state.js` — shared page state
- `firebase-runtime.js` — Firebase runtime integration
- `firebase-config.js` — Firebase configuration
- `realtime-config.js` — realtime configuration
- `mobile-priority.css` — mobile layout priority rules

## `/kb` mirror
The `/kb` directory is intentionally preserved because it mirrors runtime files used by alternate routing/deployment paths. It was not deduplicated to avoid breaking relative URLs or deployment behavior.

## Backups
`.bak` files are intentionally preserved because they are not byte-identical to their current counterparts.

## Cleanup scope
- Empty directories removed.
- Existing runtime files preserved.
- Existing root/`/kb` routing structure preserved.
- No functional refactor performed.
