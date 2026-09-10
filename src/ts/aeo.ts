/**
 * Structured data for insdash — a studio, not a person.
 *
 * This file replaces the Person builder carried over from the personal
 * portfolio. A studio is a different entity: it has offers, a service area and
 * clients, not a job title and a resume.
 *
 * Everything here is emitted by AEO.astro as a single `@graph`, so every page
 * describes the same entities under the same `@id`s. Answer engines and
 * crawlers merge nodes by `@id`, which means a fact stated once on /about is
 * attached to the same studio a crawler meets on a project page, rather than
 * looking like a second company with a similar name.
 *
 * The rule for this file: nothing is asserted here that a reader cannot also
 * find in the page copy. The catalogue mirrors src/content/services/services.md,
 * the description mirrors src/content/about/about.md, and project nodes are
 * built from project frontmatter. Structured data that outruns the visible page
 * is what gets a site's markup ignored.
 */
import type { CollectionEntry } from 'astro:content';
import { site, socials } from './site';

/* -------------------------------------------------------------------------
 * Studio facts. Each one is sourced from page copy — the comment says where.
 * ---------------------------------------------------------------------- */

/** about.md, first paragraph. Kept short enough for an answer engine to quote. */
const STUDIO_DESCRIPTION =
  'insdash is a two-person design and development studio in Zürich. We design and build software for small companies — too specific for off-the-shelf products, too small to interest an agency — and we take a project from the first conversation to the thing running in production.';

/**
 * The one line that separates insdash from every other studio in the city.
 * `disambiguatingDescription` exists for exactly this, and it is the field an
 * answer engine reaches for when it has to say what makes a company different.
 */
const STUDIO_DIFFERENTIATOR =
  'The same two people run the requirements, the interface design and the production code, so a design engagement can turn into working software without changing supplier — and the studio will say when buying beats building.';

/** about.md: "We design and build." */
const STUDIO_SLOGAN = 'We design and build.';

/** The studio’s first client engagement, completed 08/2021. */
const FOUNDING_YEAR = '2021';

/** about.md: "a two-person design and development studio in Zürich". */
const HEADCOUNT = 2;

/**
 * Working languages, as BCP-47 tags. English only, matching the site.
 *
 * This is a claim about the people, not about the site — it is what a client
 * can expect to be answered in. Add 'de' here if that is true of a first
 * conversation, and it will reach both `knowsLanguage` and the contact point.
 */
const LANGUAGES = ['en'];

/** about.md, Practicalities: Switzerland, plus remote clients in Europe and Asia. */
const AREA_SERVED = [
  { '@type': 'Country', name: 'Switzerland' },
  { '@type': 'Place', name: 'Europe' },
  { '@type': 'Place', name: 'Asia' },
];

/**
 * Topics the studio is claiming competence in. This is the short, searchable
 * version — the full list is `hasOfferCatalog`, built from services.md. Keep
 * the two in step: a capability dropped there and left here says two different
 * things to a crawler.
 */
const KNOWS_ABOUT = [
  'Web Application Development',
  'Product Design',
  'Interaction Design',
  'UI/UX Design',
  'Design Systems',
  'Build vs Buy Analysis',
  'Requirements Gathering',
  'Information Architecture',
  'Postgres Schema Design',
  'Software Maintenance',
  'Print and Information Design',
  '3D Product Visualisation',
  'Accessibility (a11y)',
];

/** Raster, square, and served from this origin — what Google asks a logo to be. */
const LOGO = { path: 'images/logo/insdash_dark.png', width: 300, height: 300 };

/* -------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------- */

type Json = Record<string, unknown>;

/** Strips empty values so the emitted graph stays small and readable. */
function clean<T extends Json>(node: T): T {
  for (const [key, value] of Object.entries(node)) {
    const empty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);
    if (empty) delete (node as Json)[key];
  }
  return node;
}

/** Absolute URL from a './foo.png', '/foo.png' or already-absolute value. */
export function absolute(
  path: string | undefined,
  siteUrl: string
): string | undefined {
  if (!path) return undefined;
  return path.startsWith('http')
    ? path
    : `${siteUrl}/${path.replace(/^\.?\//, '')}`;
}

/**
 * Project frontmatter stores completion as `MM/YYYY`. `2024-08` is a legal ISO
 * 8601 date, so there is no need to invent a day the client never agreed to.
 */
function toIsoMonth(value?: string): string | undefined {
  const match = value?.match(/^(\d{1,2})\/(\d{4})$/);
  return match ? `${match[2]}-${match[1].padStart(2, '0')}` : undefined;
}

/* -------------------------------------------------------------------------
 * Stable @ids. Every node in the graph is addressed through one of these, so
 * the same entity is never described twice under two names.
 * ---------------------------------------------------------------------- */

export const organizationId = (siteUrl: string) => `${siteUrl}/#organization`;
export const websiteId = (siteUrl: string) => `${siteUrl}/#website`;
export const catalogId = (siteUrl: string) => `${siteUrl}/services/#catalog`;
export const pageId = (pageUrl: string) => `${pageUrl}#webpage`;
export const breadcrumbId = (pageUrl: string) => `${pageUrl}#breadcrumb`;
export const workId = (pageUrl: string) => `${pageUrl}#work`;

const ref = (id: string) => ({ '@id': id });

/* -------------------------------------------------------------------------
 * The studio
 * ---------------------------------------------------------------------- */

type ServicesData = CollectionEntry<'services'>['data'];

export interface OrganizationInput {
  siteUrl: string;
  /** Overrides the studio description. Defaults to the /about opening. */
  description?: string;
  /** services.md. Adds the four engagement shapes and the service types. */
  services?: ServicesData;
  /**
   * The full capability list — every leaf item from services.md, some 9KB of
   * it. /services is the only page that puts those items on screen, so it is
   * opt-in: markup that outruns the visible page is markup a crawler learns to
   * discount. Everywhere else the lean node merges into the same entity by
   * `@id`, so nothing is lost.
   */
  catalogue?: boolean;
}

/**
 * Organization + ProfessionalService.
 *
 * Deliberately no `founder` / `employee` Person nodes. The studio is presented
 * by responsibility rather than by name, and the people behind it have a
 * separate site with a separate audience — linking them here would merge two
 * entities that are meant to stay distinct.
 */
export function buildOrganization({
  siteUrl,
  description = STUDIO_DESCRIPTION,
  services,
  catalogue = false,
}: OrganizationInput) {
  const id = organizationId(siteUrl);

  return clean({
    '@type': ['Organization', 'ProfessionalService'],
    '@id': id,
    name: site.name,
    url: `${siteUrl}/`,
    description,
    disambiguatingDescription: STUDIO_DIFFERENTIATOR,
    slogan: STUDIO_SLOGAN,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#logo`,
      url: absolute(LOGO.path, siteUrl),
      width: LOGO.width,
      height: LOGO.height,
      caption: site.name,
    },
    image: ref(`${siteUrl}/#logo`),
    foundingDate: FOUNDING_YEAR,
    foundingLocation: {
      '@type': 'Place',
      name: 'Zürich',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Zürich',
        addressCountry: 'CH',
      },
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: HEADCOUNT,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zürich',
      addressRegion: 'ZH',
      addressCountry: 'CH',
    },
    areaServed: AREA_SERVED,
    email: site.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      url: `${siteUrl}/#contact`,
      availableLanguage: LANGUAGES,
      areaServed: AREA_SERVED,
    },
    sameAs: socials.map((social) => social.href),
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: LANGUAGES,
    makesOffer: services && buildEngagementOffers(services, siteUrl),
    hasOfferCatalog:
      services && catalogue ? buildOfferCatalog(services, siteUrl) : undefined,
  });
}

/**
 * "Ways to work with us" — the four engagement shapes, as Offers. These are the
 * answer to "what can I hire them for", which is a different question from the
 * capability list below it.
 */
function buildEngagementOffers(services: ServicesData, siteUrl: string) {
  return services.engagements.map((engagement) =>
    clean({
      '@type': 'Offer',
      itemOffered: clean({
        '@type': 'Service',
        name: engagement.name,
        description: engagement.body,
        serviceType: engagement.name,
        provider: ref(organizationId(siteUrl)),
      }),
      seller: ref(organizationId(siteUrl)),
      url: `${siteUrl}/services/`,
    })
  );
}

/**
 * "Everything we do" — the full capability list from services.md, nested the
 * way schema.org expects: a catalogue of catalogues, each leaf an Offer whose
 * `itemOffered` is a Service.
 */
function buildOfferCatalog(services: ServicesData, siteUrl: string) {
  const provider = ref(organizationId(siteUrl));

  return {
    '@type': 'OfferCatalog',
    '@id': catalogId(siteUrl),
    name: services.servicesHeading,
    description: services.servicesLead,
    url: `${siteUrl}/services/`,
    itemListElement: services.services.map((group, groupIndex) => ({
      '@type': 'OfferCatalog',
      '@id': `${catalogId(siteUrl)}-${groupIndex + 1}`,
      name: group.name,
      itemListElement: group.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item,
          serviceType: group.name,
          provider,
        },
      })),
    })),
  };
}

/* -------------------------------------------------------------------------
 * The site and the page
 * ---------------------------------------------------------------------- */

export function buildWebSite(siteUrl: string, description?: string) {
  const organization = ref(organizationId(siteUrl));

  return clean({
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    url: `${siteUrl}/`,
    name: site.name,
    description: description ?? STUDIO_DESCRIPTION,
    inLanguage: 'en',
    publisher: organization,
    copyrightHolder: organization,
  });
}

export interface WebPageInput {
  siteUrl: string;
  pageUrl: string;
  title: string;
  description?: string;
  image?: string;
  /** WebPage, AboutPage, CollectionPage, ItemPage… */
  type?: string;
  /** The thing this page is primarily about, when it is not the studio. */
  mainEntity?: string;
  hasBreadcrumb?: boolean;
}

export function buildWebPage({
  siteUrl,
  pageUrl,
  title,
  description,
  image,
  type = 'WebPage',
  mainEntity,
  hasBreadcrumb = true,
}: WebPageInput) {
  return clean({
    '@type': type,
    '@id': pageId(pageUrl),
    url: pageUrl,
    name: title,
    description,
    isPartOf: ref(websiteId(siteUrl)),
    about: ref(organizationId(siteUrl)),
    mainEntity: mainEntity ? ref(mainEntity) : undefined,
    primaryImageOfPage: image
      ? { '@type': 'ImageObject', url: image }
      : undefined,
    breadcrumb: hasBreadcrumb ? ref(breadcrumbId(pageUrl)) : undefined,
    inLanguage: 'en',
  });
}

export function buildBreadcrumb(
  pageUrl: string,
  trail: { name: string; url: string }[]
) {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(pageUrl),
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/* -------------------------------------------------------------------------
 * Projects
 * ---------------------------------------------------------------------- */

type ProjectData = CollectionEntry<'projects'>['data'];

/**
 * Software gets the specific type; everything else stays a CreativeWork. A menu
 * system and a product animation are both creative works, and claiming a
 * narrower type for them (VideoObject without a video file, say) buys nothing
 * and fails validation.
 */
function projectType(data: ProjectData): string | string[] {
  return data.domains?.includes('Web Application')
    ? 'WebApplication'
    : 'CreativeWork';
}

export interface ProjectInput {
  siteUrl: string;
  pageUrl: string;
  data: ProjectData;
  image?: string;
}

export function buildProject({
  siteUrl,
  pageUrl,
  data,
  image,
}: ProjectInput) {
  const organization = ref(organizationId(siteUrl));
  const isSelfInitiated = data.client === site.name;
  const isSoftware = projectType(data) === 'WebApplication';

  return clean({
    '@type': projectType(data),
    '@id': workId(pageUrl),
    name: data.title,
    alternativeHeadline: data.subtitle,
    description: data.description,
    abstract: data.info,
    url: pageUrl,
    mainEntityOfPage: ref(pageId(pageUrl)),
    image,
    inLanguage: 'en',
    genre: data.category,
    // Frontmatter splits the same idea across four fields; a crawler wants one
    // flat keyword set, so they are merged and de-duplicated here.
    keywords: [
      ...new Set([
        ...data.tags,
        ...(data.domains ?? []),
        ...data.focus,
        ...data.tools,
      ]),
    ].join(', '),
    creator: organization,
    author: organization,
    // "The Organization on whose behalf the creator was working" — the client,
    // exactly. Self-initiated work points back at the studio itself.
    sourceOrganization: isSelfInitiated
      ? organization
      : { '@type': 'Organization', name: data.client },
    // Wherever the delivered work is public: the client's site, the live app,
    // or the published film.
    sameAs: data.clientLink ? [data.clientLink] : undefined,
    datePublished: toIsoMonth(data.completed),
    // Only meaningful for the software projects.
    applicationCategory: isSoftware ? 'BusinessApplication' : undefined,
    operatingSystem: isSoftware ? 'Web browser' : undefined,
    isAccessibleForFree: isSoftware ? true : undefined,
  });
}

/**
 * The work index, as an ordered list. This is what lets an answer engine
 * enumerate the studio's projects instead of guessing from links.
 */
export function buildProjectList(
  pageUrl: string,
  projects: { title: string; url: string }[]
) {
  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#worklist`,
    name: 'Client work by insdash',
    numberOfItems: projects.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: project.url,
    })),
  };
}
