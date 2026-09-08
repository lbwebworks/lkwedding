export type AttendeeTitle =
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

export type Attendee = {
  Id: string
  LastName: string
  FirstName: string
  Title: AttendeeTitle
  Side: 'Groom' | 'Bride' | ''
  IsChurchPriority: boolean
  IsFoodSpecial: boolean
  IsFoodPackage: boolean
  WillAttend: boolean
  CompanionOf: string | null
}

export type PriorityOrder = {
  attendeeId: string
  priority: number
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
  attendees: Attendee[]
  priorityOrder: PriorityOrder[]
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
  attendees: [],
  priorityOrder: [],
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

const attendeeRows: Array<[string, string, string, AttendeeTitle, 'Groom' | 'Bride' | '', boolean, boolean, boolean, boolean, string | null]> = [
  ["001"   , "Budaden"        , "Lee"                  , "Groom"         , "Groom"  , false, false, true, true, null],
  ["002"   , "Lacza"          , "Kish"                 , "Bride"         , "Bride"  , false, false, true, true, null],
  ["003"   , "Budaden"        , "Alfredo"              , "Parent"        , "Groom"  , false, false, true, true, null],
  ["004"   , "Budaden"        , "Angelina"             , "Parent"        , "Groom"  , false, false, true, true, null],
  ["005"   , "Lacza"          , "Reynaldo"             , "Parent"        , "Bride"  , false, false, true, true, null],
  ["006"   , "Lacza"          , "Julieta"              , "Parent"        , "Bride"  , false, false, true, true, null],
  ["007"   , "Budaden"        , "Alfred II"            , "Best Man"      , "Groom"  , false, false, true, true, null],
  ["008"   , "Lockhart"       , "Krizel Jane"          , "Maid Of Honor" , "Bride"  , false, false, true, true, null],
  ["009"   , "Jaime"          , "Ermie"                , "Ninong"        , "Bride"  , true, false, true, true, null],
  ["010"   , "Agbaya"         , "Ronald"               , "Ninong"        , "Bride"  , true, false, true, true, null],
  ["011"   , "Marucot"        , "Bayani"               , "Ninong"        , "Bride"  , true, false, true, true, null],
  ["012"   , "Budaden"        , "Morris"               , "Ninong"        , "Groom"  , true, false, true, true, null],
  ["013"   , "Alcantara"      , "Tristan"              , "Ninong"        , "Bride"  , true, false, true, true, null],
  ["014"   , "Dawey"          , "Abel"                 , "Ninong"        , "Groom"  , false, false, true, true, null],
  ["015"   , "Dauzon"         , "Remeo Jr."            , "Ninong"        , "Groom"  , false, false, true, true, null],
  ["016"   , "Galangco"       , "Juanito"              , "Ninong"        , "Groom"  , false, false, true, true, null],
  ["017"   , "Dawey"          , "Melchor"              , "Ninong"        , "Groom"  , false, false, true, true, null],
  ["018"   , "Budaden"        , "Mark"                 , "Ninong"        , "Groom"  , false, false, true, true, null],
  ["019"   , "Domingo"        , "Dionisio"             , "Ninong"        , "Groom"  , false, false, true, true, null],
  ["020"   , "Red"            , "Arlene"               , "Ninang"        , "Bride"  , true, false, true, true, null],
  ["021"   , "Dimla"          , "Yolanda"              , "Ninang"        , "Bride"  , true, false, true, true, null],
  ["022"   , "Marucot"        , "Anastasia"            , "Ninang"        , "Bride"  , true, false, true, true, null],
  ["023"   , "Mapalo"         , "Amelia"               , "Ninang"        , "Bride"  , true, false, true, true, null],
  ["024"   , "Reus"           , "Elnora Luistro"       , "Ninang"        , "Bride"  , true, false, true, true, null],
  ["025"   , "Escovidal"      , "Josephine"            , "Ninang"        , "Bride"  , false, false, true, true, null],
  ["026"   , "Rojo"           , "Cynthia"              , "Ninang"        , "Bride"  , false, false, true, true, null],
  ["027"   , "Cortez"         , "Daisy"                , "Ninang"        , "Groom"  , false, false, true, true, null],
  ["028"   , "Budaden"        , "Nena"                 , "Ninang"        , "Groom"  , false, false, true, true, null],
  ["029"   , "Dawey"          , "Francisca"            , "Ninang"        , "Groom"  , false, false, true, true, null],
  ["030"   , "Budaden"        , "Elizabeth"            , "Ninang"        , "Groom"  , false, false, true, true, null],
  ["031"   , "Dawey"          , "Cristeta"             , "Ninang"        , "Groom"  , false, false, true, true, null],
  ["032"   , "Budaden"        , "Cerila"               , "Ninang"        , "Groom"  , false, false, true, true, null],
  ["033"   , "Balang"         , "Rebecca"              , "Ninang"        , "Groom"  , false, false, true, true, null],
  ["034"   , "Budaden"        , "Allan"                , "Groomsmen"     , "Groom"  , true, false, true, true, null],
  ["035"   , "Budaden"        , "Frewell"              , "Groomsmen"     , "Groom"  , true, false, true, true, null],
  ["036"   , "Budaden"        , "Eliezer"              , "Groomsmen"     , "Groom"  , true, false, true, true, null],
  ["037"   , "Budaden"        , "Jonathan"             , "Groomsmen"     , "Groom"  , true, false, true, true, null],
  ["038"   , "Lucero"         , "Gerald"               , "Groomsmen"     , "Groom"  , false, false, true, true, null],
  ["039"   , "Sabado"         , "Rhenish Rhey"         , "Groomsmen"     , "Groom"  , false, false, true, true, null],
  ["040"   , "Villamar"       , "John Reynold"         , "Groomsmen"     , "Groom"  , false, false, true, true, null],
  ["041"   , "Garcia"         , "Ervin"                , "Groomsmen"     , "Groom"  , false, false, true, true, null],
  ["042"   , "Soriaga"        , "Jose Rafael"          , "Groomsmen"     , "Groom"  , false, false, true, true, null],
  ["043"   , "Jaime"          , "Christian Era"        , "Groomsmen"     , "Bride"  , false, false, true, true, null],
  ["044"   , "Jaime"          , "Eagle Mark"           , "Groomsmen"     , "Bride"  , false, false, true, true, null],
  ["045"   , "Tropicales"     , "Kristine Ayra"        , "Bridesmaid"    , "Bride"  , true, false, true, true, null],
  ["046"   , "Tropicales"     , "Angel Wisdom"         , "Bridesmaid"    , "Bride"  , true, false, true, true, null],
  ["047"   , "Budaden"        , "Beta Joy"             , "Bridesmaid"    , "Groom"  , true, false, true, true, null],
  ["048"   , "Budaden"        , "Junemae"              , "Bridesmaid"    , "Groom"  , true, false, true, true, null],
  ["049"   , "Jusay"          , "Anna Joy"             , "Bridesmaid"    , "Bride"  , false, false, true, true, null],
  ["050"   , "Garcia"         , "Coleen Keith"         , "Bridesmaid"    , "Groom"  , false, false, true, true, null],
  ["051"   , "Yamanaka"       , "Erin Eliza"           , "Bridesmaid"    , "Groom"  , false, false, true, true, null],
  ["052"   , "Mesa"           , "Rosette De"           , "Bridesmaid"    , "Bride"  , false, false, true, true, null],
  ["053"   , "Ramos"          , "Rosette"              , "Bridesmaid"    , "Bride"  , false, false, true, true, null],
  ["054"   , "Claveria"       , "Camille Shane"        , "Bridesmaid"    , "Bride"  , false, false, true, true, null],
  ["055"   , "Claveria"       , "Charlene Mae"         , "Bridesmaid"    , "Bride"  , false, false, true, true, null],
  ["056"   , "Wacnang"        , "Lex Jander"           , "Ring Bearer"   , "Groom"  , true, false, true, true, null],
  ["057"   , "Budaden"        , "Nathaniel"            , "Ring Bearer"   , "Groom"  , false, false, true, true, null],
  ["058"   , "Recio"          , "Calvin Wise"          , "Ring Bearer"   , "Bride"  , false, true, false, true, null],
  ["059"   , "Tropicales"     , "Kristell Yvonne"      , "Flower Girl"   , "Bride"  , true, false, true, true, null],
  ["060"   , "Budaden"        , "Chloelie Mutya"       , "Flower Girl"   , "Groom"  , false, true, false, true, null],
  ["061"   , "Wacnang"        , "Juris Jamie B."       , "Flower Girl"   , "Groom"  , false, true, false, true, null],
  ["062"   , "Budaden"        , "Nalla"                , "Flower Girl"   , "Groom"  , false, true, false, true, null],
  ["063"   , "Budaden"        , "Athea"                , "Relative"      , "Groom"  , false, false, true, true, null],
  ["064"   , "Budaden"        , "Grail"                , "Relative"      , "Groom"  , false, false, false, true, null],
  ["065"   , "Budaden"        , "Jahaziel"             , "Relative"      , "Groom"  , false, false, true, true, null],
  ["066"   , "Budaden"        , "Jasmin"               , "Relative"      , "Groom"  , false, false, false, true, null],
  ["067"   , "Budaden"        , "Jayvee"               , "Relative"      , "Groom"  , false, false, false, true, null],
  ["068"   , "Budaden"        , "Morris Jr."           , "Relative"      , "Groom"  , false, false, false, true, null],
  ["069"   , "Budaden"        , "Ralph"                , "Relative"      , "Groom"  , false, false, false, false, null],
  ["070"   , "Claveria"       , "Charmaine"            , "Relative"      , "Bride"  , false, false, true, true, null],
  ["071"   , "Claveria"       , "Ronald"               , "Relative"      , "Bride"  , false, false, true, true, null],
  ["072"   , "Claveria-Maniaga" , "Grace"                , "Relative"      , "Bride"  , false, false, false, false, null],
  ["073"   , "Delos Reyes"    , "Josie"                , "Relative"      , "Bride"  , false, false, true, true, null],
  ["074"   , "Dimara"         , "Natasha"              , "Relative"      , "Groom"  , false, false, true, true, null],
  ["075"   , "Dimara"         , "Shania"               , "Relative"      , "Groom"  , false, false, true, true, null],
  ["076"   , "Dimla"          , "Bong"                 , "Relative"      , "Bride"  , false, false, true, true, null],
  ["077"   , "Galangco"       , "Veronica"             , "Relative"      , "Groom"  , false, false, false, true, null],
  ["078"   , "Jaime"          , "Norberta"             , "Relative"      , "Bride"  , false, false, true, true, null],
  ["079"   , "Lacza"          , "Lourdes"              , "Relative"      , "Bride"  , false, false, true, true, null],
  ["080"   , "Razon"          , "Charizel"             , "Relative"      , "Bride"  , false, false, true, true, null],
  ["081"   , "Razon"          , "Denis"                , "Relative"      , "Bride"  , false, false, true, true, null],
  ["082"   , "Tropicales"     , "Darell"               , "Relative"      , "Bride"  , false, false, true, true, null],
  ["083"   , "Alburo"         , "Rosette"              , "Friend"        , "Bride"  , false, false, true, true, null],
  ["084"   , "Andal"          , "Venet"                , "Friend"        , "Bride"  , false, false, true, true, null],
  ["085"   , "Arenas"         , "Bea"                  , "Friend"        , "Bride"  , false, false, true, true, null],
  ["091"   , "Macalisang"     , "Jackyloyd"            , "Coworker"      , "Groom"  , false, false, true, true, null],
  ["087"   , "Condeza"        , "Angelyn"              , "Friend"        , "Bride"  , false, false, true, true, null],
  ["088"   , "Endonela"       , "Eunice"               , "Friend"        , "Bride"  , false, false, true, true, null],
  ["089"   , "Gatmaitan"      , "Darryl"               , "Coworker"      , "Groom"  , false, false, true, true, null],
  ["092"   , "Mancenido"      , "Vincent"              , "Friend"        , "Bride"  , false, false, true, true, null],
  ["093"   , "Manzanares"     , "Alvin"                , "Coworker"      , "Groom"  , false, false, true, true, null],
  ["094"   , "Montera"        , "Jennica"              , "Friend"        , "Bride"  , false, false, true, true, null],
  ["095"   , "Masiglat"       , "Alex Czar"            , "Friend"        , "Bride"  , false, false, true, true, null],
  ["096"   , "Red"            , "Lavern"               , "Friend"        , "Bride"  , false, false, true, true, null],
  ["086"   , "Buenafe"        , "Joseph"               , "Coworker"      , "Groom"  , false, false, true, true, null],
  ["097"   , "Viloria"        , "Rogelio"              , "Friend"        , "Groom"  , false, false, true, true, null],
  ["098"   , "Agbaya"         , "Rosalie"              , "Companion"     , "Bride"  , false, false, true, true, "010"],
  ["090"   , "Gimenez"        , "Mark"                 , "Friend"        , "Groom"  , false, false, true, true, null],
  ["099"   , "Arde"           , "Apolinario"           , "Companion"     , "Groom"  , false, false, true, true, "047"],
  ["100"   , "Maniaga"        , "Bobby"                , "Companion"     , "Bride"  , false, false, false, false, "072"],
  ["101"   , "Escovidal"      , "Joy Arces"            , "Companion"     , "Bride"  , false, false, true, true, "025"],
  ["102"   , "Alburo"         , "Rhamie Jade"          , "Companion"     , "Bride"  , false, false, true, true, "043"],
  ["103"   , "Delos Santos"   , "Althea"               , "Companion"     , "Bride"  , false, false, true, true, "044"],
  ["104"   , "Jusay"          , "Justine"              , "Companion"     , "Bride"  , false, false, true, true, "049"],
  ["105"   , "Jusay"          , "Zane Theodore"        , "Companion"     , "Bride"  , false, false, false, true, "049"],
  ["106"   , "Garcia"         , "Miffie"               , "Companion"     , "Groom"  , false, false, true, true, "041"],
  ["107"   , "Lucero"         , "Elaine"               , "Companion"     , "Groom"  , false, false, true, true, "038"],
  ["108"   , "Red"            , "John Charl"           , "Companion"     , "Bride"  , false, false, false, true, "020"],
  ["109"   , "Red"            , "Lavern Paula"         , "Companion"     , "Bride"  , false, false, false, true, "020"],
  ["110"   , "Reus"           , "Andrei"               , "Companion"     , "Bride"  , false, false, false, true, "024"],
  ["111"   , "Ongoco"         , "Arlo Lyxander"        , "Companion"     , "Bride"  , false, false, false, true, "046"],
  ["112"   , "Arre"           , "James"                , "Companion"     , "Groom"  , false, false, true, true, "051"],
  ["113"   , "Arre"           , "Kziv"                 , "Companion"     , "Groom"  , false, true, false, true, "051"],
  ["114"   , "Acuavera"       , "Alice"                , "Companion"     , "Bride"  , false, false, false, true, null],
  ["115"   , "Pelaez"         , "Alex"                 , "Companion"     , "Bride"  , false, false, false, true, "084"],
  ["116"   , "Alburo"         , "Jeff Adrian"          , "Companion"     , "Bride"  , false, false, false, true, null],
  ["117"   , "Alburo"         , "Samantha Irish"       , "Companion"     , "Bride"  , false, false, false, true, null],
  ["118"   , "Gatmaitan"      , "Lukas Dominique"      , "Companion"     , "Groom"  , false, false, false, true, "089"],
  ["119"   , "Gatmaitan"      , "Marie Laurinne"       , "Companion"     , "Groom"  , false, false, false, true, "089"],
  ["120"   , "Balagot"        , "Janine"               , "Companion"     , "Groom"  , false, false, false, true, "090"],
  ["121"   , "Costales"       , "Daniela May"          , "Companion"     , "Groom"  , false, false, false, true, "090"],
  ["122"   , "Gimenez"        , "Naomi Belle"          , "Companion"     , "Groom"  , false, false, false, true, "090"],
  ["123"   , "Gimenez"        , "Neriah Nyx"           , "Companion"     , "Groom"  , false, false, false, true, "090"],
  ["124"   , "Macalisang"     , "Xander"               , "Companion"     , "Groom"  , false, false, false, true, "091"],
  ["125"   , "Tolentino"      , "France"               , "Companion"     , "Bride"  , false, false, false, true, "053"],
  ["126"   , "Esquillo"       , "Aidan"                , "Companion"     , "Groom"  , false, false, false, true, "097"],
  ["127"   , "Claveria"       , "Annie"                , "Relative"      , "Bride"  , false, false, false, true, null],
  ["128"   , "Claveria"       , "Cheska"               , "Relative"      , "Bride"  , false, false, false, true, null],
  ["129"   , "Claveria"       , "Venice"               , "Relative"      , "Bride"  , false, false, false, true, null],
  ["130"   , "Dela Peña"      , "Honey Ryza"           , "Companion"     , "Groom"  , false, false, true, true, "035"],
]

siteData.attendees = attendeeRows.map(([Id, LastName, FirstName, Title, Side, IsChurchPriority, IsFoodSpecial, IsFoodPackage, WillAttend, CompanionOf]) => ({
  Id,
  LastName,
  FirstName,
  Title,
  Side,
  IsChurchPriority,
  IsFoodSpecial,
  IsFoodPackage,
  WillAttend,
  CompanionOf,
}))
siteData.priorityOrder = siteData.attendees.map((attendee, index) => ({
  attendeeId: attendee.Id,
  priority: index + 1,
}))
