/**
 * Rotating topic list for the monthly auto-post cron job.
 *
 * Topics are curated to match BlackArrow's tracked keywords in Ahrefs Rank Tracker
 * (NC-focused long-tails). They rotate in order — each monthly run skips topics
 * whose slug already exists in the posts table and picks the next unused one.
 *
 * Categories must match existing categories in the insights filter so the new
 * post clusters correctly on /insights and surfaces as a related post on the
 * matching /insurance/* page via getPostsByCategory().
 */

export type AutoPostTopic = {
  /** Proposed title — the LLM may tighten it but this is the seed. */
  title: string
  /** Suggested URL slug. Auto-post skips any topic whose slug already exists. */
  slug: string
  /** Primary category — must match the insights category taxonomy. */
  category: string
  /** Featured image path from /public/images/insights. Leave null to fall back. */
  featuredImage: string | null
  /** Primary keyword to optimize for. Used in the LLM prompt. */
  primaryKeyword: string
  /** Supporting keywords to weave into the body and subheads. */
  secondaryKeywords: string[]
  /** Short brief the LLM uses to outline the post. */
  brief: string
  /** Related insurance slug(s) for internal linking. */
  internalLinks: string[]
}

export const autoPostTopics: AutoPostTopic[] = [
  {
    title: 'NC Hurricane Deductibles Explained: What Coastal Homeowners Need to Know',
    slug: 'nc-hurricane-deductibles-explained-coastal-homeowners',
    category: 'Homeowners Insurance',
    featuredImage: '/images/insights/first-time-homebuyers-guide-to-homeowners-insurance.png',
    primaryKeyword: 'hurricane insurance nc',
    secondaryKeywords: [
      'coastal home insurance nc',
      'windstorm insurance nc',
      'named storm deductible',
      'nc wind and hail deductible',
    ],
    brief: 'Explain how named-storm and wind/hail deductibles work in North Carolina, why they are usually a percentage of dwelling coverage rather than a flat dollar amount, how coastal counties are treated differently, and what Eastern NC homeowners should ask their agent before hurricane season. Cite the NC Beach Plan (NCJUA) where relevant.',
    internalLinks: ['homeowners', 'rental-dwelling'],
  },
  {
    title: 'NC Flood Zones 101: Who Needs Flood Insurance in Eastern North Carolina?',
    slug: 'nc-flood-zones-who-needs-flood-insurance-eastern-north-carolina',
    category: 'Homeowners Insurance',
    featuredImage: '/images/insights/first-time-homebuyers-guide-to-homeowners-insurance.png',
    primaryKeyword: 'flood insurance nc',
    secondaryKeywords: [
      'north carolina flood zones',
      'flood insurance wilmington nc',
      'nc flood zone map',
      'fema flood zone nc',
    ],
    brief: 'Explain FEMA flood zones in NC (AE, VE, X), why many NC flood claims come from properties outside mapped high-risk zones, how standard homeowners policies exclude flood, and NFIP vs. private flood options. Mention Wilmington, New Bern, Greenville, and Whiteville specifically.',
    internalLinks: ['homeowners', 'rental-dwelling'],
  },
  {
    title: 'Short-Term Rental Insurance in NC: What Airbnb and VRBO Hosts Must Know',
    slug: 'short-term-rental-insurance-nc-airbnb-vrbo-hosts',
    category: 'Short-Term Rental',
    featuredImage: '/images/insights/homeowners-insurance-vs-short-term-rental-insurance-why-you-need-both.png',
    primaryKeyword: 'short term rental insurance nc',
    secondaryKeywords: [
      'airbnb insurance nc',
      'vacation rental insurance nc',
      'airbnb insurance requirements nc',
      'vrbo insurance north carolina',
    ],
    brief: "Explain why standard homeowners insurance typically excludes short-term rental activity, what commercial STR policies cover (liability, lost rental income, guest damage, host liability), how Airbnb's Host Protection limits fall short, and coverage differences by NC market (Wilmington beach rentals vs. Outer Banks vs. mountain cabins).",
    internalLinks: ['short-term-rental', 'rental-dwelling'],
  },
  {
    title: 'NC Workers Compensation Requirements: A 2026 Guide for Small Business Owners',
    slug: 'nc-workers-compensation-requirements-small-business-owners',
    category: 'Workers Compensation',
    featuredImage: '/images/insights/how-workers-compensation-insurance-benefits-both-employers-and-employees.png',
    primaryKeyword: 'workers comp insurance nc',
    secondaryKeywords: [
      'nc workers compensation requirements',
      'north carolina workers comp',
      'workers comp insurance wilmington nc',
      'nc industrial commission',
    ],
    brief: 'Explain the 3-or-more-employees threshold under NC law, the construction-industry exception (any number of employees), penalties from the NC Industrial Commission, how premiums are calculated from payroll and classification codes, and how independent contractors are tested. Mention that rates in NC tend to be moderate compared to other coastal states.',
    internalLinks: ['workers-compensation', 'business-owners-package'],
  },
  {
    title: 'General Liability Insurance for NC Small Businesses: What You Need and Why',
    slug: 'general-liability-insurance-nc-small-business',
    category: 'General Liability',
    featuredImage: '/images/insights/how-much-general-liability-insurance-coverage-does-your-business-really-need.png',
    primaryKeyword: 'general liability insurance nc',
    secondaryKeywords: [
      'bop insurance nc',
      'small business insurance nc',
      'commercial insurance wilmington nc',
      'cert of insurance nc',
    ],
    brief: "Explain what general liability covers (bodily injury, property damage, advertising injury, products/completed ops), typical policy limits for NC small businesses ($1M/$2M is standard), why landlords and general contractors demand certificates of insurance, and when to upgrade to a Business Owner's Package (BOP).",
    internalLinks: ['general-liability', 'business-owners-package'],
  },
  {
    title: 'Builder\'s Risk Insurance in North Carolina: Coverage for Every Stage of Construction',
    slug: 'builders-risk-insurance-north-carolina-construction-coverage',
    category: 'Builders Risk',
    featuredImage: '/images/insights/how-builders-risk-insurance-can-protect-your-construction-site-from-unexpected-risks.png',
    primaryKeyword: 'builders risk insurance nc',
    secondaryKeywords: [
      'contractor insurance nc',
      'new construction insurance nc',
      'renovation insurance nc',
      'course of construction insurance',
    ],
    brief: 'Explain what builder\'s risk insurance covers (materials on site, in transit, at temp storage), how NC policies handle named-storm exposure during coastal construction, who typically purchases it (owner vs. GC), and when coverage should transition to a permanent homeowners or commercial property policy.',
    internalLinks: ['builders-risk', 'commercial-property'],
  },
  {
    title: 'Commercial Auto Insurance for NC Fleets: What Wilmington and Raleigh Businesses Need',
    slug: 'commercial-auto-insurance-nc-fleets-wilmington-raleigh',
    category: 'Commercial Auto',
    featuredImage: '/images/insights/how-your-commercial-auto-insurance-can-protect-against-lawsuits.png',
    primaryKeyword: 'commercial auto insurance nc',
    secondaryKeywords: [
      'fleet insurance nc',
      'commercial auto raleigh nc',
      'commercial auto wilmington nc',
      'hired and non-owned auto',
    ],
    brief: 'Explain how commercial auto differs from personal auto (higher liability limits, hired/non-owned auto, drive-other-car endorsement), why employees driving personal cars for work create exposure, and how NC trucking businesses should handle DOT-required filings.',
    internalLinks: ['commercial-auto', 'dump-straight-truck'],
  },
  {
    title: 'Cyber Liability Insurance for NC Businesses: Why Small and Mid-Sized Firms Need It',
    slug: 'cyber-liability-insurance-nc-small-mid-sized-business',
    category: 'Cyber Liability',
    featuredImage: '/images/insights/cyber-liability-insurance-vs-general-liability-insurance-whats-the-difference.png',
    primaryKeyword: 'cyber liability insurance nc',
    secondaryKeywords: [
      'data breach insurance nc',
      'ransomware insurance nc',
      'cyber insurance small business',
      'nc data breach notification',
    ],
    brief: 'Explain first-party vs third-party cyber coverage (ransomware payments, forensics, notification costs, business interruption, PCI fines), why general liability specifically excludes cyber events, and NC\'s breach notification law (GS 75-60 et seq.). Use a realistic small-business ransomware scenario.',
    internalLinks: ['cyber-liability', 'business-owners-package'],
  },
  {
    title: 'Vacant Property Insurance in NC: Why Your Homeowners Policy Won\'t Cut It',
    slug: 'vacant-property-insurance-nc-homeowners-policy-gap',
    category: 'Property',
    featuredImage: '/images/insights/5-risks-of-leaving-your-property-vacant-without-insurance-coverage.png',
    primaryKeyword: 'vacant home insurance nc',
    secondaryKeywords: [
      'unoccupied property insurance nc',
      'vacant house insurance nc',
      'estate property insurance',
      'nc dwelling fire policy',
    ],
    brief: 'Explain the 30- or 60-day vacancy clause that voids most homeowners policies, common NC scenarios (estate settlement, renovation, snowbird properties, between tenants), what vacant dwelling policies cover, and how pricing compares to a standard HO-3.',
    internalLinks: ['vacant-unoccupied', 'homeowners'],
  },
  {
    title: 'Landlord Insurance in NC: What Rental Property Owners Need to Know',
    slug: 'landlord-insurance-nc-rental-property-owners',
    category: 'Rental Dwelling',
    featuredImage: '/images/insights/how-rental-dwelling-insurance-differs-from-homeowners-insurance.png',
    primaryKeyword: 'landlord insurance nc',
    secondaryKeywords: [
      'rental property insurance nc',
      'dwelling fire policy nc',
      'long term rental insurance nc',
      'nc landlord liability',
    ],
    brief: 'Explain DP-1 vs DP-3 dwelling fire policies, loss of rental income coverage, landlord liability (injured tenants/guests), why tenants should carry their own renters insurance, and how NC landlord insurance differs between single-family, multi-family, and short-term rentals.',
    internalLinks: ['rental-dwelling', 'short-term-rental'],
  },
  {
    title: 'Boat Insurance for NC Waters: Coverage for Intracoastal, Pamlico, and Offshore',
    slug: 'boat-insurance-nc-intracoastal-pamlico-offshore',
    category: 'Boat Insurance',
    featuredImage: '/images/insights/boat-insurance-for-new-boat-owners-what-you-need-to-know-before-hitting-the-water.png',
    primaryKeyword: 'boat insurance wilmington nc',
    secondaryKeywords: [
      'boat insurance nc',
      'nc boat liability',
      'intracoastal boat insurance',
      'coastal boat insurance nc',
    ],
    brief: 'Explain NC boat insurance considerations: hull and machinery, liability (especially important in busy Wilmington-area waters), hurricane named-storm deductibles for coastal moorage, fuel spill/salvage coverage, and extended cruising endorsements for Florida or the Bahamas.',
    internalLinks: ['boat', 'homeowners'],
  },
  {
    title: 'Equipment Breakdown Insurance for NC Businesses: Protecting Tools, Machinery, and Tech',
    slug: 'equipment-breakdown-insurance-nc-business-tools-machinery',
    category: 'Equipment',
    featuredImage: '/images/insights/how-equipment-breakdown-coverage-can-save-your-business-money.png',
    primaryKeyword: 'equipment insurance nc',
    secondaryKeywords: [
      'equipment breakdown insurance nc',
      'inland marine insurance nc',
      'contractor equipment insurance',
      'tools insurance nc',
    ],
    brief: "Explain equipment breakdown vs inland marine coverage, why contractors need coverage for tools in transit (not just on site), common NC claim scenarios (lightning damage, generator failure, stolen tools), and how equipment policies coordinate with a Business Owner's Package.",
    internalLinks: ['equipment', 'business-owners-package'],
  },
]

/**
 * Pick the next unused topic given the list of already-published slugs.
 * Returns null if every topic has been used (cron will log and exit).
 */
export function pickNextTopic(usedSlugs: Set<string>): AutoPostTopic | null {
  for (const topic of autoPostTopics) {
    if (!usedSlugs.has(topic.slug)) {
      return topic
    }
  }
  return null
}

export const fallbackFeaturedImage = '/images/AdobeStock_315458621.jpeg'
