# Pinbound design brief

## Confirmed scope

Launch with eight permanent courses containing 117 holes. Draw inspiration from the following golf destinations, using original names and layouts rather than claiming an official relationship or reproducing real course routings.

| Location | Holes | Inspiration |
| --- | ---: | --- |
| Pine Valley, New Jersey | 18 | Pine Valley Golf Club |
| Augusta, Georgia | 18 | Augusta National Golf Club |
| Pebble Beach, California | 18 | Cypress Point Club |
| Southampton, New York | 18 | Shinnecock Hills Golf Club |
| Oakmont, Pennsylvania | 18 | Oakmont Country Club |
| Juno Beach, Florida | 9 | Seminole Golf Club |
| Frankfort, Michigan | 9 | Crystal Downs Country Club |
| Dublin, Ohio | 9 | Muirfield Village Golf Club |

Courses should have varying difficulty and recognizable landscape identities. Exact ratings, pars and hole layouts remain to be designed.

## Course play

Players choose a permanent course and complete its holes. Each course has a ten-place arcade leaderboard with three-letter initials and final score. Show total strokes and score relative to par: for example, 68 strokes / −4. Rank by fewest strokes. Local versus shared online storage and tie handling remain undecided.

## Season play

A persistent player profile competes against 23 fictional professionals in eight single-round events, ending at Pine Barrens. The top 12 qualify for that championship. The implemented defaults and scoring rules are recorded in [FULL-GAME.md](FULL-GAME.md). Avatar customization remains deferred.

## Daily play

Generate nine holes from a canonical date seed. The same seed and version reproduce the same course. The independent procedural generator uses a shuffled par mix and date-seeded geometry, wind and setting. Rollover is 00:00 UTC. Each local player has one saved daily card, then unlimited practice; no shared online daily leaderboard is connected.

## Practice

Allow practice on any permanent hole or a newly generated hole. Generate random practice holes on demand with a fresh seed; retain the seed for exact replay. Practice does not affect competitive records. Optional assists, condition controls and seed sharing are design candidates rather than confirmed requirements.

## Presentation and assets

Provide menu music and gameplay sound effects with separate volume controls. Plan original procedural terrain/scenery and original branding. Hero art, distinctive scenery and eventual avatar assets may need custom illustrations. No license to reuse Daily Holes artwork or source has been obtained; keep competitor research downloads and reconstructed layouts outside this repository.

## Implemented defaults and remaining scope

- Implemented for the first prototype: oscillating aim-lock, timed power, nine clubs and automatic putting rings. The user's direction is to preserve Daily Holes' mechanics closely while changing the course and mode structure.
- Course difficulty comes from geometry, wind and green/ring parameters; all modes retain one shot engine.
- Water/OB penalties, ten-stroke minimum caps, local arcade ties and save/resume are implemented.
- Browser-local profiles, rounds, records, careers and backup export/import are implemented. Accounts, cloud sync and shared online rankings remain future work.
- A 24-player field, eight events and top-12 championship qualification are implemented.
- Daily rollover uses UTC; content and saved rounds have explicit version identities.

## Implementation sequence

1. Original playable hole, camera, controls, shot feedback and scoring.
2. Pure deterministic engine with replayable inputs and explicit versions.
3. Course-authoring tools and original hole/terrain data.
4. Permanent course collection, course play, save/resume and arcade records.
5. Procedural daily and practice generation with quality constraints.
6. Season profiles, simulated opponents, standings and championship.
7. Online verification and shared competition if selected; audio and visual polish throughout.

The prototype uses dependency-free JavaScript ES modules and Canvas 2D, with a pure shared engine and separate renderer, sound and browser state modules. A migration to TypeScript can follow as the course-authoring schema grows. Hosting and backend selection remain open.
