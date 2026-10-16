# Audio direction

The user supplied five MP3 files for Pinbound. Originals were copied without modification and renamed for stable application paths. Source filenames below record provenance; no third-party license or ownership claim is inferred from the files.

| Asset | Original filename | Trigger |
| --- | --- | --- |
| `public/audio/main-menu.mp3` | `05. Main Menu 5.mp3` | Most menus until gameplay begins |
| `public/audio/scorecard.mp3` | `18. Scorecard 1.mp3` | Final score review |
| `public/audio/swing-swish.mp3` | `SFX Swish quick 1.mp3` | Shot swing, adapted for driver, wedge/chip, putt, etc. |
| `public/audio/trophy.mp3` | `SFX TrophySummarize.mp3` | Leaderboard entry and season championship win |
| `public/audio/ball-cup.mp3` | `SFX BallHole.mp3` | Ball is cupped |

## Playback implementation

- Unlock audio after a player gesture; loading the page must not assume autoplay permission.
- Use separate music and effects volume/mute controls and persist preferences.
- Crossfade between menu and scorecard music; fade music out when play begins. Avoid overlapping music tracks.
- Menu and scorecard looping are provisional defaults. Audition loop points before shipping; MP3 padding can prevent seamless playback.
- Decode short effects into reusable audio buffers. Trigger cup audio at the visible cup event and trophy audio once per qualifying achievement.
- Vary swing gain, playback rate and envelope by club and shot strength. Audition the supplied short swish first: slowing a short clip does not necessarily produce a convincing full driver swing. Add original club-specific effects if needed, especially a separate putter impact.
- Avoid abrupt music restarts on every menu navigation. Stop or suspend appropriate audio when the app is hidden.
- Resolve asset URLs relative to the app deployment base so GitHub project-path hosting works.

The current player uses HTML audio for the supplied tracks and effects. Music switching stops the previous track; crossfading and reusable decoded effect buffers above remain future polish. Copies were verified against the originals using SHA-256.

## Course ambience

Gameplay now has a separate, saved Course ambience volume control. Original synthesized filtered noise provides a soft breeze, with sparse two-note bird calls. This is temporary sound design pending supplied recordings. It fades out in menus and score review, follows mute, and suspends in hidden tabs. No extra audio files are required for this provisional layer.

Suggested recordings, in priority order:

1. Seamless gentle wind/leaf bed, 45–90 seconds, no voices or music.
2. Quiet surf bed for Pacific Cypress and Atlantic Dunes, 45–90 seconds.
3. Three to six isolated birds or distant gull calls, 1–4 seconds each.
4. Soft insects for garden/woodland holes, 30–60 seconds, without a harsh continuous whine.
5. Ball contact on turf, sand impact, water splash and cart-path bounce.
6. A brief soft portal shimmer, gentle draft whoosh and subtle lava bubbling.

Keep animals and feature cues sparse; avoid a constant chorus. Supply ambience and individual effects separately so they can use independent levels and triggers. The current synthesized bed can then be replaced by biome-specific recordings.
