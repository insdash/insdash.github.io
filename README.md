# insdash

**A design and development studio in Zürich.** We take a project from the first
conversation to the thing running in production — and when a design job turns
out to need software, we are the ones who build the software.

This repository is the source of our website, **[insdash.ch](https://insdash.ch)**.

[Work](https://insdash.ch/projects) · [Services](https://insdash.ch/services) · [About](https://insdash.ch/about) · [Get in touch](mailto:insdash.io@gmail.com)

## Who we are

insdash is a small studio. We build for the companies that fall through the gap in
this market — too specific for off-the-shelf software, too small to be
interesting to an agency, and too important to hand to somebody who will not be
reachable next year.

Most design studios stop at the handover. Most development shops need a spec
before they start. We do both halves, so a project can change shape partway
through without changing supplier.

## What we do

- **Design** — research, information architecture and interface design, handed
  over in a file your team can actually maintain.
- **Build** — we build and ship it. You get the repository and a working
  deployment, not a prototype.
- **Design → build** — it starts as design. If the problem turns out to need
  software, we scope that and build it too, rather than handing you a spec to
  take elsewhere.
- **Maintenance** — we keep it running, and take on new features as they come
  up.

Every engagement starts with a scoping conversation and a written estimate.
**If buying beats building, we will tell you.**

## Selected work

- **[Sprachschule Yang](https://insdash.ch/projects/sprachschule-yang)** — a
  Zürich language school was paying a growing subscription to schedule six rooms
  and its teachers. We scoped and delivered a replacement they own outright, and
  we still ship the features they ask for.
- **[A Fatt](https://insdash.ch/projects/afatt)** — a modular, multilingual menu
  system for a Zürich restaurant: dishes, translations and dietary labels the
  team maintains themselves, without redrawing a layout. They still use it.
- **[menuGen](https://insdash.ch/projects/menugen)** — menu data in, print-ready
  PDF out. A web app we built on our own, because no product did the job.

## How this site is built

We hold our own site to the standard we work to for clients.

- **Static and fast.** [Astro](https://astro.build/) renders every page to plain
  HTML at build time, styled with [Tailwind CSS](https://tailwindcss.com/).
  Images are converted and resized during the build.
- **Accessible in both themes.** Every page is audited against WCAG 2.1 A/AA,
  once in the light theme and once in the dark, because a colour can pass in one
  and fail in the other.
- **Private by default.** Analytics stay switched off until a visitor allows
  them, and the [privacy policy](https://insdash.ch/privacy) says exactly what
  is collected either way.
- **Words as content.** Every page's copy lives in Markdown rather than in
  components, and the structured data search engines read is built from that
  same content, so the two cannot drift apart.

## Run it locally

Requires Node 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run build`   | Build the static site into `dist/`        |
| `npm run preview` | Serve that build locally                  |
| `npm run a11y`    | Build, then run the accessibility audit   |

Pushing to `main` deploys to GitHub Pages.

## Work with us

If your problem is too specific for off-the-shelf software, tell us about it. A
rough sketch and a deadline is enough to start.

**[insdash.io@gmail.com](mailto:insdash.io@gmail.com)** · [LinkedIn](https://www.linkedin.com/company/insdash)

## Author

Created by [insdash](https://github.com/insdash/) & [Ying-Shiuan Chen](https://github.com/yingshiuan/)

## License

The code is released under the [MIT License](LICENSE). The site's content is
not: the text and images, the insdash name and logo, and the client work shown
in the case studies are not licensed for reuse. [LICENSE](LICENSE) says exactly
what each covers.
