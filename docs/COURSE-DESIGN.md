# Course and obstacle redesign

The current layout version is `courses-2`. The club-inspired courses retain original Pinbound names and original routings. Their par sequences follow the reference scorecards rather than making every full course par 72. The short courses follow the reference front nine. Yardages are game yardages measured along each routing, not a reproduction of tournament tees.

| Pinbound course | Reference | Total par | Par 3 / 4 / 5 counts |
| --- | --- | ---: | --- |
| Pine Barrens | Pine Valley | 70 | 4 / 12 / 2 |
| Magnolia Grove | Augusta National | 72 | 4 / 10 / 4 |
| Pacific Cypress | Cypress Point | 72 | 4 / 10 / 4 |
| Windward Heath | Shinnecock Hills | 70 | 4 / 12 / 2 |
| Iron Ridge | Oakmont members' card | 71 | 4 / 11 / 3 |
| Atlantic Dunes | Seminole front nine | 36 | 2 / 5 / 2 |
| Crystal Bluff | Crystal Downs front nine | 35 | 2 / 6 / 1 |
| Scioto Gardens | Muirfield Village front nine | 36 | 2 / 5 / 2 |

The Daily Nine guarantees two par-5s, two par-3s and five par-4s (par 36), shuffled deterministically by date. Previously one mix contained only one par-5. Random practice remains seeded, with all three pars available.

## Routing and hazards

Nine routing families replace the repeated mild-dogleg template: pronounced left/right doglegs, double doglegs, sweeping curves, S-curves, cape holes, split fairways around a rough island, creek crossings, and island greens. Smooth centerlines are rescaled so their measured length matches the displayed yardage. The water placement on cape, crossing and island holes creates different carry-versus-layup choices. A playable fairway is still available on both sides of a split.

Cart paths sample a consistent offset along the rough edge. The entire path and intermediate samples are checked to remain outside the rough-width corridor; they no longer intentionally cross from one side of the fairway to the other. They retain their fast-roll physics.

Drafts form a 38-yard-deep rectangular band across the whole playable corridor, extending beyond its edges. Any airborne shot crossing that band receives a seeded 28–38-yard lateral displacement. Arrows, animated flow, the direction label and physics all use the same left/right direction. A player must compensate or lay up and compensate on the subsequent crossing; flying over the band does not avoid it. The older elliptical draft animation also now moves in its indicated direction. No draft sound is added.

Water, lava and bunkers use original smooth, lobed polygons. Drawing and collision detection consume the exact same polygon vertices. Island water is drawn beneath the green, whose safe circular surface retains priority. New vector squirrel, gator and gull illustrations have recognizable silhouettes, shading and details, rendered at a readable minimum size. No third-party animal art is used.

## Saves and validation

Existing classic and `hazards-1` course saves still replay their original geometry and shot rules. Course selection offers Play redesigned course alongside an unfinished previous-layout round. New rounds/practice and new seasons use the redesign. Existing seasons keep their original pars and AI scoring; new season AI and player cards both use the revised pars.

The redesigned Daily Nine has its own dated save slot, so today's previous card cannot hide the new layout or be overwritten. Redesigned course leaderboards have separate keys and retain their correct course par through export/import. Older boards remain intact.

Tests cover all 117 updated holes, exact par sequences, every daily mixture over a month, cart-path edge clearance, full draft coverage and displacement, polygon collision parity, completion/reimport of every redesigned round, and a full new season through the par-70 championship. Browser review covers phone layouts, squirrel/gator art, edge paths, organic lava, varied routing and draft visuals. The provided MP4 and screenshots were reviewed. Every hole has not been manually play-balanced.

## Scorecard references

Checked 2026-10-17. Club/member pars are used rather than silently substituting championship conversions (notably Oakmont's par-70 U.S. Open setup).

- [Pine Valley scorecard](https://www.allgolfholes.com/courses/new-jersey/pine-valley-golf-club)
- [Augusta National course](https://www.masters.com/en_US/course/index.html) and [Masters hole guide](https://www.pgatour.com/article/news/latest/2026/04/02/the-masters-2026-augusta-national-hole-by-hole-look-golf-course)
- [Cypress Point scorecard](https://en.wikipedia.org/wiki/Cypress_Point_Club#Scorecard)
- [Shinnecock Hills hole/par listing](https://www.golfmonthly.com/news/shinnecock-hills-hole-names-from-ben-nevis-to-redan-and-thoms-elbow)
- [Oakmont club and U.S. Open scorecards](https://en.wikipedia.org/wiki/Oakmont_Country_Club#Oakmont_scorecard)
- [Seminole scorecard](https://www.allgolfholes.com/courses/florida/seminole-golf-club)
- [Crystal Downs scorecard](https://www.golfify.io/courses/crystal-downs-country-club)
- [Muirfield Village / Memorial Tournament course overview](https://www.thememorialtournament.com/patrons/course-overview/)
