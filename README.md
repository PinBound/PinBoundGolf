# Pinbound

A browser golf game featuring eight original courses, arcade leaderboards, a competitive season ending in a championship, daily generated rounds, and unlimited practice.

## Course collection

117 permanent holes across five 18-hole courses and three 9-hole courses. Original names and fixed layouts draw inspiration from the requested destinations; these are not reproductions of real club routings. See [the full game guide](docs/FULL-GAME.md).

## Modes

- **Course play:** select a course, complete a round, and enter three initials on its ten-place arcade leaderboard.
- **Season play:** maintain a player profile and compete against fictional professionals through tournaments leading to a championship at the Pine Valley course.
- **Daily play:** nine procedurally generated holes determined by a shared date seed.
- **Practice:** choose any permanent course hole or generate a fresh seeded hole.

Scores show both total strokes and relative-to-par score; fewer strokes ranks higher.

## Project status

All four modes are playable. The game includes eight complete courses with distinct scenery and difficulty, per-course ten-place arcade records, persistent player profiles, an eight-event season against 23 fictional pros, a date-seeded daily nine, and practice on any of the 117 permanent holes or a generated seed. The tested aim-lock, nine clubs, power timing, chip-ins and automatic putting mechanics are preserved.

Profiles, seasons, records and saves live in this browser. Backup export/import is provided. This release has no accounts, cross-device sync or shared online leaderboard; simulated opponents are not live players. Avatar customization is deferred.

## Run and verify

Node.js 22 or newer is required. There are no runtime or package-install dependencies.

```sh
npm run dev
npm test
npm run build
```

Play the published game at **[Pinbound](https://pinbound.github.io/PinBoundGolf/)**.

The development server prints `http://127.0.0.1:4180`. Static production output is `dist/`, with relative paths supporting project-subpath hosting. GitHub Actions runs tests/builds. GitHub Pages publishes through the manually triggered Publish Pinbound workflow; run it after pushing changes to update the live game.

## Controls

Tap/click the map to choose an aim center. Lock the oscillating line, then stop the power meter. Space/Enter activates the shot control; arrow keys adjust aim when the course has focus; 1–9 select clubs. Drag to pan; pinch/wheel to zoom; Whole hole resets the view. Automatic putting adds one, two or three strokes according to finishing ring. Gameplay stops menu music; final review uses the supplied scorecard track.

Shots are saved at strike time and restored by replaying inputs. Local records use three-letter initials; these are device-local and are not server-verified competitive scores. Browser storage/audio failures do not block play. The game requires a server for ES modules; opening `index.html` directly is unsupported.

See [the full game guide](docs/FULL-GAME.md) for the course catalog, season rules and implementation details. [The original design brief](docs/DESIGN.md) records the project scope.

Five supplied music/effect files are included under `public/audio/`. See [the audio plan](docs/AUDIO.md) and [event manifest](public/audio/manifest.json) for intended usage.

Logo avatars, iOS Home Screen icons and web app icons are available under `public/branding/`, `public/icons/` and `public/apple-touch-icon.png`. See [the brand asset guide](docs/BRAND.md) for exports and app-shell integration.
