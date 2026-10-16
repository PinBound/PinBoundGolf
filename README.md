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

Design and repository preparation. No playable application or build commands exist yet.

The first implementation milestone is one polished playable hole and the core shot/scoring loop. The course-authoring system and full collection follow after those mechanics are established.

See [docs/DESIGN.md](docs/DESIGN.md) for confirmed requirements and open design decisions.

Five supplied music/effect files are included under `public/audio/`. See [the audio plan](docs/AUDIO.md) and [event manifest](public/audio/manifest.json) for intended usage.
