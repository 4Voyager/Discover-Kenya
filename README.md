# Discover Kenya — tourism website

A three-page static site (no build step, no dependencies). Open `index.html` in a browser,
or serve the folder with any static server (`python3 -m http.server`).

## Pages
- `index.html` — Home: hero, featured places, categories, popular destinations carousel, regional map, experiences, itineraries, stories, CTA
- `explore.html` — Explore: search, category/region filters, sorting, card grid, interactive map view, load more
- `attraction.html?slug=maasai-mara` — Detail page, generated from `js/data.js`

## Structure
```
css/   base.css (tokens, type, layout) · components.css (header, cards, map, buttons) · home.css · explore.css · attraction.css
js/    data.js (all content) · geo.js (country outlines) · map.js (interactive map) · icons.js · main.js (header/footer/helpers)
       motion.js (scroll reveals) · home.js (hero, carousel, regions…) · explore.js · attraction.js (incl. best-time dial)
images/   your photos, named as in IMAGE-LIST.md (SEARCH-GUIDE.md has a search phrase for each)
```

## Editing content
Every attraction lives in `js/data.js`. Add an object there and it appears on all three pages.
Fees, hours and travel conditions are approximate; confirm with the official links before publishing.

## Photos
All pictures load from `images/`. Names and sizes are in `images/IMAGE-LIST.md`. Hero pictures need to be at least
2400 px wide to stay sharp. Names are built in `KT.img` at the top of `js/data.js`.

## Home hero
`initHero` in `js/home.js`. `HOLD` (3000 ms) is how long an image stays; `MOVE` (1300 ms) is the expand time.
Text sits on the right: edit `.hero__content` in `css/home.css` to move it.

## Travel notes
The slider at the bottom of the Home page reads `KT.stories` in `js/data.js` (quote, `from` = place, `name` = who says it).
