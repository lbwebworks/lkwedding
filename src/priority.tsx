import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { siteData, type Roster, type Relationship } from './data/siteData'
import './index.css'
import './priority.css'

type PriorityGuest = {
  id: string
  name: string
  group: string
  side: 'Groom' | 'Bride'
  isSpecialFood: boolean
  isFoodPackage: boolean
  isExtraPackage: boolean
  willAttend: boolean
  isCompanion: boolean
  companionOf: string | null
}

type TableSection = 'food' | 'extra' | 'special' | 'seating' | 'other' | 'not-attending'
type FoodStatus = 'food' | 'special' | 'other'

const TITLE_OPTIONS: Relationship[] = [
  'Groom',
  'Bride',
  'Best Man',
  'Maid Of Honor',
  'Parent',
  'Ninong',
  'Ninang',
  'Groomsmen',
  'Bridesmaid',
  'Ring Bearer',
  'Flower Girl',
  'Relative',
  'Coworker',
  'Friend',
  'Companion',
]

type NewAttendeeForm = {
  lastName: string
  firstName: string
  role: Relationship
  side: 'Groom' | 'Bride'
  foodStatus: FoodStatus
  companionOf: string | null
}

const EMPTY_NEW_ATTENDEE_FORM: NewAttendeeForm = {
  lastName: '',
  firstName: '',
  role: 'Friend',
  side: 'Groom',
  foodStatus: 'other',
  companionOf: null,
}
type FoodCounts = { Groom: number; Bride: number }
type SeatingCounts = { Groom: number; Bride: number }

const STORAGE_KEY = 'lee-kish-priority-order'
const PROFILE_STORAGE_KEY = 'lee-kish-priority-profiles-v2'
const SPECIAL_FOOD_STORAGE_KEY = 'lee-kish-priority-special-food'
const FOOD_PACKAGE_STORAGE_KEY = 'lee-kish-priority-membership-v1'
const FOOD_QUOTA_STORAGE_KEY = 'lee-kish-priority-food-quota-v4'
const SEATING_QUOTA_STORAGE_KEY = 'lee-kish-priority-seating-quota-v1'
const FOOD_CAPACITY = 100
const HALL_CAPACITY = 150
const SEATING_CAPACITY = 150

const fullName = (roster: Roster) => `${roster.LastName}, ${roster.FirstName}`.trim()

// Membership flags are derived from which priorityLists bucket the guest is in,
// not from the stored Attendee flags. This keeps the new list-based model as the
// source of truth.
type GuestBucket = 'food' | 'extra' | 'special' | 'other' | 'not-attending'

const toPriorityGuest = (roster: Roster, bucket: GuestBucket): PriorityGuest => {
  const companionOf = roster.CompanionOf
    ? siteData.rosters.find((candidate) => candidate.Id === roster.CompanionOf)
    : undefined

  return {
    id: roster.Id,
    name: fullName(roster),
    group: companionOf ? `Companion (${companionOf.FirstName})` : roster.Relationship,
    side: roster.Side === 'Bride' ? 'Bride' : 'Groom',
    isSpecialFood: bucket === 'special',
    isFoodPackage: bucket === 'food',
    isExtraPackage: bucket === 'extra',
    willAttend: bucket !== 'not-attending',
    isCompanion: roster.CompanionOf !== null,
    companionOf: roster.CompanionOf,
  }
}

// Build the default guest list from rosters + groups. The ordered lists define
// both order and bucket membership. Array position is the priority. Vacant food
// slots (null) are skipped here — they hold a slot number but no guest.
const defaultGuests: PriorityGuest[] = (() => {
  const rosterById = new Map(siteData.rosters.map((roster) => [roster.Id, roster]))
  const { foodPackage, extraPackage, special, others, notAttending } = siteData.groups
  const sequence: Array<{ id: string; bucket: GuestBucket }> = [
    ...foodPackage.filter((id): id is string => id !== null).map((id) => ({ id, bucket: 'food' as const })),
    ...extraPackage.map((id) => ({ id, bucket: 'extra' as const })),
    ...special.map((id) => ({ id, bucket: 'special' as const })),
    ...others.map((id) => ({ id, bucket: 'other' as const })),
    ...notAttending.map((id) => ({ id, bucket: 'not-attending' as const })),
  ]
  return sequence
    .map(({ id, bucket }) => {
      const roster = rosterById.get(id)
      return roster ? toPriorityGuest(roster, bucket) : undefined
    })
    .filter((guest): guest is PriorityGuest => guest !== undefined)
})()

// Display names are stored as "LastName, FirstName". Split on the first comma
// so a renamed guest keeps that shape; fall back to treating the whole string
// as the first name when there is no comma.
const splitDisplayName = (name: string): { LastName: string; FirstName: string } => {
  const commaIndex = name.indexOf(',')
  if (commaIndex === -1) {
    return { LastName: '', FirstName: name.trim() }
  }
  return {
    LastName: name.slice(0, commaIndex).trim(),
    FirstName: name.slice(commaIndex + 1).trim(),
  }
}

// Reconstruct an Attendee record from a PriorityGuest, preferring the original
// siteData entry (to keep fields like CompanionOf) and overlaying the guest's
// current name/side/flags. Added guests have no siteData entry, so their record
// is built entirely from state.
const guestToAttendee = (
  guest: PriorityGuest,
  original: Roster | undefined,
  isSpecialFood: boolean,
): Roster => {
  const { LastName, FirstName } = splitDisplayName(guest.name)
  // Companions always export as Title "Companion" with a CompanionOf link.
  // Otherwise guest.group holds the editable role; use it when it is a known
  // role, else fall back to the original/derived Title.
  const roleTitle = (TITLE_OPTIONS as string[]).includes(guest.group)
    ? (guest.group as Relationship)
    : undefined
  const title: Relationship = guest.isCompanion
    ? 'Companion'
    : roleTitle ?? (original ? original.Relationship : 'Friend')
  return {
    ...(original ?? {
      Id: guest.id,
      Relationship: 'Friend',
      IsChurchPriority: false,
      CompanionOf: null,
    }),
    Id: guest.id,
    LastName,
    FirstName,
    Relationship: title,
    Side: guest.side,
    IsFoodSpecial: isSpecialFood,
    IsFoodPackage: guest.isFoodPackage,
    WillAttend: guest.willAttend,
    CompanionOf: guest.isCompanion ? guest.companionOf : null,
  } as Roster
}

// --- Priority numbering (single source of truth) -------------------------
// Every consumer (on-screen rank, Excel #, and the .ts priority export) reads
// slot numbers from here so they always agree. Grouping and slot rules:
//   1..foodCapacity  -> food package block (fixed size; unfilled slots are
//                       left vacant, i.e. the numbers are skipped)
//   next             -> special food (always begins above foodCapacity)
//   next             -> other attending guests
//   last             -> not attending guests
// Order within each group follows the guests array order.
type PriorityBucket = 'food' | 'special' | 'other' | 'not-attending'

type PriorityEntry = {
  guest: PriorityGuest
  slot: number
  bucket: PriorityBucket
}

const isSpecialFoodMember = (guest: PriorityGuest, specialFoodNames: string[]) =>
  guest.isSpecialFood || specialFoodNames.includes(guest.name)

const computePriority = (
  guests: PriorityGuest[],
  specialFoodNames: string[],
  foodCapacity: number,
): { entries: PriorityEntry[]; slotById: Map<string, number>; bucketById: Map<string, PriorityBucket> } => {
  const foodPackage = guests.filter(
    (guest) => guest.willAttend && guest.isFoodPackage && !isSpecialFoodMember(guest, specialFoodNames),
  )
  const special = guests.filter(
    (guest) => guest.willAttend && isSpecialFoodMember(guest, specialFoodNames),
  )
  const other = guests.filter(
    (guest) => guest.willAttend && !guest.isFoodPackage && !isSpecialFoodMember(guest, specialFoodNames),
  )
  const notAttending = guests.filter((guest) => !guest.willAttend)

  const entries: PriorityEntry[] = []
  // Food package fills 1..N inside the reserved block.
  foodPackage.forEach((guest, index) => {
    entries.push({ guest, slot: index + 1, bucket: 'food' })
  })
  // Everything after the reserved food block is numbered sequentially.
  let nextSlot = foodCapacity + 1
  const pushGroup = (group: PriorityGuest[], bucket: PriorityBucket) => {
    for (const guest of group) {
      entries.push({ guest, slot: nextSlot, bucket })
      nextSlot += 1
    }
  }
  pushGroup(special, 'special')
  pushGroup(other, 'other')
  pushGroup(notAttending, 'not-attending')

  const slotById = new Map(entries.map((entry) => [entry.guest.id, entry.slot]))
  const bucketById = new Map(entries.map((entry) => [entry.guest.id, entry.bucket]))
  return { entries, slotById, bucketById }
}

type StoredProfile = Pick<
  PriorityGuest,
  'id' | 'name' | 'group' | 'side' | 'willAttend' | 'isFoodPackage' | 'isExtraPackage' | 'isSpecialFood' | 'isCompanion' | 'companionOf'
>

const readStoredProfiles = (): StoredProfile[] => {
  const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY)
  if (!saved) {
    return []
  }
  try {
    const parsed = JSON.parse(saved) as StoredProfile[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getInitialGuests() {
  const savedOrder = window.localStorage.getItem(STORAGE_KEY)
  // Stored profiles carry renamed names and any guests added in the browser
  // (which have no siteData entry). They are keyed by id and layered on top of
  // the defaults / saved roster below.
  const profileById = new Map(readStoredProfiles().map((profile) => [profile.id, profile]))
  const profileToGuest = (profile: StoredProfile): PriorityGuest => ({
    id: profile.id,
    name: profile.name,
    group: profile.group,
    side: profile.side,
    isSpecialFood: profile.isSpecialFood,
    isFoodPackage: profile.isFoodPackage,
    isExtraPackage: profile.isExtraPackage ?? false,
    willAttend: profile.willAttend,
    isCompanion: profile.isCompanion,
    companionOf: profile.companionOf ?? null,
  })
  const applyProfile = (guest: PriorityGuest): PriorityGuest => {
    const profile = profileById.get(guest.id)
    if (!profile) {
      return guest
    }
    return {
      ...guest,
      name: profile.name,
      group: profile.group,
      isCompanion: profile.isCompanion,
      companionOf: profile.companionOf ?? null,
    }
  }

  if (!savedOrder) {
    const base = defaultGuests.map(applyProfile)
    const knownIds = new Set(defaultGuests.map((guest) => guest.id))
    const addedProfiles = readStoredProfiles()
      .filter((profile) => !knownIds.has(profile.id))
      .map(profileToGuest)
    return [...base, ...addedProfiles]
  }

  try {
    const savedRoster = JSON.parse(savedOrder) as Array<string | { id: string; side: 'Groom' | 'Bride'; willAttend?: boolean }>
    const guestById = new Map(defaultGuests.map((guest) => [guest.id, guest]))
    const orderedGuests = savedRoster
      .map((savedGuest) => {
        const id = typeof savedGuest === 'string' ? savedGuest : savedGuest.id
        // Prefer a default guest; otherwise fall back to a stored profile so
        // browser-added attendees are restored.
        const guest = guestById.get(id) ?? (profileById.has(id) ? profileToGuest(profileById.get(id)!) : undefined)
        if (!guest) {
          return undefined
        }
        const withRoster =
          typeof savedGuest === 'string'
            ? guest
            : { ...guest, side: savedGuest.side, willAttend: savedGuest.willAttend ?? guest.willAttend }
        return applyProfile(withRoster)
      })
      .filter((guest): guest is PriorityGuest => guest !== undefined)
    const savedIds = new Set(
      savedRoster.map((savedGuest) => (typeof savedGuest === 'string' ? savedGuest : savedGuest.id)),
    )
    const addedGuests = defaultGuests
      .filter((guest) => !savedIds.has(guest.id))
      .map(applyProfile)
    // Guests added in the browser that aren't in the saved roster yet.
    const knownIds = new Set([...defaultGuests.map((g) => g.id), ...savedIds])
    const addedProfiles = readStoredProfiles()
      .filter((profile) => !knownIds.has(profile.id))
      .map(profileToGuest)

    return [...orderedGuests, ...addedGuests, ...addedProfiles]
  } catch {
    return defaultGuests
  }
}

function getInitialSpecialFoodNames() {
  const saved = window.localStorage.getItem(SPECIAL_FOOD_STORAGE_KEY)
  // Special-food defaults come from the priorityLists.special bucket (the new
  // source of truth) rather than the stored IsFoodSpecial flag.
  const specialIds = new Set(siteData.groups.special)
  const defaultSpecialFoodNames = siteData.rosters
    .filter((roster) => specialIds.has(roster.Id))
    .map(fullName)

  if (!saved) {
    return defaultSpecialFoodNames
  }

  try {
    const savedNames = JSON.parse(saved) as string[]
    if (!Array.isArray(savedNames)) {
      return defaultSpecialFoodNames
    }

    // Drop saved names that no longer match anyone in the current roster.
    // This prevents stale localStorage entries (from removed or renamed
    // attendees) from inflating the special-food count. Manual flags on
    // still-valid attendees are preserved.
    const rosterNames = new Set(siteData.rosters.map(fullName))
    return savedNames.filter((name) => rosterNames.has(name))
  } catch {
    return defaultSpecialFoodNames
  }
}

function getInitialFoodCounts(): FoodCounts {
  const fallback = siteData.priorityFood
  const saved = window.localStorage.getItem(FOOD_QUOTA_STORAGE_KEY)

  if (!saved) {
    return fallback
  }

  try {
    const parsed = JSON.parse(saved) as Partial<FoodCounts>
    const groom = parsed.Groom
    const bride = parsed.Bride
    if (
      typeof groom === 'number' &&
      typeof bride === 'number' &&
      Number.isInteger(groom) &&
      Number.isInteger(bride) &&
      groom >= 0 &&
      bride >= 0 &&
      groom + bride === FOOD_CAPACITY
    ) {
      return { Groom: groom, Bride: bride }
    }
  } catch {
    return fallback
  }

  return fallback
}

function getInitialSeatingCounts(): SeatingCounts {
  const fallback = siteData.prioritySeating
  const saved = window.localStorage.getItem(SEATING_QUOTA_STORAGE_KEY)

  if (!saved) {
    return fallback
  }

  try {
    const parsed = JSON.parse(saved) as Partial<SeatingCounts>
    const groom = parsed.Groom
    const bride = parsed.Bride
    if (
      typeof groom === 'number' &&
      typeof bride === 'number' &&
      Number.isInteger(groom) &&
      Number.isInteger(bride) &&
      groom >= 0 &&
      bride >= 0 &&
      groom + bride === SEATING_CAPACITY
    ) {
      return { Groom: groom, Bride: bride }
    }
  } catch {
    return fallback
  }

  return fallback
}

function reconcileFoodPackage(guests: PriorityGuest[], counts: FoodCounts) {
  return (['Groom', 'Bride'] as const).reduce((currentGuests, side) => {
    const eligible = currentGuests.filter(
      (guest) => guest.side === side && !guest.isSpecialFood,
    )
    const selected = eligible.filter((guest) => guest.isFoodPackage)
    const packageIds = new Set(selected.slice(0, counts[side]).map((guest) => guest.id))
    return currentGuests.map((guest) =>
      guest.side === side ? { ...guest, isFoodPackage: packageIds.has(guest.id) } : guest,
    )
  }, guests)
}

const getInitialPackageIds = () => {
  const saved = window.localStorage.getItem(FOOD_PACKAGE_STORAGE_KEY)
  if (!saved) {
    return new Set(defaultGuests.filter((guest) => guest.isFoodPackage).map((guest) => guest.id))
  }

  try {
    const ids = JSON.parse(saved) as string[]
    return new Set(Array.isArray(ids) ? ids : [])
  } catch {
    return new Set<string>()
  }
}

function PriorityPage() {
  const [guests, setGuests] = useState(() => {
    const packageIds = getInitialPackageIds()
    const initialGuests = getInitialGuests().map((guest) => ({
      ...guest,
      isFoodPackage: packageIds.has(guest.id),
    }))
    return reconcileFoodPackage(initialGuests, getInitialFoodCounts())
  })
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null)
  const [specialFoodNames, setSpecialFoodNames] = useState(getInitialSpecialFoodNames)
  const [openMenuGuestId, setOpenMenuGuestId] = useState<string | null>(null)
  const [foodCounts, setFoodCounts] = useState(getInitialFoodCounts)
  const [seatingCounts, setSeatingCounts] = useState(getInitialSeatingCounts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAttendeeForm, setNewAttendeeForm] = useState<NewAttendeeForm>(EMPTY_NEW_ATTENDEE_FORM)
  const [roleEditGuestId, setRoleEditGuestId] = useState<string | null>(null)
  const [roleEditValue, setRoleEditValue] = useState<Relationship>('Friend')
  const [roleEditCompanionOf, setRoleEditCompanionOf] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ side: 'Groom' | 'Bride'; section: TableSection; guestId: string | null } | null>(null)

  // Single source of truth for priority slot numbers, shared by the on-screen
  // rank, the Excel export, and the .ts priority export.
  const priority = computePriority(guests, specialFoodNames, FOOD_CAPACITY)

  const saveOrder = (nextGuests: PriorityGuest[]) => {
    setGuests(nextGuests)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextGuests.map(({ id, side, willAttend }) => ({ id, side, willAttend }))),
    )
    window.localStorage.setItem(
      FOOD_PACKAGE_STORAGE_KEY,
      JSON.stringify(nextGuests.filter((guest) => guest.isFoodPackage).map((guest) => guest.id)),
    )
    // Persist full profiles so renames and browser-added attendees survive reloads.
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(
        nextGuests.map(({ id, name, group, side, willAttend, isFoodPackage, isExtraPackage, isSpecialFood, isCompanion, companionOf }) => ({
          id,
          name,
          group,
          side,
          willAttend,
          isFoodPackage,
          isExtraPackage,
          isSpecialFood,
          isCompanion,
          companionOf,
        })),
      ),
    )
  }

  const downloadGeneratedData = () => {
    const attendeeById = new Map(siteData.rosters.map((roster) => [roster.Id, roster]))
    const attendees = guests.map((guest) =>
      guestToAttendee(
        guest,
        attendeeById.get(guest.id),
        guest.isSpecialFood || specialFoodNames.includes(guest.name),
      ),
    )
    // Use the shared slot numbering so the exported priority matches the
    // on-screen rank and the Excel #. Entries are already slot-ordered.
    const priorityOrder = priority.entries.map((entry) => ({
      attendeeId: entry.guest.id,
      priority: entry.slot,
    }))

    // Format as TypeScript source that matches the layout in siteData.ts:
    // one object literal per line, unquoted keys, ready to paste directly.
    const formatValue = (value: string | boolean | null) =>
      typeof value === 'string' ? `"${value}"` : String(value)
    const attendeeLine = (attendee: (typeof attendees)[number]) =>
      `    { Id: ${formatValue(attendee.Id)}, LastName: ${formatValue(attendee.LastName)}, FirstName: ${formatValue(attendee.FirstName)}, Relationship: ${formatValue(attendee.Relationship)}, Side: ${formatValue(attendee.Side)}, IsChurchPriority: ${formatValue(attendee.IsChurchPriority)}, IsFoodSpecial: ${formatValue(attendee.IsFoodSpecial)}, IsFoodPackage: ${formatValue(attendee.IsFoodPackage)}, WillAttend: ${formatValue(attendee.WillAttend)}, CompanionOf: ${formatValue(attendee.CompanionOf)} },`
    const priorityLine = (order: (typeof priorityOrder)[number]) =>
      `    { attendeeId: ${formatValue(order.attendeeId)}, priority: ${order.priority} },`

    const attendeesBlock = `const attendees: Attendee[] = [\n${attendees.map(attendeeLine).join('\n')}\n]`
    const priorityOrderBlock =
      priorityOrder.length > 0
        ? `const priorityOrder: PriorityOrder[] = [\n${priorityOrder.map(priorityLine).join('\n')}\n]`
        : 'const priorityOrder: PriorityOrder[] = []'
    const fileContents = `${attendeesBlock}\n\n${priorityOrderBlock}\n`

    const blob = new Blob([fileContents], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'attendee-data.ts'
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadExcel = () => {
    const columns = ['#', 'Name', 'Title', 'Side', 'IsSpecialFood', 'WillAttend']
    // Wrap each cell so commas, quotes, or newlines don't break the CSV layout.
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`
    // Reuse the shared priority numbering so the # column matches everywhere.
    const rows = priority.entries.map(({ slot, guest }) => {
      return [
        String(slot),
        guest.name,
        displayGroup(guest),
        guest.side,
        isSpecialFoodMember(guest, specialFoodNames) ? 'Yes' : 'No',
        guest.willAttend ? 'Yes' : 'No',
      ]
        .map(escapeCell)
        .join(',')
    })

    // Prepend a UTF-8 BOM so Excel reads accented names correctly.
    const csv = `\uFEFF${[columns.map(escapeCell).join(','), ...rows].join('\r\n')}\r\n`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'guest-list.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const setFoodQuota = (side: 'Groom' | 'Bride', value: number) => {
    const nextCounts: FoodCounts = side === 'Groom'
      ? { Groom: value, Bride: FOOD_CAPACITY - value }
      : { Groom: FOOD_CAPACITY - value, Bride: value }
    const nextGuests = reconcileFoodPackage(guests, nextCounts)
    setFoodCounts(nextCounts)
    setGuests(nextGuests)
    window.localStorage.setItem(
      FOOD_PACKAGE_STORAGE_KEY,
      JSON.stringify(nextGuests.filter((guest) => guest.isFoodPackage).map((guest) => guest.id)),
    )
    window.localStorage.setItem(FOOD_QUOTA_STORAGE_KEY, JSON.stringify(nextCounts))
  }

  const setSeatingQuota = (side: 'Groom' | 'Bride', value: number) => {
    const nextCounts: SeatingCounts = side === 'Groom'
      ? { Groom: value, Bride: SEATING_CAPACITY - value }
      : { Groom: SEATING_CAPACITY - value, Bride: value }
    setSeatingCounts(nextCounts)
    window.localStorage.setItem(SEATING_QUOTA_STORAGE_KEY, JSON.stringify(nextCounts))
  }

  const toggleFoodPackage = (guestId: string) => {
    const guest = guests.find((item) => item.id === guestId)
    if (!guest || !guest.willAttend) {
      return
    }

    const packageCount = guests.filter(
      (item) => item.side === guest.side && item.isFoodPackage && !item.isSpecialFood,
    ).length
    if (!guest.isFoodPackage && packageCount >= foodCounts[guest.side]) {
      setOpenMenuGuestId(null)
      return
    }

    saveOrder(guests.map((item) => item.id === guestId
      ? { ...item, isFoodPackage: !item.isFoodPackage, isSpecialFood: false, isExtraPackage: false }
      : item))
    setOpenMenuGuestId(null)
  }

  const moveGuestToSide = (guestId: string, side: 'Groom' | 'Bride') => {
    saveOrder(guests.map((guest) => guest.id === guestId ? { ...guest, side } : guest))
    setOpenMenuGuestId(null)
  }

  const toggleExtraPackage = (guestId: string) => {
    const guest = guests.find((item) => item.id === guestId)
    setOpenMenuGuestId(null)
    if (!guest || !guest.willAttend) {
      return
    }
    const nextIsExtra = !guest.isExtraPackage
    // Extra package is its own bucket, so entering it clears the food/special
    // flags; leaving it drops the guest back to the "others" bucket.
    saveOrder(
      guests.map((item) =>
        item.id === guestId
          ? { ...item, isExtraPackage: nextIsExtra, isFoodPackage: false, isSpecialFood: false }
          : item,
      ),
    )
    // Keep the name-keyed special-food list in sync when leaving special food.
    if (nextIsExtra && specialFoodNames.includes(guest.name)) {
      setSpecialFoodNames((current) => {
        const next = current.filter((name) => name !== guest.name)
        window.localStorage.setItem(SPECIAL_FOOD_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    }
  }

  const deleteGuest = (guestId: string) => {
    const guest = guests.find((item) => item.id === guestId)
    setOpenMenuGuestId(null)
    if (!guest) {
      return
    }
    if (!window.confirm(`Delete "${guest.name}" from the roster?`)) {
      return
    }
    // Remove the guest and clear any companion links that pointed at them so no
    // dangling references are left behind.
    const nextGuests = guests
      .filter((item) => item.id !== guestId)
      .map((item) =>
        item.companionOf === guestId
          ? { ...item, isCompanion: false, companionOf: null, group: 'Friend' }
          : item,
      )
    saveOrder(nextGuests)
    // Drop the deleted name from the special-food list to keep counts in sync.
    if (specialFoodNames.includes(guest.name)) {
      setSpecialFoodNames((current) => {
        const next = current.filter((name) => name !== guest.name)
        window.localStorage.setItem(SPECIAL_FOOD_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    }
  }

  const renameGuest = (guestId: string) => {
    const guest = guests.find((item) => item.id === guestId)
    if (!guest) {
      return
    }
    const nextName = window.prompt('Rename attendee (format: "LastName, FirstName")', guest.name)
    setOpenMenuGuestId(null)
    if (nextName === null) {
      return
    }
    const trimmed = nextName.trim()
    if (trimmed === '' || trimmed === guest.name) {
      return
    }
    saveOrder(guests.map((item) => (item.id === guestId ? { ...item, name: trimmed } : item)))
  }

  const editGuestRole = (guestId: string) => {
    const guest = guests.find((item) => item.id === guestId)
    setOpenMenuGuestId(null)
    if (!guest) {
      return
    }
    setRoleEditGuestId(guestId)
    // Preselect the guest's current role: "Companion" if linked, otherwise the
    // known role stored in group.
    setRoleEditValue(
      guest.isCompanion
        ? 'Companion'
        : (TITLE_OPTIONS as string[]).includes(guest.group)
          ? (guest.group as Relationship)
          : 'Friend',
    )
    setRoleEditCompanionOf(guest.companionOf)
  }

  const submitRoleEdit = () => {
    if (roleEditGuestId === null) {
      return
    }
    const isCompanion = roleEditValue === 'Companion'
    // A companion must point to someone; ignore an incomplete selection.
    if (isCompanion && !roleEditCompanionOf) {
      return
    }
    saveOrder(
      guests.map((item) =>
        item.id === roleEditGuestId
          ? {
              ...item,
              group: roleEditValue,
              isCompanion,
              companionOf: isCompanion ? roleEditCompanionOf : null,
            }
          : item,
      ),
    )
    setRoleEditGuestId(null)
  }

  // Candidates a companion can be attached to: everyone who is not themselves a
  // companion (optionally excluding a specific guest, e.g. the one being edited).
  const companionCandidates = (excludeId?: string) =>
    guests
      .filter((guest) => !guest.isCompanion && guest.id !== excludeId)
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name))

  // Label shown in the list / export. Companions display who they belong to.
  const displayGroup = (guest: PriorityGuest) => {
    if (!guest.isCompanion) {
      return guest.group
    }
    const target = guests.find((candidate) => candidate.id === guest.companionOf)
    if (!target) {
      return 'Companion'
    }
    // Show only the inviter's first given name. Names are "LastName, FirstName";
    // take the part after the comma, then its first word.
    const givenNames = target.name.includes(',')
      ? target.name.slice(target.name.indexOf(',') + 1).trim()
      : target.name.trim()
    const firstGivenName = givenNames.split(/\s+/)[0] ?? givenNames
    return `Companion (${firstGivenName})`
  }

  const openAddDialog = () => {
    setNewAttendeeForm(EMPTY_NEW_ATTENDEE_FORM)
    setIsAddDialogOpen(true)
    setOpenMenuGuestId(null)
  }

  const submitNewAttendee = () => {
    const lastName = newAttendeeForm.lastName.trim()
    const firstName = newAttendeeForm.firstName.trim()
    if (lastName === '' && firstName === '') {
      return
    }
    // A companion must point to someone; ignore an incomplete selection.
    if (newAttendeeForm.role === 'Companion' && !newAttendeeForm.companionOf) {
      return
    }
    // Display name follows the "LastName, FirstName" convention used elsewhere.
    const name = lastName === '' ? firstName : `${lastName}, ${firstName}`.trim()
    // Generate an id above every existing numeric id so it never collides.
    const maxId = guests.reduce((max, guest) => {
      const numeric = Number(guest.id)
      return Number.isFinite(numeric) && numeric > max ? numeric : max
    }, 0)
    const newGuest: PriorityGuest = {
      id: String(maxId + 1).padStart(3, '0'),
      name,
      group: newAttendeeForm.role,
      side: newAttendeeForm.side,
      isSpecialFood: newAttendeeForm.foodStatus === 'special',
      isFoodPackage: newAttendeeForm.foodStatus === 'food',
      isExtraPackage: false,
      willAttend: true,
      isCompanion: newAttendeeForm.role === 'Companion',
      companionOf: newAttendeeForm.role === 'Companion' ? newAttendeeForm.companionOf : null,
    }
    saveOrder([...guests, newGuest])
    // Keep the name-keyed special-food list in sync so counts/sections match.
    if (newAttendeeForm.foodStatus === 'special') {
      setSpecialFoodNames((current) => {
        if (current.includes(name)) {
          return current
        }
        const next = [...current, name]
        window.localStorage.setItem(SPECIAL_FOOD_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    }
    setIsAddDialogOpen(false)
  }

  const setGuestAttendance = (guestId: string, willAttend: boolean) => {
    saveOrder(guests.map((guest) => guest.id === guestId
      ? { ...guest, willAttend, isFoodPackage: willAttend && guest.isFoodPackage, isSpecialFood: willAttend && guest.isSpecialFood }
      : guest))
    setOpenMenuGuestId(null)
  }

  const toggleSpecialFood = (guestName: string) => {
    setSpecialFoodNames((current) => {
      const next = current.includes(guestName)
        ? current.filter((name) => name !== guestName)
        : [...current, guestName]
      window.localStorage.setItem(SPECIAL_FOOD_STORAGE_KEY, JSON.stringify(next))

      const nextGuests = guests.map((guest) =>
        guest.name === guestName
          ? {
              ...guest,
              isSpecialFood: next.includes(guestName),
              isFoodPackage: next.includes(guestName) ? false : guest.isFoodPackage,
              isExtraPackage: next.includes(guestName) ? false : guest.isExtraPackage,
            }
          : guest,
      )
          saveOrder(nextGuests)
      return next
    })
    setOpenMenuGuestId(null)
  }

  const moveGuest = (targetGuestId: string, targetSide: 'Groom' | 'Bride') => {
    if (!draggedGuestId || draggedGuestId === targetGuestId) {
      return
    }

    const sourceIndex = guests.findIndex((guest) => guest.id === draggedGuestId)
    if (sourceIndex === -1) {
      return
    }

    const nextGuests = [...guests]
    const [movedGuest] = nextGuests.splice(sourceIndex, 1)
    const targetIndex = nextGuests.findIndex((guest) => guest.id === targetGuestId)
    if (targetIndex === -1) {
      return
    }

    movedGuest.side = targetSide
    const targetPackageCount = nextGuests.filter(
      (guest) => guest.side === targetSide && guest.isFoodPackage && !guest.isSpecialFood,
    ).length
    if (movedGuest.isFoodPackage && targetPackageCount >= foodCounts[targetSide]) {
      movedGuest.isFoodPackage = false
    }
    nextGuests.splice(targetIndex, 0, movedGuest)
    saveOrder(nextGuests)
  }

  const getTableGuests = (side: 'Groom' | 'Bride', section: TableSection) => {
    if (section === 'not-attending') {
      return guests.filter((guest) => !guest.willAttend && guest.side === side)
    }
    const sideGuests = guests.filter((guest) => guest.willAttend && guest.side === side)
    if (section === 'extra') {
      return sideGuests.filter((guest) => guest.isExtraPackage)
    }
    const specialGuests = sideGuests.filter(
      (guest) => !guest.isExtraPackage && (guest.isSpecialFood || specialFoodNames.includes(guest.name)),
    )
    const packageGuests = sideGuests.filter(
      (guest) => guest.isFoodPackage && !guest.isExtraPackage && !guest.isSpecialFood,
    )
    const regularGuests = sideGuests.filter(
      (guest) => !guest.isFoodPackage && !guest.isExtraPackage && !guest.isSpecialFood,
    )
    const foodCount = foodCounts[side]
    const seatingCount = seatingCounts[side]
    const seatingSlots = Math.max(0, seatingCount - foodCount - specialGuests.length)
    if (section === 'special') {
      return specialGuests
    }
    if (section === 'food') {
      return packageGuests.slice(0, foodCount)
    }
    if (section === 'seating') {
      return regularGuests.slice(0, seatingSlots)
    }
    return regularGuests.slice(seatingSlots)
  }

  const moveGuestToTable = (targetSide: 'Groom' | 'Bride', section: TableSection) => {
    if (!draggedGuestId) {
      return
    }

    const sourceIndex = guests.findIndex((guest) => guest.id === draggedGuestId)
    if (sourceIndex === -1) {
      return
    }

    const nextGuests = [...guests]
    const [movedGuest] = nextGuests.splice(sourceIndex, 1)
    movedGuest.side = targetSide
    const targetPackageCount = nextGuests.filter(
      (guest) => guest.side === targetSide && guest.isFoodPackage && !guest.isSpecialFood,
    ).length
    if (movedGuest.isFoodPackage && targetPackageCount >= foodCounts[targetSide]) {
      movedGuest.isFoodPackage = false
    }

    const sideGuests = nextGuests.filter((guest) => guest.side === targetSide)
    const specialGuests = sideGuests.filter(
      (guest) => guest.isSpecialFood || specialFoodNames.includes(guest.name),
    )
    const packageGuests = sideGuests.filter((guest) => guest.isFoodPackage && !guest.isSpecialFood)
    const regularGuests = sideGuests.filter((guest) => !guest.isFoodPackage && !guest.isSpecialFood)
    const foodCount = foodCounts[targetSide]
    const seatingSlots = Math.max(0, seatingCounts[targetSide] - foodCount - specialGuests.length)
    const targetGuests = section === 'special'
      ? specialGuests
      : section === 'food'
        ? packageGuests.slice(0, foodCount)
        : section === 'seating'
          ? regularGuests.slice(0, seatingSlots)
          : regularGuests.slice(seatingSlots)
    const lastTargetGuest = targetGuests.at(-1)
    const lastTargetIndex = lastTargetGuest
      ? nextGuests.findIndex((guest) => guest.id === lastTargetGuest.id)
      : -1
    const lastSideIndex = [...nextGuests]
      .map((guest, index) => (guest.side === targetSide ? index : -1))
      .filter((index) => index !== -1)
      .at(-1) ?? -1
    const insertIndex = lastTargetIndex >= 0 ? lastTargetIndex + 1 : lastSideIndex + 1

    nextGuests.splice(insertIndex < 0 ? nextGuests.length : insertIndex, 0, movedGuest)
    saveOrder(nextGuests)
  }

  const renderGuestRow = (
    guest: PriorityGuest,
    tableSide: 'Groom' | 'Bride',
    section: TableSection,
  ) => {
    const isSpecialFood = guest.isSpecialFood || specialFoodNames.includes(guest.name)
    const isMenuOpen = openMenuGuestId === guest.id

    const isDropBefore =
      dropTarget !== null &&
      dropTarget.side === tableSide &&
      dropTarget.section === section &&
      dropTarget.guestId === guest.id &&
      draggedGuestId !== null &&
      draggedGuestId !== guest.id

    return (
      <li
        key={guest.id}
        className={`priority-row${draggedGuestId === guest.id ? ' is-dragging' : ''}${isSpecialFood ? ' has-special-food' : ''}${isDropBefore ? ' is-drop-before' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          if (draggedGuestId && draggedGuestId !== guest.id) {
            setDropTarget({ side: tableSide, section, guestId: guest.id })
          }
        }}
        onDrop={(event) => {
          event.stopPropagation()
          moveGuest(guest.id, tableSide)
          setDraggedGuestId(null)
          setDropTarget(null)
        }}
      >
        <button
          type="button"
          className="priority-drag-handle"
          draggable
          aria-label={`Drag ${guest.name} to reorder priority`}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move'
            setDraggedGuestId(guest.id)
          }}
          onDragEnd={() => {
            setDraggedGuestId(null)
            setDropTarget(null)
          }}
        >
          ::
        </button>
        <span className="priority-rank">{String(priority.slotById.get(guest.id) ?? 0).padStart(2, '0')}</span>
        <div className="priority-guest"><strong>{guest.name}</strong></div>
        <span className="priority-group">{displayGroup(guest)}</span>
        <div className="priority-actions">
          <div className="priority-menu-wrap">
            <button
              type="button"
              className={`priority-menu-trigger${isMenuOpen ? ' is-open' : ''}`}
              aria-label={`Actions for ${guest.name}`}
              aria-expanded={isMenuOpen}
              onClick={(event) => {
                event.stopPropagation()
                setOpenMenuGuestId(isMenuOpen ? null : guest.id)
              }}
            >
              ⋮
            </button>
            {isMenuOpen && (
              <div className="priority-menu" role="menu" onClick={(event) => event.stopPropagation()}>
                <button type="button" role="menuitem" className="priority-menu-item is-add" onClick={() => renameGuest(guest.id)}>
                  Rename
                </button>
                <button type="button" role="menuitem" className="priority-menu-item is-add" onClick={() => editGuestRole(guest.id)}>
                  Edit Role
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className={`priority-menu-item${isSpecialFood ? ' is-remove' : ' is-add'}`}
                  onClick={() => toggleSpecialFood(guest.name)}
                >
                  {isSpecialFood ? 'Move to regular food' : 'Move to special food'}
                </button>
                {!isSpecialFood && (
                  <button type="button" role="menuitem" className={`priority-menu-item${guest.isFoodPackage ? ' is-remove' : ' is-add'}`} onClick={() => toggleFoodPackage(guest.id)}>
                    {guest.isFoodPackage ? 'Move to regular seating' : 'Move to food package'}
                  </button>
                )}
                {isSpecialFood && (
                  <button type="button" role="menuitem" className="priority-menu-item is-add" onClick={() => toggleFoodPackage(guest.id)}>
                    Move to food package
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  className={`priority-menu-item${guest.isExtraPackage ? ' is-remove' : ' is-add'}`}
                  onClick={() => toggleExtraPackage(guest.id)}
                >
                  {guest.isExtraPackage ? 'Remove from extra package' : 'Add to extra package'}
                </button>
                <button type="button" role="menuitem" className="priority-menu-item is-add" onClick={() => moveGuestToSide(guest.id, guest.side === 'Groom' ? 'Bride' : 'Groom')}>
                  Move to {guest.side === 'Groom' ? 'Bride' : 'Groom'}
                </button>
                <button type="button" role="menuitem" className={`priority-menu-item${guest.willAttend ? ' is-remove' : ' is-add'}`} onClick={() => setGuestAttendance(guest.id, !guest.willAttend)}>
                  {guest.willAttend ? 'Mark not attending' : 'Mark attending'}
                </button>
                <button type="button" role="menuitem" className="priority-menu-item is-remove" onClick={() => deleteGuest(guest.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
    )
  }

  const renderTable = (side: 'Groom' | 'Bride', section: TableSection) => {
    const tableGuests = getTableGuests(side, section)
    return (
      <div className="priority-table-column" aria-label={`${side} side`}>
        <div className="priority-table-side-title">{side} side</div>
        <ol
          className={`priority-list${
            dropTarget?.side === side && dropTarget?.section === section && dropTarget?.guestId === null
              ? ' is-drop-end'
              : ''
          }`}
          onClick={() => setOpenMenuGuestId(null)}
          onDragOver={(event) => {
            event.preventDefault()
            // Hovering over empty list space (not a specific row) targets the end.
            if (draggedGuestId && event.target === event.currentTarget) {
              setDropTarget({ side, section, guestId: null })
            }
          }}
          onDrop={(event) => {
            event.preventDefault()
            moveGuestToTable(side, section)
            setDraggedGuestId(null)
            setDropTarget(null)
          }}
        >
          {tableGuests.map((guest) => renderGuestRow(guest, side, section))}
          {section === 'food' && Array.from({
            length: Math.max(0, foodCounts[side] - tableGuests.length),
          }, (_, index) => (
            <li className="priority-row is-empty-slot" key={`empty-${side}-${index}`}>
              <span />
              <span className="priority-rank">··</span>
              <div className="priority-guest"><strong>Empty slot</strong></div>
              <span className="priority-group">Available</span>
              <span />
            </li>
          ))}
        </ol>
      </div>
    )
  }

  const renderSection = (section: TableSection, title: string) => {
    return (
      <section className="priority-table-section" aria-label={title}>
        <h3>{title}</h3>
        <div className="priority-table-pair">
          {renderTable('Groom', section)}
          {renderTable('Bride', section)}
        </div>
      </section>
    )
  }

  const hallCapacity = HALL_CAPACITY

  return (
    <>
    <main className="priority-page">
      <header className="priority-header">
        <a className="priority-back-link" href={`${import.meta.env.BASE_URL}`}>
          Back to invitation
        </a>
        <p className="priority-eyebrow">Coordinator workspace</p>
        <h1>Guest Priority</h1>
        <p className="priority-description">
          Arrange attendance priority for food stamps and spare seating. Changes are kept in this browser.
        </p>
      </header>

      <section className="priority-capacity" aria-label="Guest capacity summary">
        <div>
          <span>Roster</span>
          <strong>{guests.length}</strong>
          <small>guests currently listed</small>
        </div>
        <div>
          <span>Attendees</span>
          <strong>{guests.filter((guest) => guest.willAttend).length}</strong>
          <small>guests who will attend</small>
        </div>
        <div>
          <span>Hall cap</span>
          <strong>{hallCapacity}</strong>
          <small>maximum seats available</small>
        </div>
        <div>
          <span>Food package cap</span>
          <strong>{foodCounts.Groom + foodCounts.Bride}</strong>
          <small>food stamps available</small>
        </div>
        <div>
          <span>Special food</span>
          <strong>{specialFoodNames.length}</strong>
          <small>separate food arrangement</small>
        </div>
      </section>

      <div className="priority-list-heading">
        <div>
          <p className="priority-eyebrow">Attendance order</p>
          <h2>Priority tables</h2>
        </div>
        <button
          type="button"
          className="priority-reset"
          onClick={() => {
            window.localStorage.removeItem(PROFILE_STORAGE_KEY)
            saveOrder(defaultGuests)
          }}
        >
          Reset order
        </button>
        <button type="button" className="priority-save" onClick={openAddDialog}>
          Add attendee
        </button>
        <button type="button" className="priority-save" onClick={downloadGeneratedData}>
          Download data
        </button>
        <button type="button" className="priority-save" onClick={downloadExcel}>
          Export Excel
        </button>
      </div>
      <div className="priority-quota-pair">
        {(['Groom', 'Bride'] as const).map((side) => (
          <div className="priority-quota-column" key={side}>
            <h2>{side} side</h2>
            <label>
              <span>Total Guests</span>
              <input
                type="number"
                value={guests.filter((guest) => guest.side === side && guest.willAttend).length}
                disabled
                readOnly
              />
            </label>
            <label>
              <span>Food Count</span>
              <input
                type="number"
                min="0"
                max={FOOD_CAPACITY}
                value={foodCounts[side]}
                onChange={(event) => {
                  const value = Math.min(FOOD_CAPACITY, Math.max(0, Number(event.target.value) || 0))
                  setFoodQuota(side, value)
                }}
              />
            </label>
            <label>
              <span>Seating Count</span>
              <input
                type="number"
                min="0"
                max={SEATING_CAPACITY}
                value={seatingCounts[side]}
                onChange={(event) => {
                  const value = Math.min(SEATING_CAPACITY, Math.max(0, Number(event.target.value) || 0))
                  setSeatingQuota(side, value)
                }}
              />
            </label>
          </div>
        ))}
      </div>
      <div className="priority-sections">
        {renderSection('food', 'Food Package')}
        {renderSection('extra', 'Extra Food Package')}
        {renderSection('special', 'Special Food')}
        {renderSection('seating', 'Seating')}
        {renderSection('other', 'Others')}
        {renderSection('not-attending', 'Not Attending')}
      </div>
    </main>

    {isAddDialogOpen && (
      <div
        className="priority-dialog-backdrop"
        role="presentation"
        onClick={() => setIsAddDialogOpen(false)}
      >
        <div
          className="priority-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Add attendee"
          onClick={(event) => event.stopPropagation()}
        >
          <h2>Add attendee</h2>
          <form
            className="priority-dialog-form"
            onSubmit={(event) => {
              event.preventDefault()
              submitNewAttendee()
            }}
          >
            <label>
              <span>Last name</span>
              <input
                type="text"
                value={newAttendeeForm.lastName}
                autoFocus
                onChange={(event) =>
                  setNewAttendeeForm((form) => ({ ...form, lastName: event.target.value }))
                }
              />
            </label>
            <label>
              <span>Given name</span>
              <input
                type="text"
                value={newAttendeeForm.firstName}
                onChange={(event) =>
                  setNewAttendeeForm((form) => ({ ...form, firstName: event.target.value }))
                }
              />
            </label>
            <label>
              <span>Role</span>
              <select
                value={newAttendeeForm.role}
                onChange={(event) =>
                  setNewAttendeeForm((form) => ({ ...form, role: event.target.value as Relationship }))
                }
              >
                {TITLE_OPTIONS.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </label>
            {newAttendeeForm.role === 'Companion' && (
              <label>
                <span>Companion of</span>
                <select
                  value={newAttendeeForm.companionOf ?? ''}
                  onChange={(event) =>
                    setNewAttendeeForm((form) => ({ ...form, companionOf: event.target.value || null }))
                  }
                >
                  <option value="">Select attendee…</option>
                  {companionCandidates().map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              <span>Side</span>
              <select
                value={newAttendeeForm.side}
                onChange={(event) =>
                  setNewAttendeeForm((form) => ({ ...form, side: event.target.value as 'Groom' | 'Bride' }))
                }
              >
                <option value="Groom">Groom</option>
                <option value="Bride">Bride</option>
              </select>
            </label>
            <label>
              <span>Food status</span>
              <select
                value={newAttendeeForm.foodStatus}
                onChange={(event) =>
                  setNewAttendeeForm((form) => ({ ...form, foodStatus: event.target.value as FoodStatus }))
                }
              >
                <option value="food">Food Package</option>
                <option value="special">Special Food</option>
                <option value="other">Other</option>
              </select>
            </label>
            <div className="priority-dialog-actions">
              <button
                type="button"
                className="priority-reset"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="priority-save"
                disabled={newAttendeeForm.role === 'Companion' && !newAttendeeForm.companionOf}
              >
                Add attendee
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {roleEditGuestId !== null && (
      <div
        className="priority-dialog-backdrop"
        role="presentation"
        onClick={() => setRoleEditGuestId(null)}
      >
        <div
          className="priority-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Edit role"
          onClick={(event) => event.stopPropagation()}
        >
          <h2>Edit Role</h2>
          <form
            className="priority-dialog-form"
            onSubmit={(event) => {
              event.preventDefault()
              submitRoleEdit()
            }}
          >
            <label>
              <span>Role</span>
              <select
                value={roleEditValue}
                autoFocus
                onChange={(event) => setRoleEditValue(event.target.value as Relationship)}
              >
                {TITLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            {roleEditValue === 'Companion' && (
              <label>
                <span>Companion of</span>
                <select
                  value={roleEditCompanionOf ?? ''}
                  onChange={(event) => setRoleEditCompanionOf(event.target.value || null)}
                >
                  <option value="">Select attendee…</option>
                  {companionCandidates(roleEditGuestId ?? undefined).map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="priority-dialog-actions">
              <button
                type="button"
                className="priority-reset"
                onClick={() => setRoleEditGuestId(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="priority-save"
                disabled={roleEditValue === 'Companion' && !roleEditCompanionOf}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PriorityPage />
  </StrictMode>,
)