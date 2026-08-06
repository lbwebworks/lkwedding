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
    locations: Array<{
      title: string
      query: string
      linkLabel: string
      mapUrl: string
    }>
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
      answer: string[]
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
    locations: [
      {
        title: 'Church',
        query: 'Iglesia Ni Cristo [Pampanga West] - Guagua, Purok 1, Betis, Guagua, Pampanga, Philippines',
        linkLabel: 'Open Church Map',
        mapUrl: 'https://maps.app.goo.gl/Xt4SoRauhdvY3Xra8',
      },
      {
        title: 'Reception',
        query: 'Casa Agustin Resort, Guagua, Pampanga, Philippines',
        linkLabel: 'Open Reception Map',
        mapUrl: 'https://maps.app.goo.gl/REeGgoan8pzyj46K8',
      },
    ],
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
        names: ['Alfredo Budaden', 'Angelina Budaden'],
      },
      {
        title: 'Parents Of The Bride',
        names: ['Reynaldo Lacza', 'Julieta Lacza'],
      },
      {
        title: 'Male Principal Sponsors',
        names: ['Ermie Jaime', 'Ronald Agbaya', 'Bayani Marucot', 'Morris Budaden', 'Tristan Francis DC Alcantara'],
      },
      {
        title: 'Female Principal Sponsors',
        names: ['Arlene Red', 'Yolanda Dimla', 'Anastasia Marucot', 'Amelia Mapalo', 'Elnora Luistro Reus'],
      },
      {
        title: 'Best Man',
        names: ['Alfredo Budaden'],
      },
      {
        title: 'Maid Of Honor',
        names: ['Krizel Jane Lockhart'],
      },
      {
        title: 'Groomsmen',
        names: ['Allan Budaden', 'Frewell Budaden', 'Eliezer Budaden', 'Jonathan Budaden', 'Gerald Lucero', 'Rhenish Rhey Sabado', 'John Reynold Villamar', 'Ervin Garcia', 'Jose Rafael Soriaga', 'Jeffrey Lumapag', 'Christian Era Jaime', 'Eagle Mark Jaime'],
      },
      {
        title: 'Bridesmaids',
        names: ['Kristine Ayra Tropicales', 'Angel Wisdom Tropicales', 'Beta Joy Budaden', 'Junemae Budaden', 'Claudine Faye Claveria', 'Charlene Mae Claveria', 'Camille Shane Claveria', 'Rosette De Mesa', 'Rosette Ramos', 'Anna Joy Gonzales', 'Coleen Keith Garcia', 'Erin Eliza Yamanaka'],
      },
    ],
  },
  details: {
    title: 'Details',
    items: [
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
        question: '🚗 Is parking available at the venue?',
        answer: [
          'Yes. There is ample parking available at the venue for all our guests.',
          'Our coordinators and venue staff will also be there to assist if needed.',
        ],
      },
      {
        question: '👥 May I bring a "Plus One"?',
        answer: [
          "As much as we'd love to celebrate with everyone, we have carefully planned our guest list due to venue capacity.",
          'Kindly refer to your invitation to see the number of seats reserved for you.',
          'We respectfully ask that only those whose names appear on our guest list attend the celebration. We truly appreciate your understanding and cooperation.',
        ],
      },
      {
        question: '📸 Can I take photos or videos during the ceremony?',
        answer: [
          'We kindly ask everyone to keep our wedding ceremony unplugged and camera-free.',
          'Please allow our professional photographers and videographers to capture these once-in-a-lifetime moments while you simply enjoy being present with us.',
          "Don't worry - our reception is the perfect time to take all the photos and videos you'd like!",
          "We can't wait to celebrate and make memories with all of you. Don't forget to share your photos using our official hashtags: #ExclusiveLEEforKISH #ALoveLEEKiSH #FinalLEEmayKISHtheBride",
        ],
      },
      {
        question: '🪑 Can I sit anywhere during the reception?',
        answer: [
          "To help everyone have the best experience, we've carefully arranged the seating plan with family groups, friendships, and everyone's comfort in mind.",
          'Upon arrival, our coordinators will gladly assist you in finding your designated table and seat after registration.',
          'We kindly ask everyone to remain in their assigned seats throughout the program. Thank you for helping us make the celebration organized and enjoyable for everyone!',
        ],
      },
      {
        question: '⏰ What time should I arrive?',
        answer: [
          'We recommend arriving 30 minutes before the ceremony to allow enough time for registration and seating.',
          'We would love for everyone to be seated before the bridal procession begins.',
        ],
      },
      {
        question: '👗 Is there a dress code?',
        answer: [
          'Yes! We kindly request our guests to wear semi-formal attire in shades of dusty blue to complement our wedding motif.',
          'We also ask everyone to avoid wearing white, ivory, or cream.',
          'Thank you for helping us make our special day even more beautiful! 💙',
        ],
      },
    ],
  },
  footer: {
    line: 'We look forward to your presence',
    names: 'Lee & Kish',
  },
}
