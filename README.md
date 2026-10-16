# Pinbound

A browser golf game featuring eight original courses, arcade leaderboards, a competitive season ending in a championship, daily generated rounds, and unlimited practice.

## Planned course collection

117 permanent holes across five 18-hole courses and three 9-hole courses. Locations and design inspirations are recorded in [the design brief](docs/DESIGN.md). Course names, artwork and hole layouts will be original.

## Modes

- **Course play:** select a course, complete a round, and enter three initials on its ten-place arcade leaderboard.
- **Season play:** maintain a player profile and compete against fictional professionals through tournaments leading to a championship at the Pine Valley course.
- **Daily play:** nine procedurally generated holes determined by a shared date seed.
- **Practice:** choose any permanent course hole or generate a fresh seeded hole.

Scores show both total strokes and relative-to-par score; fewer strokes ranks higher.

## Project status

The first playable prototype is implemented: one original Pine Barrens opening hole, seeded random single-hole practice, nine clubs, oscillating aim-lock, timed power, wind, lie effects, rollout, penalties, automatic putting, save/resume, supplied audio and a local ten-place opening-hole leaderboard. The full eight-course collection and season/daily modes are planned, not yet implemented.

## Run and verify

Node.js 22 or newer is required. There are no runtime or package-install dependencies.

```sh
npm run dev
npm test
npm run build
```

The development server prints `http://127.0.0.1:4180`. The static production output is `dist/`. Serve that directory with any static host; files use relative paths for project-subpath hosting. GitHub Actions checks tests and builds on pushes and pull requests. Deployment is not configured yet.

## Controls

Tap/click the map to choose an aim center. Lock the oscillating line, then stop the power meter. Space/Enter activates the shot control; arrow keys adjust aim when the course has focus; 1–9 select clubs. Drag to pan; pinch/wheel to zoom; Whole hole resets the view. Automatic putting adds one, two or three strokes according to finishing ring. Gameplay stops menu music; final review uses the supplied scorecard track.

Shots are saved at strike time and restored by replaying inputs. Local records use three-letter initials; these are device-local and are not server-verified competitive scores. Browser storage/audio failures do not block play. The game requires a server for ES modules; opening `index.html` directly is unsupported.

See [docs/DESIGN.md](docs/DESIGN.md) for confirmed requirements and open design decisions.

Five supplied music/effect files are included under `public/audio/`. See [the audio plan](docs/AUDIO.md) and [event manifest](public/audio/manifest.json) for intended usage.

Logo avatars, iOS Home Screen icons and web app icons are available under `public/branding/`, `public/icons/` and `public/apple-touch-icon.png`. See [the brand asset guide](docs/BRAND.md) for exports and app-shell integration.
