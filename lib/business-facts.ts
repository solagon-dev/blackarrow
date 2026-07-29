/**
 * BlackArrow business claims & facts registry — SINGLE SOURCE OF TRUTH.
 *
 * Plan §4.3. Every reusable business statistic, office fact, and regulated
 * (insurance/legal) claim used across the site should originate here so it can
 * be reviewed and corrected in one place instead of being hardcoded across
 * templates.
 *
 * RULES FOR THIS FILE
 * -------------------
 * 1. Do NOT invent facts. Values marked `verified: false` are provided by the
 *    business but not yet confirmed — surface them for approval, never present
 *    unverified superlatives as fact.
 * 2. Regulated facts (NC auto minimums, workers' comp) carry a `source` URL and
 *    a `lastReviewed` date. Re-check the source when editing.
 * 3. This file is plain data + pure helpers. No side effects.
 */

import { offices, type Office } from './team-data'

export { offices }
export type { Office }

// ---------------------------------------------------------------------------
// Company identity
// ---------------------------------------------------------------------------

/**
 * Founding year. The codebase, the Organization schema, and the "Our Story"
 * page consistently use 2002; only the quote sidebar said 2003. Standardized on
 * 2002 (the predominant, schema-consistent value). Business to confirm.
 */
export const FOUNDING_YEAR = 2002
export const FOUNDING_YEAR_VERIFIED = false // TODO(business): confirm 2002 is authoritative
export const ORIGINAL_NAME = 'Iventure'

/** Whole years in business as of `asOf` (default: now). */
export function yearsInBusiness(asOf: Date = new Date()): number {
  return asOf.getFullYear() - FOUNDING_YEAR
}

/** Approved "years in business" display, e.g. "over two decades". */
export function yearsInBusinessDisplay(asOf: Date = new Date()): string {
  const years = yearsInBusiness(asOf)
  if (years >= 20) return 'over two decades'
  if (years >= 10) return `over ${Math.floor(years / 10) * 10} years`
  return `${years} years`
}

// ---------------------------------------------------------------------------
// Carrier relationships
// ---------------------------------------------------------------------------

/**
 * Number of carrier relationships. Displayed pervasively as "20+ carriers".
 * NOT independently verified in this engagement — flagged for business
 * confirmation (Plan §18). The claim is left in place (the business supplied it)
 * but must be confirmed with an exact count and verification date.
 */
export const CARRIERS = {
  displayCount: '20+',
  display: '20+ carriers',
  verified: false as const,
  lastVerified: null as string | null, // TODO(business): set exact count + date
}

// ---------------------------------------------------------------------------
// Offices & service areas
// ---------------------------------------------------------------------------

export const GREENVILLE_OFFICE: Office =
  offices.find((o) => o.city === 'Greenville') ?? offices[0]
export const WHITEVILLE_OFFICE: Office =
  offices.find((o) => o.city === 'Whiteville') ?? offices[1]

/** Physical offices vs. service-only areas (Plan §6.4). */
export const SERVICE_AREAS = {
  physicalOffices: ['Greenville', 'Whiteville'] as const,
  serviceOnly: ['Wilmington', 'Raleigh', 'Jacksonville'] as const,
  region: 'Eastern North Carolina',
}

/**
 * Location-aware primary phone (Plan §7.4). Greenville-context pages prefer the
 * Greenville office; Whiteville-context pages prefer Whiteville; everything else
 * falls back to Greenville as the main line. Never geolocate the visitor.
 */
export function primaryPhoneFor(context?: string): string {
  const c = (context ?? '').toLowerCase()
  if (c.includes('whiteville') || c.includes('columbus')) return WHITEVILLE_OFFICE.phone
  return GREENVILLE_OFFICE.phone
}

// ---------------------------------------------------------------------------
// Regulated facts — North Carolina auto liability minimums
// ---------------------------------------------------------------------------

/**
 * NC minimum auto liability limits.
 * Effective for policies issued or renewed on or after July 1, 2025.
 * Sources:
 *  - https://www.ncdoi.gov/changes-rating-automobile-insurance-policies-effective-july-1-2025
 *  - https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-279.21.html
 */
export const NC_AUTO_MINIMUMS = {
  effectiveDate: 'July 1, 2025',
  bodilyInjuryPerPerson: 50000,
  bodilyInjuryPerAccident: 100000,
  propertyDamage: 50000,
  shorthand: '50/100/50',
  umUimIncluded: true,
  source: 'https://www.ncdoi.gov/changes-rating-automobile-insurance-policies-effective-july-1-2025',
  lastReviewed: '2026-07-23',
  /** Ready-to-use, historically intelligible sentence for copy/FAQs/schema. */
  summary:
    'For policies issued or renewed on or after July 1, 2025, North Carolina requires minimum auto liability limits of $50,000 bodily injury per person, $100,000 bodily injury per accident, and $50,000 property damage. New and renewed policies also include uninsured/underinsured motorist coverage.',
  /** Shorter variant for tight spaces. */
  short:
    'Since July 1, 2025, NC minimum auto liability limits are $50,000 per person / $100,000 per accident bodily injury and $50,000 property damage (with uninsured/underinsured motorist coverage included).',
} as const

// ---------------------------------------------------------------------------
// Regulated facts — North Carolina workers' compensation
// ---------------------------------------------------------------------------

/**
 * NC workers' comp requirements — general rule with nuance.
 * Source: https://www.ic.nc.gov/wcinsrqmt.html (NC Industrial Commission).
 *
 * Key nuance (Plan §4.2): the common claim that "any construction contractor
 * with even one employee must carry coverage" is an overstatement. The 3+
 * employee rule applies to construction too; separately, a business that uses an
 * uninsured subcontractor can be held liable for that subcontractor's employees'
 * injuries regardless of employee count. This is a liability exposure, not a
 * universal mandate. Present as general information, not legal advice.
 */
export const NC_WORKERS_COMP = {
  generalThreshold: 3,
  source: 'https://www.ic.nc.gov/wcinsrqmt.html',
  lastReviewed: '2026-07-23',
  summary:
    'North Carolina generally requires businesses with three or more employees — including corporations, sole proprietorships, LLCs, and partnerships — to carry workers’ compensation insurance. Certain activities (for example, work involving radiation) can trigger the requirement at fewer employees.',
  subcontractorNote:
    'Construction businesses are subject to the same three-employee rule. Separately, if you hire a subcontractor who does not carry workers’ compensation, you can be held liable for injuries to that subcontractor’s employees regardless of how many people either of you employs — which is why general contractors so often require certificates of insurance.',
  ownersNote:
    'Sole proprietors, partners, and LLC members are not automatically counted as employees; corporate officers may elect exclusion but still count toward the three-employee threshold.',
  penaltiesNote:
    'Failing to carry required coverage can lead to significant penalties, including fines, possible misdemeanor or felony charges, and personal liability for a business’s owners. The NC Industrial Commission enforces these requirements.',
  disclaimer:
    'This is general information, not legal advice. Requirements have exceptions and counting rules — confirm your specific obligation with a licensed agent and the North Carolina Industrial Commission.',
} as const

// ---------------------------------------------------------------------------
// Approved language / prohibited hype (Plan §4.4, §11.1)
// ---------------------------------------------------------------------------

export const APPROVED = {
  companyDescription:
    'BlackArrow Insurance is an independent insurance agency serving Eastern North Carolina, with offices in Greenville and Whiteville.',
  /** Honest multi-carrier value prop — no "best rate/price" guarantee. */
  multiCarrierValue:
    'As an independent agency, we compare coverage and pricing across multiple carriers to find a competitive fit for your needs.',
} as const

/**
 * Claims that must never appear as fact unless the business substantiates them.
 * Kept here as a checklist for reviewers (Plan §4.4).
 */
export const PROHIBITED_UNVERIFIED_CLAIMS = [
  'largest insurance agency in Greenville / largest agency',
  'serving thousands of clients (specific client counts)',
  'best rate / best price / most favorable terms (guarantees)',
  'same-day quotes / quotes in minutes (unverified response times)',
  'specific carrier discounts or precise premium promises',
] as const
