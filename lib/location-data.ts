export interface LocationPage {
  slug: string
  city: string
  state: string
  stateAbbr: string
  seoTitle: string
  seoDescription: string
  heroHeading: string
  heroDescription: string
  aboutHeading: string
  aboutContent: string[]
  localInsights: {
    heading: string
    content: string[]
  }
  whyChoose: {
    title: string
    description: string
  }[]
  propertyOwnerHeading: string
  propertyOwnerContent: string[]
  guidanceHeading: string
  guidanceItems: {
    title: string
    description: string
  }[]
  surroundingAreas: string[]
}

export const locationPages: LocationPage[] = [
  {
    slug: 'whiteville-nc',
    city: 'Whiteville',
    state: 'North Carolina',
    stateAbbr: 'NC',
    seoTitle: 'Insurance Agency in Whiteville, NC — Home, Auto & Business',
    seoDescription: 'BlackArrow Insurance is an independent insurance agency in Whiteville, NC. We compare rates from 20+ carriers for home, auto, commercial, and property insurance. Get a free quote today.',
    heroHeading: 'Insurance Agency in Whiteville, NC',
    heroDescription: 'BlackArrow Insurance has served Whiteville and Columbus County for over two decades. As an independent brokerage, we compare coverage from 20+ carriers to find the right protection at the right price for families and businesses across southeastern North Carolina.',
    aboutHeading: 'Your Local Insurance Partner in Whiteville',
    aboutContent: [
      'BlackArrow Insurance operates a full-service office in Whiteville, North Carolina, located in the heart of Columbus County. Our Whiteville team provides hands-on, in-person service for individuals, families, and business owners throughout the region.',
      'As the county seat of Columbus County, Whiteville is a community where neighbors know each other and local businesses form the backbone of the economy. We understand the insurance needs specific to this area — from protecting homes in established neighborhoods to insuring small businesses along Madison Street and James B. White Boulevard.',
      'Our Whiteville office handles everything from initial consultations and policy reviews to claims assistance. Whether you stop by in person or call, you will work with a licensed agent who understands the local market and can explain your options clearly.',
    ],
    localInsights: {
      heading: 'Insurance Considerations for Whiteville Residents',
      content: [
        'Whiteville sits in southeastern North Carolina, an area that faces specific weather-related risks including hurricanes, tropical storms, and occasional flooding. Homeowners in Columbus County should review their policies carefully to understand wind and hail deductibles, and whether supplemental flood coverage may be necessary — particularly for properties near the Waccamaw River or Lake Waccamaw.',
        'The Columbus County housing market includes a mix of established single-family homes, rural properties, and newer construction. Each property type carries different insurance considerations. Older homes may require specialized coverage for outdated wiring or plumbing, while new construction benefits from builder\'s risk policies during the building phase.',
        'For local business owners — including those in agriculture, retail, and the growing service sector — commercial insurance is not optional. General liability, commercial property, and workers\' compensation coverage protect against the risks that come with operating in a tight-knit community where reputation matters.',
      ],
    },
    whyChoose: [
      { title: 'Local Office, Local Knowledge', description: 'Our Whiteville office means you can meet face-to-face with a licensed agent who knows Columbus County. We understand local building codes, flood zones, and the specific risks that affect property owners in this area.' },
      { title: 'Independent & Unbiased', description: 'We are not tied to a single carrier. We compare policies from over 20 insurance companies to find you the best combination of coverage and price — something a captive agent simply cannot do.' },
      { title: 'Full-Service Coverage', description: 'From homeowners and auto to commercial general liability and rental property insurance, our Whiteville team handles every line of coverage under one roof. One agency, one relationship, complete protection.' },
      { title: 'Claims Support When It Counts', description: 'When you need to file a claim, our team is here to guide you through the process. We advocate on your behalf and help ensure your claim is handled fairly and promptly.' },
    ],
    propertyOwnerHeading: 'Property Insurance for Columbus County Owners',
    propertyOwnerContent: [
      'Columbus County has seen steady interest from investors purchasing rental properties and vacation homes near Lake Waccamaw. Whether you own a long-term rental in Whiteville, a short-term vacation property near the lake, or a multi-unit dwelling, the right insurance coverage is essential to protecting your investment.',
      'Rental dwelling insurance differs significantly from a standard homeowners policy. It accounts for tenant occupancy, lost rental income during repairs, and liability exposure specific to landlords. Our agents can walk you through the differences and build a policy that matches your property portfolio.',
      'For property owners with vacant or unoccupied buildings — whether between tenants, under renovation, or awaiting sale — standard policies often exclude or limit coverage. We offer specialized vacant property insurance that fills these gaps.',
    ],
    guidanceHeading: 'Insurance Guidance for Whiteville Residents',
    guidanceItems: [
      { title: 'Choosing the Right Homeowners Coverage', description: 'Not all homeowners policies are equal. We help you understand dwelling limits, personal property coverage, liability protection, and additional living expenses so your policy matches your actual needs — not just the minimum required by your mortgage lender.' },
      { title: 'Protecting Your Business from Day One', description: 'Small businesses in Whiteville face risks ranging from customer injuries to property damage to employee claims. A business owners package (BOP) bundles essential coverages at a competitive rate, while standalone policies provide flexibility for specialized operations.' },
      { title: 'Understanding Flood Insurance Options', description: 'Standard homeowners policies do not cover flood damage. For properties in or near flood zones in Columbus County, we can help you evaluate National Flood Insurance Program (NFIP) options and private flood insurance alternatives.' },
    ],
    surroundingAreas: ['Tabor City', 'Chadbourn', 'Fair Bluff', 'Lake Waccamaw', 'Clarkton', 'Bladenboro', 'Bolton', 'Cerro Gordo'],
  },
  {
    slug: 'greenville-nc',
    city: 'Greenville',
    state: 'North Carolina',
    stateAbbr: 'NC',
    seoTitle: 'Insurance Agency in Greenville, NC — Home, Auto & Business Coverage',
    seoDescription: 'BlackArrow Insurance is an independent insurance broker in Greenville, NC. Compare home, auto, rental, and commercial insurance from 20+ carriers. Request a free quote.',
    heroHeading: 'Insurance Agency in Greenville, NC',
    heroDescription: 'BlackArrow Insurance has been a trusted insurance partner in Greenville and Pitt County for over 20 years. We provide personalized insurance solutions for homeowners, renters, property investors, and businesses across the region.',
    aboutHeading: 'Serving the Greenville Community Since 2002',
    aboutContent: [
      'BlackArrow Insurance was founded in Greenville, North Carolina, in 2002. What started as a small independent agency has grown into one of the most established insurance brokerages in Pitt County, serving thousands of clients across Eastern North Carolina.',
      'Greenville is the economic and cultural hub of Eastern North Carolina, anchored by East Carolina University and Vidant Medical Center (now ECU Health). The city\'s population growth, expanding medical district, and thriving small business community create diverse insurance needs that require local expertise to navigate effectively.',
      'Our Greenville office is staffed by licensed agents who live and work in this community. They understand the local real estate market, the unique risks of the region, and the coverage requirements that matter most to Greenville residents and business owners.',
    ],
    localInsights: {
      heading: 'Insurance Considerations for Greenville Residents',
      content: [
        'Greenville\'s location in Eastern North Carolina places it in a region susceptible to hurricanes, tropical storms, and inland flooding. The Tar River runs through the area, and flooding has historically affected neighborhoods and businesses near the river basin. Homeowners should evaluate whether their standard policy provides adequate wind coverage and whether supplemental flood insurance is warranted.',
        'The Greenville housing market is dynamic, with steady growth driven by the university and healthcare sectors. Neighborhoods range from historic homes near the Uptown district to newer developments in Winterville and south Greenville. Each area presents different coverage considerations — older homes may need specialized endorsements, while newer construction typically qualifies for lower premiums.',
        'Greenville\'s robust rental market, fueled by the ECU student population, creates significant demand for rental property insurance. Landlords renting near campus or in the growing Uptown corridor need policies that address tenant turnover, liability exposure, and property damage risks that differ from owner-occupied homes.',
      ],
    },
    whyChoose: [
      { title: 'Founded Right Here in Greenville', description: 'BlackArrow Insurance started in Greenville in 2002. We are not a national chain parachuting into the market — we are your neighbors, and we have spent over two decades building relationships and expertise in this community.' },
      { title: 'Multi-Carrier Advantage', description: 'As an independent agency, we represent over 20 insurance carriers. This means we can shop your coverage across multiple companies to find the right policy at the most competitive rate — every time.' },
      { title: 'Specialized Rental Property Expertise', description: 'With Greenville\'s large rental market, we have developed deep expertise in rental dwelling insurance, short-term rental coverage, and landlord liability protection. If you own investment property in Pitt County, we can help.' },
      { title: 'Business Insurance for a Growing Market', description: 'From restaurants on Evans Street to medical practices near ECU Health, Greenville businesses rely on us for general liability, commercial property, workers\' compensation, and cyber liability coverage.' },
    ],
    propertyOwnerHeading: 'Coverage for Greenville Property Investors',
    propertyOwnerContent: [
      'Greenville\'s rental market is one of the most active in Eastern North Carolina. With approximately 30,000 ECU students and a growing population of young professionals, demand for rental housing remains strong. Property investors need insurance that goes beyond a basic landlord policy.',
      'Short-term rental coverage has become increasingly important as more Greenville property owners list homes on platforms like Airbnb and VRBO. These properties face unique risks — frequent guest turnover, higher liability exposure, and the potential for property damage — that standard rental dwelling policies do not adequately cover.',
      'For investors building new rental properties or renovating existing ones, builder\'s risk insurance provides critical protection during the construction phase. Once the project is complete, transitioning to the right rental or commercial property policy ensures continuous coverage without gaps.',
    ],
    guidanceHeading: 'Insurance Guidance for Greenville Residents',
    guidanceItems: [
      { title: 'Auto Insurance in a College Town', description: 'Greenville\'s traffic patterns shift with the academic calendar, and the mix of student and commuter drivers affects accident rates. We help you choose liability limits, uninsured motorist coverage, and comprehensive protection that account for local driving conditions.' },
      { title: 'Protecting Your Rental Investment', description: 'Owning rental property near ECU or in Greenville\'s expanding neighborhoods requires more than a standard homeowners policy. We build rental dwelling coverage that includes lost income protection, landlord liability, and property damage from tenant occupancy.' },
      { title: 'Commercial Insurance for Healthcare Professionals', description: 'Greenville\'s medical sector employs thousands. Medical practices, clinics, and healthcare-adjacent businesses need specialized coverage including professional liability, cyber liability for patient data, and commercial property insurance.' },
    ],
    surroundingAreas: ['Winterville', 'Ayden', 'Farmville', 'Bethel', 'Grimesland', 'Simpson', 'Stokes', 'Pactolus'],
  },
  {
    slug: 'wilmington-nc',
    city: 'Wilmington',
    state: 'North Carolina',
    stateAbbr: 'NC',
    seoTitle: 'Insurance Agency in Wilmington, NC — Coastal Home, Auto & Business',
    seoDescription: 'Independent insurance broker in Wilmington, NC. BlackArrow Insurance compares home, auto, flood, commercial, and property insurance from 20+ carriers. Get your free quote.',
    heroHeading: 'Insurance Agency in Wilmington, NC',
    heroDescription: 'BlackArrow Insurance serves homeowners, property investors, and businesses across the Wilmington metro and New Hanover County. As an independent brokerage, we compare coverage from 20+ carriers to help you navigate the unique insurance challenges of coastal North Carolina.',
    aboutHeading: 'Independent Insurance Expertise for Coastal NC',
    aboutContent: [
      'BlackArrow Insurance provides comprehensive insurance services to clients throughout the Wilmington metropolitan area, including Wrightsville Beach, Carolina Beach, Leland, and surrounding communities in New Hanover, Brunswick, and Pender counties.',
      'Wilmington is one of the fastest-growing cities in North Carolina, and with that growth comes evolving insurance needs. The city\'s coastal location creates specific risk factors — hurricane exposure, storm surge potential, and flood zones — that require knowledgeable guidance from an agent who understands the local landscape.',
      'Our team works with Wilmington clients remotely and in person to provide the same attentive, consultative service that has defined BlackArrow Insurance since 2002. Whether you are purchasing your first home on the coast, managing a portfolio of beach rental properties, or growing a business in the Port City, we have the carrier relationships and local expertise to build the right coverage.',
    ],
    localInsights: {
      heading: 'Coastal Insurance Considerations for Wilmington',
      content: [
        'Wilmington\'s position on the southeastern North Carolina coast makes it one of the most hurricane-exposed cities in the state. Hurricane Florence in 2018 caused billions in damage across the region, underscoring the importance of adequate wind, flood, and property coverage. Homeowners in New Hanover County should pay close attention to wind and hail deductibles, which are often percentage-based rather than flat amounts in coastal zones.',
        'Flood insurance is a critical consideration for Wilmington property owners. Many areas — particularly near the Cape Fear River, Intracoastal Waterway, and beachfront communities — fall within FEMA-designated flood zones. Even properties outside mapped flood zones can experience flooding during major storm events, making flood coverage a wise investment regardless of whether it is required by a mortgage lender.',
        'The Wilmington market also presents unique challenges for homeowners insurance. Coastal properties often require wind and hail coverage through the North Carolina Insurance Underwriting Association (the "Beach Plan") or specialized carriers that operate in high-wind zones. Navigating these options requires an agent familiar with the coastal insurance landscape.',
      ],
    },
    whyChoose: [
      { title: 'Coastal Coverage Specialists', description: 'We understand the complexities of insuring coastal properties — wind pools, flood zones, percentage deductibles, and Beach Plan requirements. Our team navigates these challenges daily on behalf of Wilmington clients.' },
      { title: '20+ Carriers, One Advisor', description: 'Rather than being limited to a single company\'s products, we compare options across more than 20 carriers to find you the strongest coverage at the most competitive rate. This is especially valuable in a coastal market where pricing varies significantly.' },
      { title: 'Investment Property Expertise', description: 'Wilmington\'s vacation rental market is booming. From Wrightsville Beach condos to Carolina Beach cottages, we specialize in short-term rental insurance, landlord coverage, and portfolio property protection for coastal investors.' },
      { title: 'Responsive Claims Guidance', description: 'After a storm, you need an advocate. Our team helps Wilmington clients navigate the claims process, understand their coverage, and work toward fair outcomes — especially important after major weather events.' },
    ],
    propertyOwnerHeading: 'Property Insurance for Coastal Investors',
    propertyOwnerContent: [
      'The Wilmington area is one of North Carolina\'s premier vacation rental markets. Properties on Wrightsville Beach, Carolina Beach, Kure Beach, and along the Intracoastal Waterway generate strong rental income — but they also carry elevated risk from storms, flooding, and guest liability.',
      'Short-term rental insurance for coastal properties needs to account for the higher replacement costs of beach construction, the increased liability from guest occupancy, and the wind and flood exposure unique to barrier island and waterfront properties. Standard inland policies simply do not provide adequate coverage for these situations.',
      'For property owners developing new coastal construction or renovating existing structures, builder\'s risk coverage protects your investment during the construction phase. Given Wilmington\'s building boom, this coverage is essential for anyone investing in new coastal real estate.',
    ],
    guidanceHeading: 'Insurance Guidance for Wilmington Residents',
    guidanceItems: [
      { title: 'Understanding Wind & Hail Deductibles', description: 'Coastal policies often carry separate wind and hail deductibles calculated as a percentage of your dwelling coverage — typically 1% to 5%. On a $400,000 home, a 2% wind deductible means $8,000 out of pocket before coverage applies. We help you understand these costs and explore options to manage them.' },
      { title: 'Navigating Flood Insurance Options', description: 'The NFIP provides a baseline of flood coverage, but private flood insurance markets have expanded significantly. In many cases, private policies offer higher limits and broader coverage at competitive rates. We compare both to find the right fit.' },
      { title: 'Insuring Your Coastal Business', description: 'Wilmington\'s economy spans tourism, film production, healthcare, technology, and maritime industries. Each sector carries unique risks. We build commercial insurance programs that address the specific exposures your business faces in the coastal market.' },
    ],
    surroundingAreas: ['Wrightsville Beach', 'Carolina Beach', 'Kure Beach', 'Leland', 'Hampstead', 'Porters Neck', 'Ogden', 'Monkey Junction', 'Castle Hayne'],
  },
  {
    slug: 'raleigh-nc',
    city: 'Raleigh',
    state: 'North Carolina',
    stateAbbr: 'NC',
    seoTitle: 'Insurance Agency in Raleigh, NC — Independent Broker for the Triangle',
    seoDescription: 'Independent insurance broker serving Raleigh, NC. BlackArrow Insurance compares home, auto, commercial, and property insurance from 20+ carriers. Request your free quote today.',
    heroHeading: 'Insurance Agency in Raleigh, NC',
    heroDescription: 'BlackArrow Insurance brings over 20 years of independent brokerage expertise to the Raleigh metro. We compare coverage from 20+ carriers to deliver personalized insurance solutions for homeowners, property investors, and businesses across the Triangle.',
    aboutHeading: 'Bringing Eastern NC Expertise to the Triangle',
    aboutContent: [
      'BlackArrow Insurance extends our independent insurance services to the Raleigh-Durham metropolitan area, bringing the same personalized, multi-carrier approach that has made us a trusted name in Eastern North Carolina since 2002.',
      'Raleigh is the state capital and one of the fastest-growing metro areas in the country. The Triangle\'s booming tech sector, world-class universities, and steady population influx create a competitive real estate market and diverse insurance landscape. Whether you are a first-time homebuyer in a new Wake County subdivision, a seasoned property investor, or a business owner in the Research Triangle, your insurance needs are unique.',
      'Our team serves Raleigh clients with the same hands-on approach we bring to every market we operate in. We take the time to understand your situation, compare options from our panel of 20+ carriers, and recommend coverage that fits your needs and budget — not a one-size-fits-all policy.',
    ],
    localInsights: {
      heading: 'Insurance Considerations for Raleigh Residents',
      content: [
        'The Raleigh housing market has experienced significant appreciation in recent years, driven by job growth in technology, healthcare, and education. Rising home values mean dwelling coverage limits need regular review to avoid being underinsured. Replacement cost estimates should account for current construction costs, which have risen alongside demand.',
        'While Raleigh is not on the coast, the region is not immune to severe weather. Tropical storm remnants, strong thunderstorms, and tornadoes can cause significant wind and hail damage. The April 2011 tornado outbreak caused widespread destruction across Wake County. Homeowners should verify that their wind and hail coverage is adequate and understand their deductible structure.',
        'Raleigh\'s growth has also fueled a robust rental market. With major employers like Red Hat, Cisco, and the state government attracting workers, plus three major universities nearby (NC State, UNC, Duke), demand for rental housing spans student apartments, single-family rentals, and luxury units. Property investors need insurance tailored to their rental strategy.',
      ],
    },
    whyChoose: [
      { title: 'Independent Advantage in a Competitive Market', description: 'Raleigh\'s insurance market is crowded. As an independent agency, we are not limited to a single carrier\'s products. We shop your coverage across 20+ companies to find the best value — giving you an edge that captive agents cannot match.' },
      { title: 'Property Investor Focus', description: 'Many of our Raleigh clients are property investors managing rental portfolios across Wake County. We build insurance programs that cover single-family rentals, multi-unit properties, short-term rentals, and properties under renovation.' },
      { title: 'Business Insurance for the Triangle', description: 'From tech startups in downtown Raleigh to established firms in Research Triangle Park, we provide commercial insurance that scales with your business — general liability, commercial property, cyber liability, workers\' compensation, and more.' },
      { title: 'Consistent Service, Proven Track Record', description: 'We have been doing this for over 20 years. Our longevity reflects our commitment to client service, transparent advice, and coverage that actually protects when you need it.' },
    ],
    propertyOwnerHeading: 'Coverage for Triangle Property Owners',
    propertyOwnerContent: [
      'Wake County is one of the most active real estate markets in the Southeast. Property investors are purchasing single-family homes, townhomes, and multi-family units across Raleigh, Cary, Apex, Holly Springs, and Fuquay-Varina. Each property in your portfolio needs coverage tailored to its use — owner-occupied, long-term rental, or short-term rental.',
      'Rental dwelling insurance for Raleigh properties should account for the area\'s high replacement costs, tenant liability exposure, and the potential for lost rental income during repairs. For short-term rental properties listed on platforms like Airbnb, specialized coverage addresses guest liability and higher turnover risk.',
      'Investors renovating properties — particularly in Raleigh\'s older neighborhoods like Oakwood, Boylan Heights, or Five Points — should consider builder\'s risk insurance during the renovation phase. Once renovations are complete, transitioning to the appropriate rental or homeowners policy ensures there are no coverage gaps.',
    ],
    guidanceHeading: 'Insurance Guidance for Raleigh Residents',
    guidanceItems: [
      { title: 'Reviewing Coverage as Home Values Rise', description: 'Raleigh\'s rapid appreciation means the home you bought five years ago may be significantly underinsured today. We conduct coverage reviews to ensure your dwelling limit reflects current replacement costs — not just your purchase price or last year\'s estimate.' },
      { title: 'Auto Insurance in a Growing Metro', description: 'More residents mean more traffic, more accidents, and more uninsured drivers on the road. We recommend liability limits and uninsured motorist coverage that reflect the realities of driving in a fast-growing metro area.' },
      { title: 'Cyber Liability for Triangle Businesses', description: 'Raleigh\'s concentration of technology and healthcare companies makes cyber liability insurance especially relevant. A data breach or ransomware attack can be devastating. We help Triangle businesses evaluate their cyber risk and build appropriate coverage.' },
    ],
    surroundingAreas: ['Cary', 'Apex', 'Holly Springs', 'Fuquay-Varina', 'Wake Forest', 'Garner', 'Knightdale', 'Durham', 'Chapel Hill'],
  },
]

export function getLocationBySlug(slug: string): LocationPage | undefined {
  return locationPages.find(p => p.slug === slug)
}

export const locationSlugs = locationPages.map(p => p.slug)
