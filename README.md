# Stomping Grounds

A world map of skateboarding's most famous clips, pinned where they were stomped.

Pick **Street Skating**, **Park Skating** or **Skaters** on the way in. Click any pin and the panel
opens with the trick, the spot, the stats and the video — and the map drops into a 3D fly-in over
the actual spot, so you can see the stair count for yourself.

**174 clips · 25 countries · 1986–2026 · 106 skaters**

Three collections share the map:

| Pin | Collection | What it is |
| --- | --- | --- |
| Dot | **My War** | All 32 episodes of Thrasher's *My War* series |
| Diamond | **Famous clips** | 95 landmark video parts and clips — Jaws at the Lyon 25, the Leap of Faith, the Wallenberg four, Hubba Hideout, the water tower ollie |
| Square | **Contest tricks** | 47 of the wildest tricks ever landed in competition, from Tony Hawk's 900 to Juni Kang's nollie backside 270 heelflip to boardslide 270 out |

A hollow pin means the exact spot was never published, so it sits at city level.

## Running it

No build step, no dependencies, no Node. It is plain HTML, CSS and vanilla JavaScript.

```sh
powershell -ExecutionPolicy Bypass -File serve.ps1
```

That serves the folder at <http://localhost:8377/>. Any static server works just as well —
it only needs to be served over `http://` rather than opened as a `file://` path, because
YouTube embeds refuse to load otherwise.

### Photorealistic 3D (optional)

Out of the box the 3D spot view uses open data: Esri satellite imagery draped over AWS terrain
tiles with OpenStreetMap buildings extruded on top. No account needed.

For Google's photorealistic 3D tiles instead, copy `config.example.js` to `config.js` and paste in
a Google Maps API key with **Map Tiles API** and **Maps JavaScript API** enabled. Restrict the key
by HTTP referrer. `config.js` is gitignored, so the key stays on your machine. If the key is
missing or rejected, the site falls back to the keyless view on its own.

## How the data is put together

Research lives in readable JSON; two shell scripts bundle it into the files the page loads.

| Source | Becomes | Holds |
| --- | --- | --- |
| `data.js` | *(loaded directly)* | The 32 My War episodes |
| `classics-*.json`, `contest-*.json` | `classics.js` | Famous clips and contest tricks |
| `skaters-*.json` | `skaters.js` | The 106 skater profiles |
| `portraits/` | `portraits.js` | Local copies of the portraits |

```sh
sh build-classics.sh    # rebuild classics.js and skaters.js after editing any JSON
sh fetch-portraits.sh   # download any new portraits and re-map portraits/
```

Edit the JSON, never the generated `.js` files.

### Adding a photo

60 of the 106 skaters have a freely licensed portrait. The rest fall back to a still from their own
clip. To use your own image for anyone, drop it in `portraits/` named after the skater — lower case,
dashes for spaces, no accents or nicknames, for example `portraits/tom-penny.jpg` — then re-run
`sh fetch-portraits.sh`. A file you add by hand overrides whatever was there.

`find-portraits.ps1` searches Openverse for Creative Commons portraits of anyone still missing one,
and `apply-portraits.ps1` writes the ones you accept into the skater files. **Look at the candidates
before applying them.** Of 18 that matched a skater's name in the image title, seven were wrong —
one "Heath Kirchart" result was a photograph of a motorcycle.

## Under the hood

* **Leaflet** + markercluster for the world map, on Esri light-gray tiles with satellite above zoom 16
* **MapLibre GL** for the keyless 3D view; Google's `Map3DElement` when a key is set
* Camera altitude is read from terrain tiles before each fly-in, otherwise the camera starts
  underground and you get a view of the inside of a hill
* Deep links: `?tab=park`, `?skater=john-cardiel`, `#chris-joslin-el-toro-20`
* Respects `prefers-reduced-motion`; works down to phone width

## Credits and licensing

This is an unofficial fan project, not affiliated with or endorsed by Thrasher Magazine. *My War*
is Thrasher's series and the name is theirs. No Thrasher artwork or fonts are used — the layout is
set in [Jost](https://fonts.google.com/specimen/Jost), an open font.

* **Videos** are embedded from YouTube and belong to their owners.
* **Portraits** are freely licensed images from Wikimedia Commons and Openverse. Every one is
  credited with its photographer and licence in [PHOTO-CREDITS.md](PHOTO-CREDITS.md) and on the
  skater's own page. Some carry NonCommercial or NoDerivatives terms, so check that file before
  reusing anything here.
* **Map tiles** © Esri. Terrain from the AWS Terrain Tiles public dataset. Building footprints from
  OpenFreeMap and OpenStreetMap contributors.

Facts in the data are sourced, and where sources disagreed the field was left blank rather than
guessed. Corrections are welcome — open an issue.
