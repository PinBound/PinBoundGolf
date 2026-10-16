# Prototype verification — October 16, 2026

- `npm test`: 13 passing Node engine tests, including a slow ball crossing the cup between rollout samples, rejection of fast/wide crossings, and an authored-hole two-stroke / zero-putt completion.
- Generation fixtures check 100 seeds for repeatability and valid tee/pin surfaces.
- Shot fixtures cover all nine clubs, several powers, finite coordinates, deterministic results, water, OB, power inversion, slope-scaled putt rings, stroke caps, proof replay and invalid inputs.
- `npm run build`: static output generated successfully in `dist/`.
- Browser: clubhouse start, oscillating aim, aim-lock, swing power, animated shot, OB penalty settlement, save/resume, normal green finish with three automatic putts, scorecard, invalid initials validation and replay were exercised.
- Browser: random practice generated a hole and exposed its stable seed. No browser warning/error logs were observed in the inspected runs.
- Mobile: inspected the game and scorecard at a 390 × 844 viewport; all nine clubs, power meter, shot button and clubhouse navigation were visible. Temporary viewport override was reset afterward.

The two-stroke hole-out was verified through the pure engine and replay fixture, not achieved manually through the timed browser controls. Initials posting and long-term persistence are implemented but were not exhaustively exercised in browser automation. Audio files are connected; audible quality, loop seams and device-specific playback need human listening. Touch gestures were implemented and responsive layout inspected, but a physical iPhone has not been tested. No production server, shared leaderboard or complete course/season exists yet.
