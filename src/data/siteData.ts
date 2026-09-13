export type Relationship =
  | 'Groom'
  | 'Bride'
  | 'Best Man'
  | 'Maid Of Honor'
  | 'Parent'
  | 'Ninong'
  | 'Ninang'
  | 'Groomsmen'
  | 'Bridesmaid'
  | 'Ring Bearer'
  | 'Flower Girl'
  | 'Relative'
  | 'Coworker'
  | 'Friend'
  | 'Companion'

export type Roster = {
  Id: string
  LastName: string
  FirstName: string
  Relationship: Relationship
  Side: 'Groom' | 'Bride' | ''
  IsChurchPriority: boolean
  IsFoodSpecial: boolean
  IsFoodPackage: boolean
  WillAttend: boolean
  CompanionOf: string | null
}

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
  directions: {
    title: string
    sectionTitle: string
    groups: Array<{
      title: string
      routes: Array<{
        label: string
        url: string
        mapImageAlt: string
        image: string
      }>
    }>
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
  // rosters holds everyone (attending + not attending). groups hold the ordering
  // per bucket; array position is the priority — no separate priority number.
  // foodPackage may contain null entries for vacant slots (whose number is not
  // occupied).
  rosters: Roster[]
  groups: {
    foodPackage: (string | null)[]
    extraPackage: string[]
    special: string[]
    others: string[]
    notAttending: string[]
  }
  priorityFood: {
    Groom: number
    Bride: number
  }
  prioritySeating: {
    Groom: number
    Bride: number
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
        note: 'Iglesia Ni Cristo [Pampanga West] â€” Betis, Guagua, Pampanga. The exchange of vows and rings.',
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
        note: 'The celebration officially starts â€” toasts, messages, and the first moments as a married couple.',
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
  directions: {
    title: 'Directions',
    sectionTitle: 'Getting There',
    groups: [
      {
        title: 'From South to Guagua',
        routes: [
          {
            label: 'NLEX Balintawak â†’ San Fernando Exit â†’ Casa Agustin Resort',
            url: 'https://maps.app.goo.gl/bHuGZcZV9Ayppgs3A',
            mapImageAlt: 'Route map: NLEX Balintawak to Casa Agustin Resort via San Fernando Exit',
            image: 'south_to_guagua1.PNG'
          },
          {
            label: 'NLEX Balintawak â†’ Pulilan Exit â†’ Baliwag â†’ Mexico â†’ Casa Agustin Resort (Alternative Route)',
            url: 'https://maps.app.goo.gl/ptCxkKh4h8qorkrx8',
            mapImageAlt: 'Route map: NLEX Balintawak to Casa Agustin Resort via Pulilan and Mexico (alternative route)',
            image: 'south_to_guagua2.PNG'
          },
        ],
      },
      {
        title: 'From North to San Agustin Resort',
        routes: [
          {
            label: 'SCTEX CLLEX â†’ NLEX â†’ San Fernando Exit â†’ Guagua',
            url: 'https://maps.app.goo.gl/CNWJkZv58zoM9itTA',
            mapImageAlt: 'Route map: SCTEX CLLEX Tarlac to Casa Agustin Resort via NLEX San Fernando Exit',
            image: 'north_to_guagua1.PNG'
          },
          {
            label: 'SCTEX CLLEX â†’ Porac Exit â†’ San Agustin Resort',
            url: 'https://maps.app.goo.gl/BiZPHh2kihxgyTam8',
            mapImageAlt: 'Route map: SCTEX CLLEX Tarlac to Casa Agustin Resort via Porac Exit',
            image: 'north_to_guagua2.PNG'
          },
        ],
      },
    ],
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
  rosters: [],
  groups: {
    foodPackage: [],
    extraPackage: [],
    special: [],
    others: [],
    notAttending: [],
  },
  priorityFood: {
    Groom: 50,
    Bride: 50,
  },
  prioritySeating: {
    Groom: 75,
    Bride: 75,
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

// Paste the exported "rosters" array here directly to update (same shape as Roster).
const rosters: Roster[] = [
    { Id: "001", LastName: "Budaden", FirstName: "Lee", Relationship: "Groom", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "002", LastName: "Lacza", FirstName: "Kish", Relationship: "Bride", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "003", LastName: "Budaden", FirstName: "Alfredo", Relationship: "Parent", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "004", LastName: "Budaden", FirstName: "Angelina", Relationship: "Parent", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "005", LastName: "Lacza", FirstName: "Reynaldo", Relationship: "Parent", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "006", LastName: "Lacza", FirstName: "Julieta", Relationship: "Parent", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "007", LastName: "Budaden", FirstName: "Alfred II", Relationship: "Best Man", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "008", LastName: "Lockhart", FirstName: "Krizel Jane", Relationship: "Maid Of Honor", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "009", LastName: "Jaime", FirstName: "Ermie", Relationship: "Ninong", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "010", LastName: "Agbaya", FirstName: "Ronald", Relationship: "Ninong", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "011", LastName: "Marucot", FirstName: "Bayani", Relationship: "Ninong", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "012", LastName: "Budaden", FirstName: "Morris", Relationship: "Ninong", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "013", LastName: "Alcantara", FirstName: "Tristan", Relationship: "Ninong", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "014", LastName: "Dawey", FirstName: "Abel", Relationship: "Ninong", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "015", LastName: "Dauzon", FirstName: "Remeo Jr.", Relationship: "Ninong", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "016", LastName: "Galangco", FirstName: "Juanito", Relationship: "Ninong", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "017", LastName: "Dawey", FirstName: "Melchor", Relationship: "Ninong", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "018", LastName: "Budaden", FirstName: "Mark", Relationship: "Ninong", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "019", LastName: "Domingo", FirstName: "Dionisio", Relationship: "Ninong", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "020", LastName: "Red", FirstName: "Arlene", Relationship: "Ninang", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "021", LastName: "Dimla", FirstName: "Yolanda", Relationship: "Ninang", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "022", LastName: "Marucot", FirstName: "Anastasia", Relationship: "Ninang", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "023", LastName: "Mapalo", FirstName: "Amelia", Relationship: "Ninang", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "024", LastName: "Reus", FirstName: "Elnora Luistro", Relationship: "Ninang", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "025", LastName: "Escovidal", FirstName: "Josephine", Relationship: "Ninang", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "026", LastName: "Rojo", FirstName: "Cynthia", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "027", LastName: "Cortez", FirstName: "Daisy", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "028", LastName: "Budaden", FirstName: "Nena", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "029", LastName: "Dawey", FirstName: "Francisca", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "030", LastName: "Budaden", FirstName: "Elizabeth", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "031", LastName: "Dawey", FirstName: "Cristeta", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "032", LastName: "Budaden", FirstName: "Cerila", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "033", LastName: "Balang", FirstName: "Rebecca", Relationship: "Ninang", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "034", LastName: "Budaden", FirstName: "Allan", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "035", LastName: "Budaden", FirstName: "Frewell", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "036", LastName: "Budaden", FirstName: "Eliezer", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "037", LastName: "Budaden", FirstName: "Jonathan", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "038", LastName: "Lucero", FirstName: "Gerald", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "039", LastName: "Sabado", FirstName: "Rhenish Rhey", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "040", LastName: "Villamar", FirstName: "John Reynold", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "041", LastName: "Garcia", FirstName: "Ervin", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "042", LastName: "Soriaga", FirstName: "Jose Rafael", Relationship: "Groomsmen", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "043", LastName: "Jaime", FirstName: "Christian Era", Relationship: "Groomsmen", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "044", LastName: "Jaime", FirstName: "Eagle Mark", Relationship: "Groomsmen", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "045", LastName: "Tropicales", FirstName: "Kristine Ayra", Relationship: "Bridesmaid", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "046", LastName: "Tropicales", FirstName: "Angel Wisdom", Relationship: "Bridesmaid", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "047", LastName: "Budaden", FirstName: "Beta Joy", Relationship: "Bridesmaid", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "048", LastName: "Budaden", FirstName: "Junemae", Relationship: "Bridesmaid", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "049", LastName: "Jusay", FirstName: "Anna Joy", Relationship: "Bridesmaid", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "050", LastName: "Garcia", FirstName: "Coleen Keith", Relationship: "Bridesmaid", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "051", LastName: "Yamanaka", FirstName: "Erin Eliza", Relationship: "Bridesmaid", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "053", LastName: "Ramos", FirstName: "Rosette", Relationship: "Bridesmaid", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "054", LastName: "Claveria", FirstName: "Camille Shane", Relationship: "Bridesmaid", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "055", LastName: "Claveria", FirstName: "Charlene Mae", Relationship: "Bridesmaid", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "056", LastName: "Wacnang", FirstName: "Lex Jander", Relationship: "Ring Bearer", Side: "Groom", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "057", LastName: "Budaden", FirstName: "Nathaniel", Relationship: "Ring Bearer", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "058", LastName: "Recio", FirstName: "Calvin Wise", Relationship: "Ring Bearer", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "059", LastName: "Tropicales", FirstName: "Kristell Yvonne", Relationship: "Flower Girl", Side: "Bride", IsChurchPriority: true, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "060", LastName: "Budaden", FirstName: "Chloelie Mutya", Relationship: "Flower Girl", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "061", LastName: "Wacnang", FirstName: "Juris Jamie B.", Relationship: "Flower Girl", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "062", LastName: "Budaden", FirstName: "Nalla", Relationship: "Flower Girl", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "063", LastName: "Budaden", FirstName: "Athea", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "132", LastName: "Abagat", FirstName: "Kayle", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "134", LastName: "Gregory", FirstName: "Ben", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "135", LastName: "Subebe", FirstName: "Maricris", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "137", LastName: "Rosales", FirstName: "Bryan", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "136", LastName: "Maranan", FirstName: "Kristine Mae", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "064", LastName: "Budaden", FirstName: "Grail", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "074", LastName: "Dimara", FirstName: "Natasha", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "065", LastName: "Budaden", FirstName: "Jahaziel", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "066", LastName: "Budaden", FirstName: "Jasmin", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "067", LastName: "Budaden", FirstName: "Jayvee", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "068", LastName: "Budaden", FirstName: "Morris Jr.", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "069", LastName: "Budaden", FirstName: "Ralph", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "070", LastName: "Claveria", FirstName: "Charmaine", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "071", LastName: "Claveria", FirstName: "Ronald", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "072", LastName: "Claveria-Maniaga", FirstName: "Grace", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "073", LastName: "Delos Reyes", FirstName: "Josie", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "075", LastName: "Dimara", FirstName: "Shania", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "076", LastName: "Dimla", FirstName: "Bong", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "077", LastName: "Galangco", FirstName: "Veronica", Relationship: "Relative", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "078", LastName: "Jaime", FirstName: "Norberta", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "079", LastName: "Lacza", FirstName: "Lourdes", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "080", LastName: "Razon", FirstName: "Charizel", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "081", LastName: "Razon", FirstName: "Denis", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "082", LastName: "Tropicales", FirstName: "Darell", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "083", LastName: "Alburo", FirstName: "Rosette", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "084", LastName: "Andal", FirstName: "Venet", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "085", LastName: "Arenas", FirstName: "Bea", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "091", LastName: "Macalisang", FirstName: "Jackyloyd", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "087", LastName: "Condeza", FirstName: "Angelyn", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "088", LastName: "Endonela", FirstName: "Eunice", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "089", LastName: "Gatmaitan", FirstName: "Darryl", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "092", LastName: "Mancenido", FirstName: "Vincent", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "093", LastName: "Manzanares", FirstName: "Alvin", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "094", LastName: "Montera", FirstName: "Jennica", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "095", LastName: "Masiglat", FirstName: "Alex Czar", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "086", LastName: "Buenafe", FirstName: "Joseph", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "097", LastName: "Viloria", FirstName: "Rogelio", Relationship: "Friend", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "098", LastName: "Agbaya", FirstName: "Rosalie", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "010" },
    { Id: "090", LastName: "Gimenez", FirstName: "Mark", Relationship: "Friend", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "099", LastName: "Arde", FirstName: "Apolinario", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "047" },
    { Id: "100", LastName: "Maniaga", FirstName: "Bobby", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: "072" },
    { Id: "101", LastName: "Escovidal", FirstName: "Joy Arces", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "025" },
    { Id: "102", LastName: "Alburo", FirstName: "Rhamie Jade", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: "043" },
    { Id: "103", LastName: "Delos Santos", FirstName: "Althea", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "044" },
    { Id: "104", LastName: "Jusay", FirstName: "Justine", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: "049" },
    { Id: "105", LastName: "Jusay", FirstName: "Zane Theodore", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: false, CompanionOf: "049" },
    { Id: "106", LastName: "Garcia", FirstName: "Miffie", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "041" },
    { Id: "107", LastName: "Lucero", FirstName: "Elaine", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "038" },
    { Id: "108", LastName: "Red", FirstName: "John Charl", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "020" },
    { Id: "109", LastName: "Red", FirstName: "Lavern Paula", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "020" },
    { Id: "110", LastName: "Reus", FirstName: "Andrei", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "024" },
    { Id: "111", LastName: "Ongoco", FirstName: "Arlo Lyxander", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "046" },
    { Id: "112", LastName: "Arre", FirstName: "James", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "051" },
    { Id: "113", LastName: "Arre", FirstName: "Kziv", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: true, CompanionOf: "051" },
    { Id: "114", LastName: "Acuavera", FirstName: "Alice", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "115", LastName: "Pelaez", FirstName: "Alex", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "084" },
    { Id: "116", LastName: "Alburo", FirstName: "Jeff Adrian", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "117", LastName: "Alburo", FirstName: "Samantha Irish", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "118", LastName: "Gatmaitan", FirstName: "Lukas Dominique", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "089" },
    { Id: "119", LastName: "Gatmaitan", FirstName: "Marie Laurinne", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "089" },
    { Id: "120", LastName: "Balagot", FirstName: "Janine", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "090" },
    { Id: "121", LastName: "Costales", FirstName: "Daniela May", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "090" },
    { Id: "122", LastName: "Gimenez", FirstName: "Naomi Belle", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "090" },
    { Id: "123", LastName: "Gimenez", FirstName: "Neriah Nyx", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "090" },
    { Id: "124", LastName: "Macalisang", FirstName: "Xander", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "091" },
    { Id: "125", LastName: "Tolentino", FirstName: "France", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: "053" },
    { Id: "126", LastName: "Esquillo", FirstName: "Aidan", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: "097" },
    { Id: "127", LastName: "Claveria", FirstName: "Annie", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "128", LastName: "Claveria", FirstName: "Cheska", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "129", LastName: "Claveria", FirstName: "Venice", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: true, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
    { Id: "130", LastName: "Dela Peña", FirstName: "Honey Ryza", Relationship: "Companion", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: "035" },
    { Id: "131", LastName: "Claveria", FirstName: "Grace", Relationship: "Relative", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "133", LastName: "Tibayan", FirstName: "Benedick", Relationship: "Friend", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "138", LastName: "Esmedilla", FirstName: "Hazel", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "139", LastName: "Cates", FirstName: "Arian Chie", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "140", LastName: "Reyes", FirstName: "Glenn", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "141", LastName: "Avenilla", FirstName: "Jeanson", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "142", LastName: "Aguinaldo", FirstName: "Bryan", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "143", LastName: "Nolasco", FirstName: "Arjay", Relationship: "Coworker", Side: "Groom", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: false, CompanionOf: null },
    { Id: "144", LastName: "Murillo", FirstName: "Kobe", Relationship: "Companion", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "145", LastName: "Bernardo", FirstName: "Jennifer Anne", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "146", LastName: "Dominguez", FirstName: "Mark Raven", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: true, WillAttend: true, CompanionOf: null },
    { Id: "147", LastName: "Paghari-on", FirstName: "Divina", Relationship: "Friend", Side: "Bride", IsChurchPriority: false, IsFoodSpecial: false, IsFoodPackage: false, WillAttend: true, CompanionOf: null },
]

siteData.rosters = rosters
siteData.groups = {
  foodPackage: [
    "001","002","003","004","079","005","006","007","045","082","046","008","059","021","076","024","078","009","011","022","020","025","098","010","012","013","014","015","016","017","018","023","026","027","028","029","030","031","032","033","034","035","036","037","038","039","040","041","042","043","054","044","047","048","103","049","050","051","053","055","056","057","063","074","065","070","071","075","080","081","083","084","085","091","087","088","089","092","093","094","095","086","097","090","099","101","106","107","108","109","110","112","115","127","130","131","144","145","146",
  ],
  extraPackage: [],
  special: ["058","060","061","062","113","128","129"],
  others: ["132","134","135","137","136","067","064","066","068","111","114","118","119","120","121","122","123","124","126","147"],
  notAttending: ["077","019","069","072","073","100","102","104","105","116","117","125","133","138","139","140","141","142","143"],
}

