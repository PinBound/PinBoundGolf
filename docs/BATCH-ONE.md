# First gameplay and presentation fixes

New rounds use explicit `hazards-1` rules, layered on the original seeded terrain with a separate random stream. Every permanent course and generated daily nine includes all five requested obstacle families. Random practice chooses its primary feature deterministically from its seed; selected-hole practice matches the permanent hole's features.

| Feature | Effect |
| --- | --- |
| Wildlife | A resting/rolling ball within the marked capture circle is carried to the marked den, ending rollout without a penalty. Squirrels, gulls and gators follow the course environment. |
| Lava | Landing or rolling into the pool adds one penalty stroke and drops onto safe ground. |
| Cart path | Fast surface with tangent steering, rollout multiplier 3.0; next-shot distance 0.92 and error 1.55. |
| Wind draft | Flight crossing its elliptical zone receives the zone's seeded directional push. |
| Portal | Contact transports the ball to the marked exit without a penalty. Each feature can trigger once per shot. |

Markers, entry/exit links, animal dens and a short feature guide explain the active obstacles. These are original implementations of the requested mechanics, rather than a complete reproduction of every Daily Holes feature. Mill arms, kick boulders and other unrequested variants are not in this update. The course themes remain geographically inspired; lava and portals are arcade features.

The camera smoothly closes in after a resolved shot finishes within 35 yards of the pin, before automatic putting. It also restores the close-up when resuming a nearby ball or resizing. Pan/zoom cancels camera movement; Whole hole restores the overview. Reduced motion uses an immediate camera change.

Classic saved rounds retain their old geometry, resolution and rules. Course selection offers a New obstacle round button for an unfinished classic course. A completed classic daily card remains protected; daily practice can use the updated obstacles. Classic and obstacle leaderboards are stored separately, including in backup exports/imports.

The clubhouse has original vector landscape art, four mode icons, course postcards, brass details and more dimensional buttons. Source art can be regenerated with `node tools/generate-art.mjs`. The rejected logo concept remains excluded.

Sound has an independent ambience bus with a provisional synthesized breeze and occasional bird calls. See AUDIO.md for the recording brief. All-audio mute and hidden-tab suspension apply to ambience as well as music/effects.

Validation: 38 Node tests, including individual obstacle outcomes, air-zone intersection, landing/rollout lava penalties, deterministic proofs, all 117 obstacle-hole completions, classic-save compatibility, leaderboard backup preservation, and the 35-yard camera boundary. Browser QA covers desktop and 390 × 844 layouts, loaded vector assets, active obstacle markers, a short approach finishing 16 yards from the pin and its automatic close-up. No browser console errors were observed. Holes have not all been manually balanced.
