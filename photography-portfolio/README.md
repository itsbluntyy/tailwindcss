# Photography Portfolio

A fast, dark, minimal photography portfolio built as a pure static site — plain HTML, CSS, and
vanilla JavaScript. No framework, no build step: open `index.html` in a browser and it works.

## Structure

```
photography-portfolio/
├── index.html        # Home — full-width hero + name/tagline
├── gallery.html      # Masonry gallery with category filters and a lightbox
├── about.html
├── contact.html      # mailto link
├── css/style.css     # All styles (accent color, breakpoints, etc.)
├── js/photos.js      # ← THE data file: every photo on the site lives here
├── js/gallery.js     # Renders the grid/filters/lightbox from photos.js
└── images/           # Put your own photos here
```

## Running it locally

Any static file server works, e.g.:

```sh
cd photography-portfolio
python3 -m http.server 8000
# → http://localhost:8000
```

(Opening `index.html` directly from disk also works.)

## Adding your own photos

1. **Export your photo** into the `images/` folder. For best performance export three widths —
   roughly 400px, 800px, and 1600px wide — e.g. `ridge-400.jpg`, `ridge-800.jpg`, `ridge-1600.jpg`.
   A single file also works; you just lose the responsive-size benefit on small screens.

2. **Add one entry to `js/photos.js`:**

   ```js
   {
     id: 'ridge-01',                 // any unique string
     category: 'landscape',          // any word — new categories automatically
                                     // get their own filter button
     alt: 'Sunrise over the ridge',  // required: describe the photo (accessibility)
     caption: 'Dolomites, 2025',     // optional: shown in the lightbox
     width: 1600, height: 1067,      // pixel dimensions of the largest file
                                     // (prevents layout shift while loading)
     src: 'images/ridge-1600.jpg',
     srcset: [                       // optional responsive sizes
       ['images/ridge-400.jpg', 400],
       ['images/ridge-800.jpg', 800],
       ['images/ridge-1600.jpg', 1600],
     ],
   },
   ```

3. Reload the gallery page. The grid, the filter buttons, and the lightbox all read from
   `photos.js` — nothing else needs to change.

The entries currently in `photos.js` are placeholders from [picsum.photos](https://picsum.photos)
(they have a `picsum` id instead of a `src`). Delete them as you replace them with your own work.
The hero and the three category teasers on the home page are plain `<img>` tags in `index.html` —
swap their `src`/`srcset` for your own files there.

## Customizing

- **Name / tagline / bio / email** — search for “Your Name” across the four HTML files, and change
  the `mailto:` address in `contact.html`.
- **Accent color** — one variable: `--accent` at the top of `css/style.css`.
- **Columns** — the masonry breakpoints are the `columns: 2` / `columns: 3` rules in `style.css`.

## Deploying

### GitHub Pages

1. Create a repository and push the contents of this folder to it (the files, not the folder —
   `index.html` should be at the repository root):

   ```sh
   cd photography-portfolio
   git init && git add -A && git commit -m "Portfolio"
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save**.
3. Your site appears at `https://<you>.github.io/<repo>/` within a minute or two.

### Netlify

Zero-config, since there is no build step:

- **Drag and drop:** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drop the
  `photography-portfolio` folder onto the page. Done.
- **From Git:** “Add new site → Import an existing project”, pick the repo, leave the build
  command **empty**, and set the publish directory to the folder containing `index.html`.

## Performance notes

The site is built to score 90+ on Lighthouse performance and accessibility:

- Every image has explicit `width`/`height` (no layout shift), `srcset`/`sizes` (right-sized
  downloads), and `loading="lazy"` below the fold; the hero loads with `fetchpriority="high"`.
- No JavaScript on the home/about/contact pages at all; the gallery ships two tiny dependency-free
  scripts.
- The lightbox is a native `<dialog>` (free focus trapping and Escape-to-close) with arrow-key
  navigation, and all interactive elements are keyboard-accessible with visible focus styles.

Keep it that way by exporting reasonably sized JPEGs (~1600px on the long edge, quality ~80) —
the placeholders will always score slightly lower than local images because they come from a
third-party host.
