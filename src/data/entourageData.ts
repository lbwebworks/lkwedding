// Entourage groupings for the invitation page. Each array is an ordered list of
// roster ids (see rosterData.ts). Array position controls display order, so
// reordering the entourage is just a matter of moving ids around here — no need
// to touch rosterData.ts.
//
// Ids must exist in rosterData.ts. A not-attending guest listed here is simply
// skipped by the page (App.tsx filters on WillAttend), so it is safe to keep an
// id here even if that person later drops out.

export type Entourage = {
  parentsGroom: string[]
  parentsBride: string[]
  principalSponsorsNinong: string[]
  principalSponsorsNinang: string[]
  bestMan: string[]
  maidOfHonor: string[]
  groomsmen: string[]
  bridesmaids: string[]
  ringBearers: string[]
  flowerGirls: string[]
}

export const entourage: Entourage = {
  parentsGroom: ["003", "004"],
  parentsBride: ["005", "006"],
  principalSponsorsNinong: [
    "009", "011", "010", "012", "013", "014", "015", "016", "017", "018", "019",
  ],
  principalSponsorsNinang: [
    "021", "024", "022", "023", "020", "025", "026", "027", "028", "029", "030",
    "031", "032", "033",
  ],
  bestMan: ["007"],
  maidOfHonor: ["008"],
  groomsmen: [
    "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044",
  ],
  bridesmaids: [
    "045", "046", "047", "048", "049", "050", "051", "053", "083", "055", "054",
  ],
  ringBearers: ["056", "057", "058"],
  flowerGirls: ["059", "060", "061", "062"],
}
