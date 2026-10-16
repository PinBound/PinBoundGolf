# First playable: Pine Barrens / The Needle

## Implemented

An original 412-yard par 4 inspired by New Jersey pinelands, with bent fairway, sand hazards, one water hazard, a sloped green and automatic putt rings. The terrain and course art are original procedural Canvas drawing. No competitor source, exported course geometry, branding or artwork is included.

The mechanics follow the researched timing-golf model: nine club carry/roll numbers, club-dependent oscillating aim, aim-lock then triangle-wave power timing, pure band at 0.945–1.0 on a 1.15 meter, overswing dispersion, wind, lie penalties, budget-based rollout, pace-sensitive greens and automatic one/two/three putts. The PIN band shifts for approach distance. Water and OB cost one stroke; OB restores the previous ball. Bunker club selection is restricted; the hole caps at ten strokes.

This is a new implementation calibrated to observed parameters, not a promise of bit-identical outcomes. The RNG and scenery are independent. Advanced portal/arm/gust/animal/crossing systems are outside this first-hole prototype. Green slope currently affects putting-ring size, not a physical slope simulation.

Additional features: random practice hole generation, deterministic proof replay, strike-time save/resume, a device-local ten-position initials leaderboard for the fixed opening hole, camera pan/zoom/fit, keyboard/touch controls, sound settings, supplied menu/scorecard/swing/cup/trophy tracks and synthesized terrain contacts.

## Code map

- `src/engine.mjs`: course geometry, random streams, shot resolution, scoring and proof replay; no browser imports.
- `src/render.mjs`: original forest/terrain scenery, cached map, camera, aim, flight and putting presentation.
- `src/main.mjs`: game phase transitions, inputs, storage, dialogs, records and animation clock.
- `src/audio.mjs`: music/effects handling and volume preferences.
- `tests/engine.test.mjs`: repeatability, physics/scoring boundaries, invalid inputs and complete-round fixtures.

## Scope of release

One playable authored hole, not the complete 18-hole Pine Barrens course. Random practice makes single holes. Daily nine, eight complete courses, profiles, opponents and seasons remain future work. Records and saves are local to a browser. No login, paid features or remote game backend is connected.

The existing app icons are preserved while logo work is paused. The rejected PB concept is not referenced by the app.

## Hole-out verification

There is no mandatory minimum putt. A holed shot adds zero automatic putts; a ball merely finishing inside the gold ring adds one. Cup capture sweeps each rollout segment and requires low residual pace, preventing both skipped cups between simulation steps and high-speed hole-outs.

An explicit deterministic fixture completes The Needle in two strokes: driver at aim −0.034133 radians / power 1.0, then pitching wedge at aim −0.149995 / power 0.8395. The approach lands short, rolls into the cup, returns `holed: true`, and scores two with zero putts. This is engine verification, not a claim that a human timed those exact controls. `node tools/find-eagle.mjs` reproduces the offline diagnostic search.

## Next milestone

Playtest timing, rollout and touch ergonomics. Then formalize a hole-authoring schema/editor and assemble the first complete course. Expand modes after the common round state and content tools are stable. Preserve versioned generator/physics identities as ranked play is introduced.
