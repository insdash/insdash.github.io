---
title: 'menuGen'
subtitle: 'Menu data in, print-ready PDF out'
featured: true
type: 'Self-initiated'
created: 2026-02-01
domains:
  - Product
  - Web Application
stack:
  - Vue.js
  - TypeScript
  - Node.js
category: 'Web Application'
tags: ['Web App', 'Product', 'Design → Build']
image: './menu-generator-c.png'
hoverImage: './menu-generator.webp'
thumbnail: './menu-generator-c.png'
info: 'A web app that turns structured menu data into a print-ready PDF. Deployed at menugen.insdash.ch, and the source is public.'
description: 'A Fatt hired us to design a menu. Doing that job showed us the problem underneath it — even in Canva, every change is still layout work — so we built the tool that removes the layout step entirely. menuGen takes structured menu data and produces a print-ready PDF, with the on-screen preview matching the printed page exactly.'
scope: 'Product, design and development'
timeline: '4 months · 130 commits'
completed: '02/2026'
client: 'insdash'
clientLink: 'https://menugen.insdash.ch'
tools: ['Vue.js', 'TypeScript', 'Node.js', 'Figma']
focus:
  [
    'Print fidelity',
    'Async job queue',
    'Category-aware pagination',
    'Asset pipeline',
  ]
approach: 'Self-initiated after the A Fatt engagement. Product decisions, interface design, build and deployment were all ours. The hard part was print fidelity — guaranteeing that what a restaurant sees on screen is what comes out of the printer — which is what forced the asynchronous job queue behind the renderer.'
---

<div class="contentSection">

## The brief

There wasn't one. This is the project we set ourselves.

[A Fatt](/projects/afatt) hired us to design a menu, and we delivered a modular
system in Figma and Canva that they still use. They work in Canva and are happy
there, so we did not push a tool change on them — the switching cost would have
landed on the restaurant, not on us.

What was left over was the *general* problem. A restaurant owner with no design
training still has to lay out a menu by hand every time a price moves or a dish
comes off. Even in Canva, every change is layout work. menuGen is the answer to
that, built for the category rather than for one client.

</div>

<div class="contentSection">

## What we made

A web app that takes structured menu data and gives back a print-ready PDF.
Content in, layout handled.

![Importing a menu from CSV](./01-csv-import.webp)

Menu content arrives as a spreadsheet — the format restaurants already keep their
prices in — and lands in an editor where every field is editable in place.

![Editing dish names and prices inline](./02-inline-edit.webp)

Dietary and preparation icons are assigned per dish, multilingual by default,
because that was the actual requirement behind the original A Fatt job.

![Assigning dietary and preparation icons](./03-icon-edit.webp)

![Uploading and cropping dish photography](./04-image-upload.webp)

The live preview is the page. Not an approximation of it.

![A two-page spread, editor and preview side by side](./06-two-page-spread.webp)

</div>

<div class="contentSection">

## The decision that mattered

**Print fidelity, and it forced the architecture.**

A menu that looks right in a browser is worthless if it prints soft. Getting from
an on-screen layout to a print-ready PDF means guaranteeing that every image
lands at the right resolution — and naive rendering does not guarantee it,
because assets resolve at different times. Start rendering before an upload has
finished processing and you get a soft photograph, which nobody notices until
the printer hands back a box of menus.

So the renderer sits behind an asynchronous job queue. The queue makes the
pipeline's ordering deterministic: nothing renders until every asset it depends
on is ready.

That single constraint is why the rest of the machinery exists — an asset
pipeline that takes an upload through crop, compression and inlining before it
ever reaches the renderer, and category-aware pagination that keeps a section
from splitting across a page break where a diner would lose it.

![The generated PDF, matching the preview exactly](./07-pdf-output.webp)

Smaller decisions in the same spirit: dishes auto-number within their category
and reuse the gaps, so deleting a dish doesn't leave a hole in the numbering or
force a manual renumber down the page.

</div>

<div class="contentSection">

## The result

menuGen is **deployed and live** at
[menugen.insdash.ch](https://menugen.insdash.ch), and
[the source is public](https://github.com/yingshiuan/menuGen).

**It has no users.** A Fatt, the restaurant the idea came from, chose to stay on
the Canva system we handed over — which was the right call for them, and we
didn't push it. We publish menuGen because the interesting part is the
engineering, not a usage number we'd have to invent.

<div>
  <a href="https://github.com/yingshiuan/menuGen" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/View%20on-GitHub-181717?logo=github&logoColor=white" alt="View menuGen on GitHub" />
  </a>
</div>

</div>

<div class="contentSection">

## What this shows

A design engagement here can become working software, because the same practice
does both halves. You are not paying a designer to produce a specification for
somebody else to interpret.

That is the whole argument, and menuGen is the clearest instance of it:
[a menu design job](/projects/afatt) that turned into a product.

</div>
