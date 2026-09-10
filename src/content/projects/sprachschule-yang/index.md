---
title: 'Room and class scheduling'
subtitle: 'Replacing a subscription that had outgrown the problem'
featured: true
type: 'Client work'
created: 2026-07-01
domains:
  - Product
  - Internal Tools
stack:
  - React
  - TypeScript
  - Postgres
category: 'Scheduling System'
tags: ['Build vs Buy', 'Requirements', 'Delivery', 'Maintenance']
info: 'A Zürich language school was paying a growing subscription to book six rooms. We scoped and delivered a replacement they own outright. In production for 8 people across 6 rooms.'
description: 'Sprachschule Yang was renting scheduling software priced for an organisation many times their size. We ran the requirements, made the build-vs-buy call, scoped and priced the replacement, and delivered it. It has been in production since July 2026, and we hold the maintenance contract.'
scope: 'Requirements, build-vs-buy call, scoping and estimate, access model, code review, delivery'
timeline: 'One month from signed scope to production · maintenance ongoing'
completed: '07/2026'
client: 'Sprachschule Yang'
clientLink: 'https://sprachschule-yang.ch'
tools: ['Figma', 'React', 'TypeScript', 'Tailwind', 'TanStack Start', 'Supabase / Postgres', 'Cloudflare Workers']
focus:
  [
    'Build-vs-buy analysis',
    'Requirements with the owner',
    'Two-role access model',
    'Retained maintenance',
  ]
approach: 'The value in this engagement was not the code. It was working out what the school actually used versus what it paid for, deciding that building was the right call at this size, defining the access model while it was still a conversation rather than a migration, and carrying that judgment commercially through to delivery.'
---

<div class="contentSection">

## The brief

Sprachschule Yang is a Chinese and Japanese language school in Zürich Wiedikon.
Six teachers, six rooms, two owners administering the timetable.

They ran their booking on a commercial scheduling product. When its price went
up, the question landed in an uncomfortable place: they were paying for a
package built for organisations many times their size, and using a fraction of
it. Renewing meant paying more for capacity they would never touch. Not renewing
meant no scheduling at all.

They asked us whether a custom replacement made commercial sense — and if so, to
scope, price and deliver it.

</div>

<div class="contentSection">

## The decision that mattered

**Whether to build at all.**

This is the part of the engagement that carried the value, and it is worth being
precise about how it was decided. We counted what the school actually used: how
many rooms, how many people, which of the product's features appeared in a
typical week, and what would break if each one disappeared. Then we costed the
alternatives over three years, including the part most estimates leave out —
what it costs to keep a custom system alive after it ships.

At this size, building won. The requirement was small, stable and unlikely to
grow: a school with six rooms in one building does not wake up needing
multi-site resource planning. That combination is exactly when a subscription
priced for scale stops making sense.

It is equally worth saying when it would not have won. Had the school been
opening locations, or had the timetable needed to talk to payroll and invoicing,
the answer would have been to keep renting. **Build-vs-buy is a judgment about a
specific business at a specific size, not a preference.**

</div>

<div class="contentSection">

## What we made

A scheduling system the school owns, covering what they actually do: teachers
book their own classes, owners administer the whole calendar, six rooms, no
double-bookings.

#### The access model, defined during requirements

Two roles in a hierarchy — **teachers hold edit rights over their own bookings,
owners over everything.** The split is scope, not read-versus-write.

The value is *when* that was decided. Settled during requirements, a role split
costs one conversation. Retrofitted after the build, it costs a data migration
and a revision of every query that assumed a single kind of user. This is the
cheapest decision in the project and the most expensive one to postpone.

#### Who built it

We ran the requirements, made the call, wrote the scope and the estimate,
defined the access model, reviewed the frontend as it came in, and shipped one
piece of it ourselves — a responsive rework of the page header and calendar
toolbar so the week view stays usable on a narrow screen.

**A second engineer implemented the system.** We are naming that because it is
normal for a studio to bring in a specialist, and because the judgment we are
selling here is not the same thing as the typing.

</div>

<div class="contentSection">

## The result

In production since July 2026. **Eight people across two roles — two owners
administering the whole schedule, six teachers scoped to their own — booking six
rooms.** The subscription is gone.

We hold the maintenance contract and are taking on new feature work as the
school asks for it, which is the arrangement we would recommend to anyone
replacing rented software: the savings are only real if somebody is still
looking after the thing in year two.

The repository is private, so there is no code to show here.

</div>

<div class="contentSection">

## What this shows

The useful work was not the calendar. It was knowing what to build, what not to
build, and being willing to say which — before anyone had committed a budget to
it.

That is the same question we would ask about your problem, and the answer is
sometimes *keep paying the subscription*.

</div>
