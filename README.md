# Fidel Tito, personal website

Source for [omarftt.github.io/website](https://omarftt.github.io/website/). It is a static site with no build step: GitHub Pages serves the repository root as-is.

## Structure

```
index.html              the whole page
404.html                not-found page (uses absolute /website/ paths)
assets/css/site.css     styles, colors and dark mode (tokens at the top)
assets/js/site.js       theme toggle, active nav link, BibTeX panels
assets/img/             photo, icons, social card, paper thumbnails, logos
data/Fidel/CV_Fidel_T.pdf   CV (keep this filename so old links keep working)
```

## Preview locally

Serve the parent folder so the URL matches production (`/website/`):

```bash
python3 -m http.server 8765 --directory ..
```

Then open http://localhost:8765/website/.

## Common updates

- **New paper:** copy one `<li class="pub">` block in `index.html`, change the links, and give its BibTeX panel a new `id` (and the button's `aria-controls`). Badges: `badge-main` for main conferences, `badge-workshop` for workshops, `badge-oral` for orals.
- **Thumbnail:** save the figure at about 560×350 as WebP in `assets/img/pubs/`, e.g. `cwebp -q 82 figure.png -o assets/img/pubs/name.webp`.
- **CV:** replace `data/Fidel/CV_Fidel_T.pdf`, keeping the same filename.

## Credits

Design inspired by Sixun Dong's [Config-Driven Academic Website Template](https://github.com/Ironieser/ironieser.github.io) and [Jon Barron's website](https://github.com/jonbarron/jonbarron.github.io), which earlier versions of this site were based on. The code here was written from scratch.
