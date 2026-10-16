# Pinbound mark and icon exports

The logo combines a flagstick, gold flag, ivory curved bowl, golf ball and gold shot trajectory on evergreen. Revision 2 extends the stem below the bowl to clarify the capital P, following the user's feedback. No text is baked into the icon.

## Files

- Master: `public/branding/pinbound-logo-v2.png`.
- Profile avatars: `public/branding/pinbound-avatar-{1024,512,256,128}.png`.
- iPhone Home Screen icon: `public/apple-touch-icon.png` (180 × 180).
- iPad sizes: `public/icons/apple-touch-icon-{167,152}.png`.
- Web app icons: `public/icons/icon-{192,512}.png`.
- Browser icons: `public/icons/favicon-{32,16}.png`.
- Web manifest: `public/site.webmanifest`.

Use the 1024-pixel avatar for profile uploads. The supplied files retain square backgrounds; platforms apply their own circle or rounded-square masks. No profile pictures were changed on external accounts.

## Integration when the app shell exists

Paths below are relative to the application base. Preserve project-subpath deployment support when integrating with the build tool.

```html
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="167x167" href="icons/apple-touch-icon-167.png">
<link rel="apple-touch-icon" sizes="152x152" href="icons/apple-touch-icon-152.png">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16.png">
<link rel="manifest" href="site.webmanifest">
<meta name="apple-mobile-web-app-title" content="Pinbound">
<meta name="theme-color" content="#003d28">
```

Apple documents PNG Home Screen icons and explicit iPhone/iPad sizes in its [Safari web-app configuration guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html). These are web app icons, not an App Store submission package. Icon files alone do not implement or deploy the game.

## Generation and reproduction

Artwork was generated with the built-in image-generation tool, then resized deterministically with Windows System.Drawing. No CLI image-generation API was used. Regenerate PNG exports with:

```powershell
./tools/export-icons.ps1 -SourcePath ./public/branding/pinbound-logo-v2.png
```

Initial prompt direction: a premium geometric Pinbound golf emblem forming a P from a flagstick and waving flag, with ball and curved trajectory, evergreen/ivory/gold, no words or border, square opaque background and generous profile-crop margins.

Exact revision prompt:

> Edit this existing Pinbound logo. Preserve its evergreen background, warm ivory and gold colors, flag, ball, sweeping trajectory, flat premium sporting style, and overall visual identity. Make one targeted structural correction: extend the ivory vertical flagstick/stem DOWN farther below the curved bowl, creating a clearly visible straight descender and lower base, so the emblem unmistakably reads as a capital P rather than a D. The curved bowl should connect to the stem distinctly above its bottom; a substantial length of stem should remain visible below that join. Keep the lower base restrained and elegant. Scale and recenter the complete adjusted mark if needed so all elements remain comfortably within a circular profile-picture crop, with generous outer breathing room on the square. Do not lengthen the curved bowl down with the stem. No added text, no extra elements, no border or rounded corners. Single final square opaque logo.

Every exported PNG dimension was checked after saving. Final crop and Home Screen appearance should also be verified on a physical iPhone during app testing.
