# Pinbound 1.0 — playable local game

## Eight destinations, 117 permanent holes

| Course | Location | Holes | Par | Difficulty |
| --- | --- | ---: | ---: | --- |
| Pine Barrens | Pine Valley, NJ | 18 | 72 | Championship |
| Magnolia Grove | Augusta, GA | 18 | 72 | Strategic |
| Pacific Cypress | Pebble Beach, CA | 18 | 72 | Championship |
| Windward Heath | Southampton, NY | 18 | 72 | Demanding |
| Iron Ridge | Oakmont, PA | 18 | 72 | Expert |
| Atlantic Dunes | Juno Beach, FL | 9 | 36 | Welcoming |
| Crystal Bluff | Frankfort, MI | 9 | 36 | Strategic |
| Scioto Gardens | Dublin, OH | 9 | 36 | Welcoming |

Each hole has an authored name, par, length and routing brief, with stable seeded detailing for hazards, pins and wind. These are original, permanent parameterized layouts, not real-world club replicas or competitor exports. Content is versioned as `courses-1`. Course art is procedural: forest, garden, coastal, heath, parkland, dunes, bluffs and woodland palettes have different canopy density and decorative treatments. Course difficulty changes corridor widths, green size, slope/ring tightness and wind, while retaining one common shot engine.

## Course play

Play all 9 or 18 holes, review each hole, then advance to the next tee. The scorecard shows strokes and relative-to-par values. Complete the whole course to enter three initials on its separate ten-place board. Fewest strokes wins, with earlier entries winning exact ties. Practice and season cards do not enter course boards. Entries are browser-local, not server-verified.

## Seasons

Each player owns a persistent season against 23 named fictional pros. Events are single-round tournaments, in this order: Atlantic Dunes, Crystal Bluff, Scioto Gardens, Magnolia Grove, Pacific Cypress, Windward Heath, Iron Ridge, Pine Barrens.

Regular events award 110 points to first, decreasing by five per place to a floor of five. Equal totals share place and receive the same points. After seven events, the top 12 by points qualify for the Pine Barrens Championship. Qualification ties use cumulative regular-event strokes, then player name. Lowest championship score wins; exact low-score ties share the championship. Season points decide qualification, not the final winner. Players who miss qualification can resolve the simulated final and then begin another season.

Pros have stable skill tiers and seeded, course-difficulty-aware scoring. Their cards are simulations, not physics replays or live online players. Eagle probabilities are rare and depend on par. Completed events are applied once, and reloading the result does not grant points again. A new season can start after the current one finishes. Profile identity persists across campaigns; historical personal round totals remain in profile stats.

## Daily nine

Nine holes are deterministically generated from a UTC date, with believable shuffled par mixes and a shared setting. Rollover is 00:00 UTC. All players using the same date and generator get the same layout and wind. Each local profile has one daily card; unfinished cards resume and finished cards reopen as results. Replaying a finished daily uses unranked practice. Different profiles have separate saves and daily results. Daily play has no shared online ranking in this release.

## Practice

Select any course and any of its 117 holes, or enter a seed to generate a random single hole. Blank seed creates a new one. Replay uses exactly the same layout and shot stream. Daily practice replays that day's nine holes after the card is in. Practice does not alter course records, competitive round stats or season standings.

## Profiles and saves

Profiles have a name and three-letter initials; no avatar editor yet. Course, season, daily and practice saves are separated by profile. Shots save at strike time and reconstruct from deterministic inputs. Between-hole review, completed round results, records and event progress survive reload. Export a JSON backup from the profile page; import validates and merges profiles, boards and saves without deleting current data. A matching active save wins merge conflicts; a more advanced matching season can be restored.

Browser storage is the persistence boundary. Clearing browser data or changing origin/device loses local progress unless exported. The localhost preview and the hosted site have separate storage. No production account service, shared leaderboard, anti-cheat authority or cloud sync is claimed.

## Audio and controls

The supplied menu and scorecard tracks, swing swish, cup sound and trophy cue are wired to their respective events. Music/effects have separate volume controls and a shared mute. Browser autoplay requires a player gesture. Audio pauses in the background. Existing icons are preserved while logo design is paused.

Click/tap to aim; lock the oscillating line; time the power meter. Choose among nine clubs. Full-shot pure contact remains 0.945–1.0 on the 1.15 meter; approach bands target pin distance. Wind, lie modifiers, rollout, water/OB, stroke caps and automatic one/two/three-putt rings use the prototype engine. Slow chip-ins can finish with zero putts, including the verified two-stroke opening-hole fixture. Keyboard, pan, pinch, wheel zoom and fit controls remain available.

## Validation

`npm test` currently passes 28 tests, including all 117 complete cap-score proof replays, normal approach scoring, a zero-putt eagle, full season win/loss paths, seeded AI, profile isolation, backup merge/resume, all practice selections and daily date/par rules. `npm run build` creates a static site. CI runs those checks. The game is published at https://pinbound.github.io/PinBoundGolf/ through the manually triggered Publish Pinbound workflow; run it after pushing changes to update the live game.

Browser QA used a separate localhost:4181 origin with explicitly generated fixture saves, leaving the normal preview's records untouched. Checks covered final-hole resume, full-course initials posting and reload persistence, event advancement/standings and persistence, daily completion/reopen/practice, arbitrary hole selection, coastal/dune art and 390 × 844 layout. A physical iPhone and human listening tests remain useful for final input/audio tuning. These checks establish functional flows, not that every hole has received a human playtest or competitive balance pass.

## Source map

- `src/engine.mjs`: pure shot and scoring model.
- `src/courses.mjs`: fixed course briefs, stable detailing, practice and daily generation.
- `src/competition.mjs`: rounds, records, seasons, qualification and simulated opponents.
- `src/storage.mjs`: versioned save reconstruction and backup validation/merge.
- `src/main.mjs`: browser flow, inputs, persistence and event presentation.
- `src/render.mjs`: original map scenery, camera, aim and ball animation.
- `src/audio.mjs`: supplied audio and playback preferences.

The earlier prototype documents are historical snapshots. This guide describes the full local release.
