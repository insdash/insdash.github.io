/**
 * Single source of truth for the studio's contact details and outbound links.
 *
 * The email is referenced from the footer, the contact section and the nav, so
 * changing it is one edit here rather than a grep. The privacy policy writes the
 * address out in full and has to be updated by hand.
 */
export const site = {
  name: 'insdash',
  location: 'Zürich, Switzerland',
  email: 'hello@insdash.ch',
} as const;

/**
 * The Google Analytics 4 property.
 *
 * Single source on purpose: the tag in Layout.astro and the privacy policy both
 * read it, so switching properties is one edit here rather than a grep across a
 * layout and a legal document. The policy writes `{measurementId}` where the ID
 * belongs — in the property reference and in the `_ga_…` cookie name — and
 * privacy.astro substitutes it from this constant.
 */
export const analytics = {
  measurementId: 'G-795EK5W2DW',
} as const;

export const socials = [
  // { label: 'GitHub', href: 'https://github.com/insdash' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/insdash' },
] as const;
