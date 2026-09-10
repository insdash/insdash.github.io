import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
  }),
  // `image()` resolves paths relative to the markdown file and returns
  // ImageMetadata, so components can hand it straight to <Image />.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      featured: z.boolean(),
      type: z.string(),
      created: z.union([z.string(), z.date()]).optional(),
      domains: z.array(z.string()).optional(),
      stack: z.array(z.string()).optional(),
      category: z.string(),
      tags: z.array(z.string()),
      // Optional: client software is often private, or the client has not
      // cleared screenshots. A case study should be publishable without art.
      image: image().optional(),
      hoverImage: image().optional(),
      // Detail-page hero. Falls back to `image` when omitted.
      thumbnail: image().optional(),
      // The <title> and share title, for a project whose name does not say what
      // the work was: "Room and Class Scheduling" names a feature, not a job for
      // a client. Only the head reads it; the h1, cards and breadcrumb keep
      // `title`. " | insdash | Zürich" is appended, so aim for ~40 characters.
      seoTitle: z.string().optional(),
      // The card blurb and the meta description. Search results cut it off
      // after ~155 characters.
      info: z.string(),
      description: z.string(),
      // Project details. These are named for what a client reads them as, not
      // for a portfolio: a studio has a `scope`, not a `role`, and the party a
      // project was done for is the `client` rather than a `credit`.
      scope: z.string(),
      timeline: z.string(),
      completed: z.string(),
      client: z.string(),
      // The client's site, or wherever the delivered work is public.
      clientLink: z.string().optional(),
      tools: z.array(z.string()),
      // The judgment the engagement turned on. Was carried in every project
      // file but rendered nowhere; MetaCard now shows it.
      focus: z.array(z.string()),
      approach: z.string(),
    }),
});

// Every word on /services lives here, so the page can be reworded without
// touching the component. `homeBlurb` and the service `name`s are also what the
// homepage intro advertises.
const services = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/services',
  }),
  schema: z.object({
    // Head and SEO
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    // Read by the homepage, which passes it to Intro — not by /services itself.
    homeBlurb: z.string(),
    // Page intro
    eyebrow: z.string(),
    heading: z.string(),
    lead: z.string(),
    // "Ways to work with us"
    engagementsHeading: z.string(),
    engagements: z.array(
      z.object({
        name: z.string(),
        body: z.string(),
        // A real project, so no engagement type is claimed without one.
        evidence: z.string(),
      })
    ),
    promise: z.string(),
    // Split from `promise` so the emphasis stays a <strong> rather than
    // becoming HTML embedded in YAML.
    promiseEmphasis: z.string(),
    // "Problems we take on" — the same ground the capability list covers, but
    // in the words a client actually arrives with, each backed by a project.
    problemsHeading: z.string(),
    problems: z.array(
      z.object({
        quote: z.string(),
        body: z.string(),
        evidence: z.string(),
        href: z.string(),
      })
    ),
    // "What's included". `name` renders as a tag on the homepage; `items` is
    // the detail behind each one. Kept below the problems as reference for
    // someone checking whether we do a specific thing, and rendered inside a
    // <details> so it does not outweigh the sections above; `servicesSummary`
    // is the label on that disclosure.
    servicesHeading: z.string(),
    servicesLead: z.string(),
    servicesSummary: z.string(),
    services: z.array(
      z.object({
        name: z.string(),
        items: z.array(z.string()).default([]),
      })
    ),
    // "How we work"
    processHeading: z.string(),
    process: z.array(
      z.object({
        step: z.string(),
        body: z.string(),
      })
    ),
  }),
});

// Page copy for /about. Frontmatter carries the head and the SEO tags; the
// markdown body carries the sections, so the prose is editable in one file
// without touching the page shell.
const about = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/about',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    lead: z.string(),
    contactLead: z.string(),
  }),
});

// Legal pages — /privacy today, an imprint or terms later. Same split as
// `about`: frontmatter carries the head and the page intro, the markdown body
// carries the prose, so a policy can be reworded without touching a component.
const legal = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/legal',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    lead: z.string(),
    // Rendered under the heading. A policy with no date on it tells a reader
    // nothing about whether it still describes the site they are on.
    updated: z.string(),
  }),
});

export const collections = {
  projects,
  services,
  about,
  legal,
};
