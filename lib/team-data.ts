export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  imagePosition?: string;
  isLeadership: boolean;
}

export interface Office {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours: string;
  closed: string;
  image: string;
  imageAlt: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Scott Baldwin',
    role: 'Co-Owner',
    bio: 'Founded BlackArrow in 2002, originally called Iventure, and has since built it into the largest insurance agency in Greenville, NC, with expansion to Whiteville. Scott\'s vision and leadership have driven the company\'s growth and commitment to client service.',
    image: '/images/staff/scott-baldwin.jpg',
    imagePosition: 'center 32%',
    isLeadership: true,
  },
  {
    name: 'Perry Friend',
    role: 'Co-Owner / Broker',
    bio: 'Perry brings extensive mortgage industry experience to BlackArrow, where he met Scott and Russell. He focuses on finding the right coverage solutions for clients and enjoys family time, his son\'s sports events, and church activities.',
    image: '/images/staff/perry-friend.png',
    imagePosition: 'center 24%',
    isLeadership: true,
  },
  {
    name: 'Russell Smith',
    role: 'Co-Owner',
    bio: 'With over 30 years in mortgage lending, Russell emphasizes three core principles: Communication, Execution, and Relationships. He is passionate about helping clients achieve their financial goals through the right insurance protection.',
    image: '/images/staff/russell-smith.jpg',
    imagePosition: 'center 18%',
    isLeadership: true,
  },
  {
    name: 'Jenny Nealey',
    role: 'Licensed Agent (NC & SC)',
    bio: 'Jenny brings 24 years of customer service experience and over 17 years as a Property & Casualty agent. A Columbus County native, she is married with three sons and is active in her community through Sunday school and Boy Scouts.',
    image: '/images/staff/jenny-nealey.jpg',
    isLeadership: false,
  },
  {
    name: 'Adam Jernigan',
    role: 'Licensed Agent (NC & SC)',
    bio: 'Adam is a life insurance specialist based in the Whiteville, NC office. He is passionate about client education, ensuring every customer makes informed decisions about their insurance coverage.',
    image: '/images/staff/adam-jernigan.png',
    isLeadership: false,
  },
  {
    name: 'Taylor Sasser',
    role: 'Customer Service Representative',
    bio: 'Taylor brings 12 years of state service experience to BlackArrow. She joined the insurance industry in 2022, specializing in life insurance and expanding into property and casualty coverage.',
    image: '/images/staff/taylor-sasser.png',
    isLeadership: false,
  },
  {
    name: 'Macelynn Hines',
    role: 'Customer Service Representative',
    bio: 'Macelynn is a proud mother who prioritizes family time and faith. She is a beach enthusiast committed to an active lifestyle and providing excellent customer service.',
    image: '/images/staff/macelynn-hines.png',
    isLeadership: false,
  },
  {
    name: 'Autumn Hensley',
    role: 'Customer Service Representative',
    bio: 'Autumn is part of the BlackArrow Insurance team, supporting clients with responsive service and day-to-day account assistance.',
    image: '/images/staff/autumn-hensley.JPG',
    imagePosition: 'center 18%',
    isLeadership: false,
  },
  {
    name: 'Stone Baldwin',
    role: 'IT Management',
    bio: 'A technology enthusiast since age 12, Stone graduated from UNC Wilmington in 2022 with a degree in Management Information Systems. He is active in sports and church, and manages BlackArrow\'s technology infrastructure.',
    image: '/images/staff/stone-baldwin.jpg',
    isLeadership: false,
  },
];

export const offices: Office[] = [
  {
    name: 'Greenville Office',
    address: '905 Conference Dr. 2B',
    city: 'Greenville',
    state: 'NC',
    zip: '27858',
    phone: '(252) 955-5898',
    email: 'service@blackarrowfg.com',
    hours: 'Monday–Friday 9:00am–5:30pm',
    closed: 'Saturday–Sunday Closed',
    image: '/images/blackarrow_greenville.webp',
    imageAlt: 'BlackArrow Insurance Greenville office exterior',
  },
  {
    name: 'Whiteville Office',
    address: '301 Liberty St. Ste 101',
    city: 'Whiteville',
    state: 'NC',
    zip: '28472',
    phone: '(910) 914-6074',
    email: 'service@blackarrowfg.com',
    hours: 'Monday–Friday 9:00am–5:00pm',
    closed: 'Saturday–Sunday Closed',
    image: '/images/blackarrow-whiteville.jpg',
    imageAlt: 'BlackArrow Insurance Whiteville office exterior',
  },
];
