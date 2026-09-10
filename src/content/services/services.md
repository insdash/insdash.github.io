---
# ---------------------------------------------------------------------------
# Every word on /services comes from this file. Edit the copy here, not in
# src/pages/services.astro.
# ---------------------------------------------------------------------------

# Head and SEO
title: 'Design and software development services'
description: 'Design and software for small companies in Zürich. Every engagement starts with a written estimate, and if buying beats building, we say so.'
keywords: 'design services Zürich, web application development, product design, build vs buy, Postgres, software maintenance Zürich'

# The homepage intro shows this blurb, plus the service names further down.
homeBlurb: 'A design and development studio in Zürich. We take a project from the first conversation to the thing running in production — and when a design job turns out to need software, we are the ones who build the software.'

# Page intro
eyebrow: 'Services'
heading: 'What we do, and how it works.'
lead: 'Most design studios stop at the handover. Most development shops need a spec before they start. We do both halves, which means a project can change shape partway through without changing supplier.'

# Ways to work with us — every entry carries a real project as evidence.
engagementsHeading: 'Ways to work with us'
engagements:
  - name: 'Design'
    body: 'Research, information architecture and interface design, handed over in a file your team can actually maintain.'
    evidence: 'A Fatt — a modular menu system the restaurant still runs on.'

  - name: 'Build'
    body: 'We build and ship it. You get the repository and a working deployment, not a prototype.'
    evidence: 'Sprachschule Yang — one month from signed scope to production, and the school owns it outright.'

  - name: 'Design → build'
    body: 'Starts as a design engagement. If it turns out the problem needs software, we scope that and build it too, rather than handing you a spec to take elsewhere.'
    evidence: 'A Fatt asked for a menu. The repeating problem behind it became menuGen.'

  - name: 'Maintenance'
    body: 'We keep it running, and we take on new features as they come up.'
    evidence: 'Sprachschule Yang — delivered, in production, still ours to maintain.'

promise: 'Every engagement starts with a scoping conversation and a written estimate.'
promiseEmphasis: 'If buying beats building, we will tell you.'

# Problems we take on. Written the way a client describes the problem, not the
# way we would describe the work. Every entry points at a project.
problemsHeading: 'Problems we take on'
problems:
  - quote: 'We are paying for software that does not fit us.'
    body: 'Usually a subscription priced for a company ten times your size. We work out what you actually use, what it costs to replace, and tell you which way to go — including when the answer is to keep paying.'
    evidence: 'Sprachschule Yang — we ran that comparison and built the replacement.'
    href: '/projects/sprachschule-yang/'

  - quote: 'Our customers cannot find what they need.'
    body: 'The information is usually already there. It is in the wrong place, at the wrong size, or in the wrong order for the moment someone actually reads it.'
    evidence: 'A Fatt — a menu that explains unfamiliar dishes and flags what is in them.'
    href: '/projects/afatt/'

  - quote: 'The thing we need does not seem to exist.'
    body: 'Then it probably does not, and building it is a real option worth pricing. If it turns out something on the market does the job, we will tell you that instead.'
    evidence: 'menuGen — built because no product did the job.'
    href: '/projects/menugen/'

  - quote: 'We need it looked after once it is built.'
    body: 'Software a business runs its week on needs someone still answering in year two. We keep what we deliver running, ship the features you ask for, and say so when a request is not worth building.'
    evidence: 'Sprachschule Yang — two releases since launch, and an app we talked them out of.'
    href: '/projects/sprachschule-yang/'

# Archived — entries here are not shown on /services, and their case studies
# stay live under /projects. To bring one back, delete the leading # on its lines.

servicesHeading: 'Everything we do'
servicesLead: 'The same people scope it, design it and build it, which is why nothing has to be re-explained when a problem moves from the interface to the database. If what you need is not on the list, ask.'
servicesSummary: 'Open the full capability list'
services:
  - name: 'Scoping & build-vs-buy'
    items:
      - 'Requirements, gathered with the people who use the system'
      - 'Build-vs-buy costed over three years, not at the purchase price'
      - 'Platform selection, and migration off software you have outgrown'
      - 'Access and permission modelling, while it is still a conversation rather than a migration'
      - 'Data export out of the system you are leaving'

  - name: 'Product & interface design'
    items:
      - 'UX research, information architecture and user flows'
      - 'Interface and interaction design in Figma, prototyped before anything is built'
      - 'Design systems built as systems — a change is one edit, not a redraw'
      - 'Multilingual and accessible structure, designed in rather than retrofitted'
      - 'Production files your own team keeps running after we hand over'
      - 'Telling you when the interface is not the fix and the problem is software'

  - name: 'Build & ship'
    items:
      - 'Web applications in React, Vue, TypeScript and Node'
      - 'Deployment, hosting and domain setup on Cloudflare'
      - 'Background jobs and queues for work too slow to do in a request'
      - 'Print-fidelity PDF output — what is on screen is what comes off the printer'
      - 'Performance and accessibility as build criteria, not a later audit'

  - name: 'Data & integrations'
    items:
      - 'Postgres schema design, migrations and access rules'
      - 'Authentication, roles and permissions'

  - name: 'Maintenance & handover'
    items:
      - 'Handover documentation written for whoever comes after us'
      - 'Retained maintenance, including years after launch'
      - 'New feature work once the thing is live'
      - 'Code review on work built alongside your own team'
      - 'Taking over a project somebody else left unfinished'

  - name: 'Information design & print'
    items:
      - 'Working inside the brand you already have, rather than replacing it'
      - 'Menus, signage and print-ready artwork'
      - 'Dietary, allergen and multilingual labelling'
      - 'Photography and description for what a name alone will not sell'

# How we work
processHeading: 'How we work'
process:
  - step: 'Scope'
    body: 'A conversation, then a written estimate. If buying beats building, we say so.'

  - step: 'Design'
    body: 'A clickable prototype or a system file, reviewed with you before anything gets built.'

  - step: 'Build'
    body: 'A repository, a staging URL, then production.'

  - step: 'Hand over'
    body: 'Documentation and access, so you are not locked to us. Maintenance is optional.'
---

Anything written in this body is free-form prose and is not rendered on
/services. All page copy lives in the frontmatter above.
