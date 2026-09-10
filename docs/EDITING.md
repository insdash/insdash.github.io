# Editing insdash.ch

How to change the words on the site, add or remove a case study, and check the
site before it goes live.

## Where things live

Most page copy lives in content collections, so rewording a page means editing
Markdown rather than a component. The exceptions are the intros written into
the page files themselves — see [Page intros](#page-intros).

| What                                                        | Where                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| `/services` copy, plus the homepage blurb and service tags   | `src/content/services/services.md` (frontmatter)       |
| `/about` copy: the intro in frontmatter, sections in the body | `src/content/about/about.md`                         |
| Privacy policy                                              | `src/content/legal/privacy.md`                         |
| Case studies                                                | `src/content/projects/<slug>/index.md`                 |
| Homepage headline, `/projects` intro, the 404 page          | `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/404.astro` |
| The schema every collection is checked against              | `src/content.config.ts`                                |
| Email, location, social links, analytics ID                 | `src/ts/site.ts`                                       |
| Structured data (JSON-LD)                                   | `src/ts/aeo.ts` and `src/components/layout/AEO.astro`  |
| Routes                                                      | `src/pages/`                                           |

When the privacy policy changes in substance, change its `updated` date too. It
is shown under the heading.

### Page intros

The homepage and `/projects` open with `src/components/layout/Intro.astro`. Each
page passes its own copy:

```astro
<Intro
  eyebrow="Work"
  heading="Things we designed, and things we built."
  lead="Every project here started as a client problem…"
/>
```

The homepage also passes `display` for its larger headline, `tags` and
`tagsHeading` for the service list it reads from `services.md`, and `location`
for the "Based in Zürich" line. Leave `display` off anywhere else: it switches
the h1 from the standard size to the hero size.

### Copy that is repeated elsewhere

`src/ts/aeo.ts` restates some page copy as constants, so search engines read the
same claims a visitor does. When that copy changes, update the matching constant
by hand:

| If you change                        | Also update in `aeo.ts` |
| ------------------------------------ | ----------------------- |
| The capability list in `services.md` | `KNOWS_ABOUT`           |
| The opening of `/about`              | `STUDIO_DESCRIPTION`    |
| The Practicalities line on `/about`  | `AREA_SERVED`           |

The services catalogue in the structured data is built from `services.md`, so it
needs no manual edit.

The `description` in `src/pages/projects/index.astro` names the kinds of work
on the site ("menu systems, scheduling software and a print-ready menu
generator"). Keep it in step when a case study is added or removed.

## Adding a case study

1. Create `src/content/projects/<slug>/index.md`. It is served at
   `/projects/<slug>`. The frontmatter is validated against
   `src/content.config.ts`, so a missing required field fails the build.
2. Put images next to `index.md` and reference them relatively (`./day.png`),
   both in the frontmatter (`image`, `hoverImage`, `thumbnail`) and in the body.
   Astro converts and resizes them at build — a 1.2MB PNG screenshot ships as a
   ~130KB WebP — so commit the source file rather than a hand-converted copy.
3. Video cannot go through Astro's image pipeline. Put it in
   `public/media/projects/<slug>/` and reference it with an absolute path
   (`/media/projects/<slug>/clip.mp4`).
4. An animated `hoverImage` ships at its source size. Shrink it with
   `node scripts/compress-hover.mjs <in.webp> <out.webp>`, which needs
   `img2webp` (`brew install webp`).
5. **Commit only the media the page references.** Raw captures and screen
   recordings can sit in the folder while you work; leave them out of commits.

### Where it appears

Project cards are ordered with `featured: true` first, then by `created`, newest
first; a project without `created` goes to the end of its group. The homepage
shows the first three, with a button that reveals three more at a time.
`/projects` shows every project.

## Taking a project off the site

### Off `/services` only

Every problem on `/services` cites a project, listed under `problems` in
`services.md`. To archive one without deleting it, move its entry into the
commented-out **Archived** block below that list. Its case study stays live
under `/projects`. If `/about` uses the project as an example, replace that
example too.

### Off the live site entirely

Delete `src/content/projects/<slug>/`, then search `services.md`, `about.md` and
the other case studies for links to `/projects/<slug>`. Nothing checks internal
links, so a dead one still builds.

To keep the case study on your own computer instead of deleting it, add its
folder to `.git/info/exclude`:

```bash
echo '/src/content/projects/<slug>/' >> .git/info/exclude
```

Git then ignores the folder on this machine only. Don't use `.gitignore` for
this: that file is committed, so the folder's name would become public. If the
folder was already committed, also run
`git rm -r --cached src/content/projects/<slug>` and commit the removal.

Local builds and the local accessibility audit will still include the page. The
live site, built from the repository, will not.

## Before you push

```bash
npx eslint .                          # lint; add --fix for the safe fixes
npm run a11y                          # build, then audit every page
```

The accessibility audit serves `dist/` and runs axe against every route twice —
light theme and dark — and exits non-zero on any WCAG 2.1 A/AA violation. The
report is written to `a11y-report/` (gitignored). To audit the existing `dist/`
without rebuilding, run the script directly:

```bash
node scripts/a11y.mjs --url /about     # one route
node scripts/a11y.mjs --theme dark     # one theme
node scripts/a11y.mjs --contrast       # list every failing colour pair
node scripts/a11y.mjs --soft           # report, but always exit 0
```

## Deployment

**Pushing to `main` deploys the site.** `.github/workflows/deploy.yml` builds it
with `withastro/action` and publishes it to GitHub Pages; it can also be run by
hand from the Actions tab. The custom domain, with HTTPS enforced, is set in the
repository's Pages settings.

No other branch is deployed. Work on a branch reaches insdash.ch only once it is
merged into `main`.

The same workflow runs the accessibility audit alongside the build. It never
holds up a deploy: a failure shows as a failed job, with the report in the job
summary and attached as an `a11y-report` artifact.
