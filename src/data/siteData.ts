export type SiteData = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    date: string
    weddingDateISO: string
    intro: string
    ctaLabel: string
  }
  calendar: {
    month: string
    weekDays: string[]
    dayCells: Array<number | null>
    highlightDay: number
  }
  story: {
    title: string
    chapters: Array<{
      title: string
      body: string
      imageLabel: string
    }>
  }
  program: {
    title: string
    items: Array<{
      time: string
      title: string
      note: string
    }>
  }
  dressCode: {
    title: string
    summary: string
    sections: Array<{
      title: string
      palette: string[]
      note: string
      samples: string[]
    }>
  }
  venue: {
    title: string
    subtitle: string
    name: string
    address: string
    mapUrl: string
    mapLabel: string
    photoLabel: string
  }
  saveTheDate: {
    title: string
    subtitle: string
    photos: string[]
  }
  rsvp: {
    title: string
    description: string
    deadline: string
    buttonLabel: string
    buttonUrl: string
    buttonDisabled: boolean
  }
  entourage: {
    title: string
    groups: Array<{
      title: string
      names: string[]
    }>
  }
  details: {
    title: string
    items: Array<{
      title: string
      description: string
    }>
  }
  contacts: {
    title: string
    items: Array<{
      role: string
      name: string
      phone: string
    }>
  }
  faqs: {
    title: string
    items: Array<{
      question: string
      answer: string
    }>
  }
  footer: {
    line: string
    names: string
  }
}

export const siteData: SiteData = {
  hero: {
    eyebrow: 'Wedding Invitation',
    title: 'Lee & Kish',
    subtitle: 'The honour of your presence is requested',
    date: 'September 20, 2026',
    weddingDateISO: '2026-09-20T00:00:00+08:00',
    intro:
      'We are excited to celebrate our love with the people who matter most. Please join us for our wedding day.',
    ctaLabel: 'RSVP Now',
  },
  calendar: {
    month: 'September 2026',
    weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    dayCells: [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    highlightDay: 20,
  },
  story: {
    title: 'Our Story',
    chapters: [
      {
        title: 'A Formal Introduction',
        body:
          'Lee and Kish first crossed paths through an Instagram collaboration that led to a simple coffee meetup. What looked like a normal content day quietly became the first page of something meaningful.',
        imageLabel: 'Story Photo 01',
      },
      {
        title: 'Distance And Devotion',
        body:
          'From city dates to long-distance seasons, they navigated misunderstandings, time gaps, and the weight of waiting. They stayed connected through late chats and video calls, choosing each other again and again.',
        imageLabel: 'Story Photo 02',
      },
      {
        title: 'The Proposal',
        body:
          'In Baler, Aurora, Kish thought they were filming a short reel under bright skies and a calm crowd. Then the script changed: Lee revealed a ring, and the day became unforgettable.',
        imageLabel: 'Story Photo 03',
      },
    ],
  },
  program: {
    title: 'Program Flow',
    items: [
      {
        time: '1:30 PM',
        title: 'Guest Arrival',
        note: 'Welcome and seat guidance',
      },
      {
        time: '2:00 PM',
        title: 'Wedding Ceremony',
        note: 'Iglesia Ni Cristo [Pampanga West] - Guagua',
      },
      {
        time: '5:00 PM',
        title: 'Reception Proper',
        note: 'Casa Agustin Resort',
      },
      {
        time: '6:30 PM',
        title: 'Dinner And Toasts',
        note: 'Family and friends program',
      },
      {
        time: '8:00 PM',
        title: 'Celebration',
        note: 'Dance and photo moments',
      },
    ],
  },
  dressCode: {
    title: 'Dress Code',
    summary: 'Formal/Casual attire with a Dusty Blue motif. Please avoid loud neon tones.',
    sections: [
      {
        title: 'Ladies',
        palette: ['#2f3f52', '#6f87a3', '#9fb5cb', '#d4e2f0'],
        note: 'Floor-length or midi dresses in elegant cuts are encouraged.',
        samples: ['Ladies Look 01', 'Ladies Look 02', 'Ladies Look 03'],
      },
      {
        title: 'Gentlemen',
        palette: ['#253445', '#4f6a87', '#7d98b4', '#cfdeed'],
        note: 'Long sleeves, polos, or suit sets in clean tones are encouraged.',
        samples: ['Gentlemen Look 01', 'Gentlemen Look 02', 'Gentlemen Look 03'],
      },
    ],
  },
  venue: {
    title: 'Venue',
    subtitle: 'Ceremony And Reception',
    name: 'Iglesia Ni Cristo [Pampanga West] - Guagua / Casa Agustin Resort',
    address: 'Purok 1, Betis, Guagua, Pampanga, 2003',
    mapUrl: 'https://maps.app.goo.gl/REeGgoan8pzyj46K8',
    mapLabel: 'View On Map',
    photoLabel: 'Venue Photo Placeholder',
  },
  saveTheDate: {
    title: 'Save The Date',
    subtitle: 'We cannot wait to celebrate with you',
    photos: [
      'Save Date 01',
      'Save Date 02',
      'Save Date 03',
      'Save Date 04',
      'Save Date 05',
      'Save Date 06',
      'Save Date 07',
      'Save Date 08',
    ],
  },
  rsvp: {
    title: 'RSVP',
    description:
      'Please respond so we can prepare seating, catering, and your best possible experience on our big day.',
    deadline: 'Please confirm your attendance before September 5, 2026.',
    buttonLabel: 'Google Form Link Placeholder',
    buttonUrl: '#',
    buttonDisabled: true,
  },
  entourage: {
    title: 'Entourage',
    groups: [
      {
        title: 'Parents Of The Groom',
        names: ['Name Placeholder 1', 'Name Placeholder 2'],
      },
      {
        title: 'Parents Of The Bride',
        names: ['Name Placeholder 1', 'Name Placeholder 2'],
      },
      {
        title: 'Best Man',
        names: ['Name Placeholder'],
      },
      {
        title: 'Maid Of Honor',
        names: ['Name Placeholder'],
      },
      {
        title: 'Groomsmen',
        names: ['Name Placeholder 1', 'Name Placeholder 2', 'Name Placeholder 3'],
      },
      {
        title: 'Bridesmaids',
        names: ['Name Placeholder 1', 'Name Placeholder 2', 'Name Placeholder 3'],
      },
    ],
  },
  details: {
    title: 'Details',
    items: [
      {
        title: 'Attire',
        description: 'Formal/Casual Attire. Motif: Dusty Blue.',
      },
      {
        title: 'Parking',
        description: 'Please arrive early to secure parking and avoid delays.',
      },
      {
        title: 'Gift Note',
        description: 'Your presence and prayers are the greatest gift to us.',
      },
    ],
  },
  contacts: {
    title: 'Contacts',
    items: [
      {
        role: 'Coordination',
        name: 'Contact Person Placeholder',
        phone: '+63 9XX XXX XXXX',
      },
      {
        role: 'Logistics',
        name: 'Contact Person Placeholder',
        phone: '+63 9XX XXX XXXX',
      },
    ],
  },
  faqs: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Is the dress code strictly required?',
        answer: 'Yes, we kindly request guests to follow the motif and formal/casual guidance.',
      },
      {
        question: 'Can I bring a plus one?',
        answer: 'Please refer to your invitation details and RSVP form for guest count allowance.',
      },
      {
        question: 'What time should I arrive?',
        answer: 'Please arrive at least 30 minutes before the ceremony starts.',
      },
      {
        question: 'Where can I confirm attendance?',
        answer: 'You can confirm through our RSVP form once the link is published.',
      },
    ],
  },
  footer: {
    line: 'We look forward to your presence',
    names: 'Lee & Kish',
  },
}
