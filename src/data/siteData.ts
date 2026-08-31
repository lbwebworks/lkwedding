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
      icon: string
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
      mapEmbedUrl: string
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
      church?: string[]
    }>
  }
  familyAndRelatives: {
    title: string
    names: string[]
  }
  peers: {
    title: string
    names: string[]
  }
  specialFood: string[]
  priorityGuests: {
    title: string
    foodCapacity: number
    hallCapacity: number
    couple: string[]
    secondarySponsorRoles: string[]
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
      icon: string
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
    weekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dayCells: [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
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
        icon: 'wi-arrival',
        title: 'Guest Arrival',
        note: 'Doors open at the church. Find your seats and enjoy the atmosphere as we prepare to begin.',
      },
      {
        time: '2:00 PM',
        icon: 'wi-rings',
        title: 'Wedding Ceremony',
        note: 'Iglesia Ni Cristo [Pampanga West] — Betis, Guagua, Pampanga. The exchange of vows and rings.',
      },
      {
        time: '3:15 PM',
        icon: 'wi-car',
        title: 'Travel to Reception',
        note: 'Casa Agustin Resort is a short drive away. Coordinators will be on hand to assist.',
      },
      {
        time: '3:30 PM',
        icon: 'wi-bloom',
        title: 'Reception Guest Arrival',
        note: 'Welcome to Casa Agustin Resort. Register at the entrance and be guided to your seat.',
      },
      {
        time: '4:00 PM',
        icon: 'wi-toast',
        title: 'Reception Program Begins',
        note: 'The celebration officially starts — toasts, messages, and the first moments as a married couple.',
      },
      {
        time: 'TBD',
        icon: 'wi-games',
        title: 'Games & Intermission',
        note: 'Fun activities and heartfelt messages from family and friends.',
      },
      {
        time: 'TBD',
        icon: 'wi-dinner',
        title: 'Dinner',
        note: 'Sit back and enjoy a shared meal together with your loved ones.',
      },
      {
        time: 'TBD',
        icon: 'wi-celebrate',
        title: 'Photo Moments',
        note: 'Capture memories that will last a lifetime.',
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
        query: 'Iglesia Ni Cristo [Pampanga West] - Guagua, Purok 1, Betis, Guagua, Pampanga 2003, Philippines',
        linkLabel: 'Open Church Map',
        mapEmbedUrl: 'https://www.google.com/maps?output=embed&q=14.9640171,120.6302814&z=17',
        mapUrl:
          'https://www.google.com/maps/place/Iglesia+Ni+Cristo+[Pampanga+West]+-+Guagua/@14.9678971,120.6275269,14.83z/data=!4m7!3m6!1s0x339658cfe88ebe85:0x51f20d9a0d9573dc!8m2!3d14.9640171!4d120.6302814!15sCllJZ2xlc2lhIE5pIENyaXN0byBbUGFtcGFuZ2EgV2VzdF0gLSBHdWFndWEsIFB1cm9rIDEsIEJldGlzLCBHdWFndWEsIFBhbXBhbmdhLCBQaGlsaXBwaW5lcyIDiAEBkgEQcGxhY2Vfb2Zfd29yc2hpcOABAA!16s/g/1thfbzm2?entry=ttu',
      },
      {
        title: 'Reception',
        query: 'Casa Agustin Resort, Guagua, Pampanga, Philippines',
        linkLabel: 'Open Reception Map',
        mapEmbedUrl: 'https://www.google.com/maps?output=embed&q=14.9726755,120.6372336&z=17',
        mapUrl:
          'https://www.google.com/maps/place/Casa+Agustin+Resort/@14.9725913,120.6372537,18.94z/data=!4m6!3m5!1s0x3396594ee33bce89:0x3c4c4e21af795a53!8m2!3d14.9726755!4d120.6372336!16s/g/11rwy72j87?entry=ttu',
      },
    ],
    mapLabel: 'View On Map',
    photoLabel: 'Venue Photo Placeholder',
  },
  saveTheDate: {
    title: 'Gallery',
    subtitle: 'A glimpse of our story and celebration',
    photos: [
      'Gallery 01',
      'Gallery 02',
      'Gallery 03',
      'Gallery 04',
      'Gallery 05',
      'Gallery 06',
      'Gallery 07',
      'Gallery 08',
    ],
  },
  rsvp: {
    title: 'RSVP',
    description:
      'Please respond so we can prepare seating, catering, and your best possible experience on our big day.',
    deadline: 'Please confirm your attendance on or before September 15, 2026.',
    buttonLabel: 'Open RSVP Form',
    buttonUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfauH9uhHz90QOeYDGblW21KUGaS-rM7_Mrw0s3ryMA8HT3cA/viewform?usp=publish-editor',
    buttonDisabled: false,
  },
  entourage: {
    title: 'Entourage',
    groups: [
      {
        title: "Groom's Parents",
        names: [
          'Alfredo Budaden',
          'Angelina Budaden',
        ],
      },
      {
        title: "Bride's Parents",
        names: [
          'Reynaldo Lacza',
          'Julieta Lacza',
        ],
      },
      {
        title: 'Principal Sponsors',
        names: [
          'Ermie Jaime',
          'Ronald Agbaya',
          'Bayani Marucot',
          'Morris Budaden',
          'Tristan Alcantara',
          '...',
          'Abel Dawey',
          'Remeo Jr. Dauzon',
          'Juanito Galangco',
          'Melchor Dawey',
          'Mark Budaden',
          'Dionisio Domingo',
          '...',
          '...',
        ],
        church: [
          'Ermie Jaime',
          'Ronald Agbaya',
          'Bayani Marucot',
          'Morris Budaden',
          'Tristan Alcantara',
        ],
      },
      {
        title: 'Principal Sponsors',
        names: [
          'Arlene Red',
          'Yolanda Dimla',
          'Anastasia Marucot',
          'Amelia Mapalo',
          'Elnora Luistro Reus',
          'Josephine Escovidal',
          'Cynthia Rojo',
          'Daisy Cortez',
          'Nena Budaden',
          'Francisca Dawey',
          'Elizabeth Budaden',
          'Cristeta Dawey',
          'Cerila Budaden',
          'Rebecca Balang',
        ],
        church: [
          'Arlene Red',
          'Yolanda Dimla',
          'Anastasia Marucot',
          'Amelia Mapalo',
          'Elnora Luistro Reus',
        ],
      },
      {
        title: 'Best Man',
        names: ['Alfred II Budaden'],
      },
      {
        title: 'Maid Of Honor',
        names: ['Krizel Jane Lockhart'],
      },
      {
        title: 'Groomsmen',
        names: [
          'Allan Budaden',
          'Frewell Budaden',
          'Eliezer Budaden',
          'Jonathan Budaden',
          'Gerald Lucero',
          'Rhenish Rhey Sabado',
          'John Reynold Villamar',
          'Ervin Garcia',
          'Jose Rafael Soriaga',
          'Christian Era Jaime',
          'Eagle Mark Jaime',
        ],
        church: [
          'Allan Budaden',
          'Frewell Budaden',
          'Eliezer Budaden',
          'Jonathan Budaden',
        ],
      },
      {
        title: 'Bridesmaids',
        names: [
          'Kristine Ayra Tropicales',
          'Angel Wisdom Tropicales',
          'Beta Joy Budaden',
          'Junemae Budaden',
          'Anna Joy Gonzales',
          'Coleen Keith Garcia',
          'Erin Eliza Yamanaka',
          'Rosette De Mesa',
          'Rosette Ramos',
          'Camille Shane Claveria',
          'Charlene Mae Claveria',
        ],
        church: [
          'Kristine Ayra Tropicales',
          'Angel Wisdom Tropicales',
          'Beta Joy Budaden',
          'Junemae Budaden',
        ],
      },
      {
        title: 'Ring Bearers',
        names: [
          'Lex Jander Wacnang',
          'Nathaniel Budaden',
          'Calvin Wise Recio',
        ],
        church: ['Lex Jander Wacnang'],
      },
      {
        title: 'Flower Girls',
        names: [
          'Kristell Yvonne Tropicales',
          'Chloelie Mutya Budaden',
          'Juris Jamie B. Wacnang',
          'Nalla Budaden',
        ],
        church: ['Kristell Yvonne Tropicales'],
      },
    ],
  },
  familyAndRelatives: {
    title: 'Family and Relatives',
    names: [
      'Budaden, Athea',
      'Budaden, Jahaziel',
      'Budaden, Ralph',
      'Claveria, Charmaine',
      'Claveria, Ronald',
      'Claveria-Maniaga, Grace',
      'Delos Reyes, Josie',
      'Dimara, Natasha',
      'Dimara, Shania',
      'Dimla, Bong',
      'Galangco, Veronica',
      'Jaime, Norberta',
      'Lacza, Lourdes',
      'Razon, Charizel',
      'Razon, Denis',
      'Tropicales, Darell',
      'Vito, Althea',
      'Vito, Melanie',
    ],
  },
  peers: {
    title: 'Peers',
    names: [
      'Agbaya, Rosalie',
      'Alburo, Rhamie Jade',
      'Alburo, Rosette',
      'Andal, Venet',
      'Arenas, Bea',
      'Buenafe, Joseph',
      'Condez, Angelyn',
      'Delos Santos, Althea',
      'Endonela, Eunice',
      'Gatmaitan, Darryl',
      'Gimenez, Mark',
      'Jusay, Anna Joy',
      'Macalisang, Jackyloyd',
      'Mancenido, Vincent',
      'Manzanares, Alvin',
      'Montera, Jennica',
      'Masiglat, Alex Czar',
      'Red, Lavern',
    ],
  },
  specialFood: [
    'Chloelie Mutya Budaden',
    'Calvin Wise Recio',
    'Juris Jamie B. Wacnang',
    'Nalla Budaden',
  ],
  priorityGuests: {
    title: 'Guest Priority',
    foodCapacity: 100,
    hallCapacity: 150,
    couple: [
      'Lee Budaden',
      'Kish Lacza',
    ],
    secondarySponsorRoles: [
      'Best Man',
      'Maid Of Honor',
      'Groomsmen',
      'Bridesmaids',
      'Ring Bearers',
      'Flower Girls',
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
        icon: 'wi-car',
        question: 'Is parking available at the venue?',
        answer: [
          'Yes. Parking is available at the venue. Our coordinators will gladly assist you upon arrival.',
        ],
      },
      {
        icon: 'wi-clock',
        question: 'What time should I arrive?',
        answer: [
          'We recommend arriving 30 minutes before the ceremony to allow enough time for parking, registration, and seating.',
        ],
      },
      {
        icon: 'wi-hanger',
        question: 'Is there a dress code?',
        answer: [
          'Yes. We kindly invite our guests to wear semi-formal attire in shades of Dusty Blue. Please avoid wearing white.',
          'For the church ceremony, please refrain from wearing sleeveless, backless, or off-shoulder attire; these styles are welcome at the reception.',
        ],
      },
      {
        icon: 'wi-camera',
        question: 'Can I take photos or videos during the ceremony?',
        answer: [
          'We kindly ask everyone to refrain from taking photos or videos during the ceremony and allow our official photographers to capture these special moments.',
          "You're welcome to take photos before and after the ceremony.",
        ],
      },
      {
        icon: 'wi-seat',
        question: 'Can I sit anywhere during the reception?',
        answer: [
          "To help everyone have the best experience, we've carefully arranged the seating plan with family groups, friendships, and everyone's comfort in mind.",
          'Upon arrival, our coordinators will gladly assist you in finding your designated table and seat after registration.',
          'We kindly ask everyone to remain in their assigned seats throughout the program. Thank you for helping us make the celebration organized and enjoyable for everyone!',
        ],
      },
      {
        icon: 'wi-person-plus',
        question: 'May I bring a companion?',
        answer: [
          "You're welcome to ask! If you'd like to bring a companion who isn't included on our guest list, please contact us before the wedding or submit a companion request through the RSVP form.",
          "We'll do our best to accommodate approved companions based on our final reception arrangements. While approved companions are welcome to enjoy the resort, reception seating, meals, and refreshments are reserved for our confirmed guests.",
        ],
      },
      {
        icon: 'wi-envelope',
        question: 'How do I RSVP?',
        answer: [
          'Please submit one RSVP per invitation using the RSVP form on this website.',
          'If your invitation includes multiple guests, kindly confirm everyone included in your invitation using the same form.',
          "After the RSVP deadline, we'll finalize our guest list, seating arrangements, and companion requests. If you've requested approval for a companion, we'll get in touch with you once we've completed our final arrangements.",
        ],
      },
    ],
  },
  footer: {
    line: 'We look forward to your presence',
    names: 'Lee & Kish',
  },
}
