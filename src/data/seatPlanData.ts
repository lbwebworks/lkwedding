// Seat plan data (separate file so it can be copy-pasted to update, like the
// roster/groups pattern in siteData.ts). A table holds an ordered list of
// roster ids; `columns` controls how many tables are shown per row.

export type SeatTable = {
  id: string
  name: string
  guestIds: string[]
}

export type SeatPlan = {
  columns: number
  tables: SeatTable[]
}

// Default arrangement. Paste an exported seat plan here to update it.
export const seatPlan: SeatPlan = {
  columns: 4,
  tables: [
    { id: "table-1789296803701", name: "Table 1", guestIds: ["149", "071", "076", "150", "114", "110", "147", "101"] },
    { id: "table-1789296806029", name: "VIP", guestIds: ["079", "005", "006", "082", "045", "046", "008", "059", "021", "024", "078", "009", "011", "022", "025", "098", "010", "013"] },
    { id: "table-1789296807253", name: "VIP", guestIds: ["003", "004", "012", "018", "017", "032", "029", "033", "031", "027", "026", "023", "016", "015", "014", "028", "030"] },
    { id: "table-1789296807669", name: "Table 2", guestIds: ["064", "066", "067", "068"] },
    { id: "table-1789296810661", name: "Table 3", guestIds: ["070", "080", "081", "128", "129", "131", "127"] },
    { id: "table-1789296810933", name: "Table 4", guestIds: ["055", "144", "054", "058", "043", "044", "111", "103"] },
    { id: "table-1789296811381", name: "Table 5", guestIds: ["037", "036", "047", "034", "048", "007", "035"] },
    { id: "table-1789296811693", name: "Table 6", guestIds: ["148", "099", "130", "056", "057", "060", "061", "062"] },
    { id: "table-1789296812293", name: "Table 7", guestIds: ["085", "084", "115", "087", "088", "146"] },
    { id: "table-1789296812493", name: "Table 8", guestIds: ["083", "053", "145", "049", "092", "095", "094"] },
    { id: "table-1789296812997", name: "Table 9", guestIds: ["042", "039", "050", "040", "051", "113", "112"] },
    { id: "table-1789296813181", name: "Table 10", guestIds: ["063", "074", "075", "065", "069"] },
    { id: "table-1789296816813", name: "Table 11", guestIds: [] },
    { id: "table-1789296816997", name: "Table 12", guestIds: ["038", "107", "097", "126", "090", "120", "122", "123"] },
    { id: "table-1789296817429", name: "Table 13", guestIds: ["041", "106", "132", "134", "135", "136"] },
    { id: "table-1789296817605", name: "Table 14", guestIds: ["089", "119", "118", "091", "124", "093", "086"] },
  ],
}