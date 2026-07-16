export type DetailItem = {
  title: string
  lines: string[]
  mapUrl?: string
  mapLabel?: string
}

export type SiteData = {
  hero: {
    eyebrow: string
    title: string
    date: string
    intro: string
    ctaLabel: string
  }
  details: DetailItem[]
  story: {
    title: string
    paragraphs: string[]
  }
  gallery: {
    title: string
    items: string[]
  }
  rsvp: {
    title: string
    description: string
    buttonLabel: string
    buttonUrl: string
    buttonDisabled: boolean
  }
}

export const siteData: SiteData = {
  hero: {
    eyebrow: 'Wedding Invitation',
    title: 'Lee & Kish',
    date: 'September 20, 2026',
    intro:
      'We are excited to celebrate our love with the people who matter most. Please join us for our wedding day.',
    ctaLabel: 'RSVP Now',
  },
  details: [
    {
      title: 'Ceremony',
      lines: ['Iglesia Ni Cristo [Pampanga West] - Guagua'],
      mapUrl: 'https://maps.app.goo.gl/WDoNSbHdzsEnU5Kb8',
      mapLabel: 'Open church map',
    },
    {
      title: 'Reception',
      lines: ['Casa Agustin Resort, Purok 1, Betis, Guagua, Pampanga, 2003'],
      mapUrl: 'https://maps.app.goo.gl/REeGgoan8pzyj46K8',
      mapLabel: 'Open venue map',
    },
    {
      title: 'Attire & Motif',
      lines: ['Formal/Casual Attire', 'Motif: Dusty Blue'],
    },
  ],
  story: {
    title: 'Our Story',
    paragraphs: [
      'It started with a simple Instagram collaboration and a coffee meetup that felt ordinary at first, until it became the beginning of something far bigger. From casual conversations, Lee and Kish slowly turned into each other\'s favorite person and eventually into travel buddies chasing new places and new memories.',
      'Their journey was not all smooth roads. Distance, misunderstandings, and difficult seasons tested them more than once. There were moments when silence felt heavy, when timing was uncertain, and when giving up could have been easier. But they chose to stay. Through chats, late-night video calls, and patient hearts, they kept showing up for each other.',
      'Then came a series of firsts: first hike, first cave adventure, first beach escape, and first visits to each other\'s hometowns where families and friends became part of their growing world. Each chapter deepened their bond and quietly prepared them for what they did not see coming.',
      'In Baler, Aurora, under a bright sky with only a few people around, Kish thought they were only filming a short reel. The camera rolled, the moment felt routine, and then suddenly everything changed. Lee revealed a ring. Shock turned into tears, and an ordinary day became the day they would remember forever.',
      'Today, they stand stronger than ever, grateful for every challenge they overcame and every lesson that shaped them. As they prepare the final details for their wedding, they look forward to celebrating this new beginning with everyone they love.',
    ],
  },
  gallery: {
    title: 'Photo Highlights',
    items: ['Prenup 01', 'Prenup 02', 'Highlight 01', 'Highlight 02'],
  },
  rsvp: {
    title: 'RSVP',
    description:
      'RSVP form integration is ready for Google Forms. We can connect it in the next step.',
    buttonLabel: 'Google Form Link Placeholder',
    buttonUrl: '#',
    buttonDisabled: true,
  },
}
