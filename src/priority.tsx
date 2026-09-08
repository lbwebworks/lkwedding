import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { siteData, type Attendee } from './data/siteData'
import './index.css'
import './priority.css'

type PriorityGuest = {
  id: string
  name: string
  group: string
  side: 'Groom' | 'Bride'
  isSpecialFood: boolean
  isFoodPackage: boolean
  willAttend: boolean
  isCompanion: boolean
}

type TableSection = 'food' | 'special' | 'seating' | 'other' | 'not-attending'
type FoodCounts = { Groom: number; Bride: number }
type SeatingCounts = { Groom: number; Bride: number }

const STORAGE_KEY = 'lee-kish-priority-order'
const SPECIAL_FOOD_STORAGE_KEY = 'lee-kish-priority-special-food'
const FOOD_PACKAGE_STORAGE_KEY = 'lee-kish-priority-membership-v1'
const FOOD_QUOTA_STORAGE_KEY = 'lee-kish-priority-food-quota-v4'
const SEATING_QUOTA_STORAGE_KEY = 'lee-kish-priority-seating-quota-v1'
const FOOD_CAPACITY = 100
const HALL_CAPACITY = 150
const SEATING_CAPACITY = 150

const attendeeName = (attendee: Attendee) => `${attendee.LastName}, ${attendee.FirstName}`.trim()
const toPriorityGuest = (attendee: Attendee): PriorityGuest => {
  const companionOf = attendee.CompanionOf
    ? siteData.attendees.find((candidate) => candidate.Id === attendee.CompanionOf)
    : undefined

  return {
    id: attendee.Id,
    name: attendeeName(attendee),
    group: companionOf ? `Companion (${companionOf.FirstName})` : attendee.Title,
    side: attendee.Side === 'Bride' ? 'Bride' : 'Groom',
    isSpecialFood: attendee.IsFoodSpecial,
    isFoodPackage: attendee.IsFoodPackage,
    willAttend: attendee.WillAttend,
    isCompanion: attendee.CompanionOf !== null,
  }
}

const defaultGuests = [...siteData.priorityOrder]
  .sort((left, right) => left.priority - right.priority)
  .map(({ attendeeId }) => siteData.attendees.find((attendee) => attendee.Id === attendeeId))
  .filter((attendee): attendee is Attendee => attendee !== undefined)
  .map(toPriorityGuest)

function getInitialGuests() {
  const savedOrder = window.localStorage.getItem(STORAGE_KEY)

  if (!savedOrder) {
    return defaultGuests
  }

  try {
    const savedRoster = JSON.parse(savedOrder) as Array<string | { id: string; side: 'Groom' | 'Bride'; willAttend?: boolean }>
    const guestById = new Map(defaultGuests.map((guest) => [guest.id, guest]))
    const orderedGuests = savedRoster
      .map((savedGuest) => {
        const id = typeof savedGuest === 'string' ? savedGuest : savedGuest.id
        const guest = guestById.get(id)
        return guest && typeof savedGuest !== 'string'
          ? { ...guest, side: savedGuest.side, willAttend: savedGuest.willAttend ?? guest.willAttend }
          : guest
      })
      .filter((guest): guest is PriorityGuest => guest !== undefined)
    const savedIds = savedRoster.map((savedGuest) =>
      typeof savedGuest === 'string' ? savedGuest : savedGuest.id,
    )
    const addedGuests = defaultGuests.filter((guest) => !savedIds.includes(guest.id))

    return [...orderedGuests, ...addedGuests]
  } catch {
    return defaultGuests
  }
}

function getInitialSpecialFoodNames() {
  const saved = window.localStorage.getItem(SPECIAL_FOOD_STORAGE_KEY)
  const defaultSpecialFoodNames = siteData.attendees
    .filter((attendee) => attendee.IsFoodSpecial)
    .map(attendeeName)

  if (!saved) {
    return defaultSpecialFoodNames
  }

  try {
    const savedNames = JSON.parse(saved) as string[]
    return Array.isArray(savedNames) ? savedNames : defaultSpecialFoodNames
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
  }

  const downloadGeneratedData = () => {
    const attendeeById = new Map(siteData.attendees.map((attendee) => [attendee.Id, attendee]))
    const attendees = guests.map((guest) => {
      const attendee = attendeeById.get(guest.id)
      return attendee
        ? {
            ...attendee,
            Side: guest.side,
            IsFoodSpecial: guest.isSpecialFood || specialFoodNames.includes(guest.name),
            IsFoodPackage: guest.isFoodPackage,
            WillAttend: guest.willAttend,
          }
        : null
    }).filter((attendee): attendee is NonNullable<typeof attendee> => attendee !== null)
    const generatedData = {
      attendees,
      priorityOrder: guests.map((guest, index) => ({
        attendeeId: guest.id,
        priority: index + 1,
      })),
      priorityFood: foodCounts,
      prioritySeating: seatingCounts,
    }
    const blob = new Blob([`${JSON.stringify(generatedData, null, 2)}\n`], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'attendee-data.json'
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
      ? { ...item, isFoodPackage: !item.isFoodPackage, isSpecialFood: false }
      : item))
    setOpenMenuGuestId(null)
  }

  const moveGuestToSide = (guestId: string, side: 'Groom' | 'Bride') => {
    saveOrder(guests.map((guest) => guest.id === guestId ? { ...guest, side } : guest))
    setOpenMenuGuestId(null)
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
    const specialGuests = sideGuests.filter(
      (guest) => guest.isSpecialFood || specialFoodNames.includes(guest.name),
    )
    const packageGuests = sideGuests.filter((guest) => guest.isFoodPackage && !guest.isSpecialFood)
    const regularGuests = sideGuests.filter((guest) => !guest.isFoodPackage && !guest.isSpecialFood)
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
    sideCount: number,
    tableSide: 'Groom' | 'Bride',
  ) => {
    const isSpecialFood = guest.isSpecialFood || specialFoodNames.includes(guest.name)
    const isMenuOpen = openMenuGuestId === guest.id

    return (
      <li
        key={guest.id}
        className={`priority-row${draggedGuestId === guest.id ? ' is-dragging' : ''}${isSpecialFood ? ' has-special-food' : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.stopPropagation()
          moveGuest(guest.id, tableSide)
          setDraggedGuestId(null)
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
          onDragEnd={() => setDraggedGuestId(null)}
        >
          ::
        </button>
        <span className="priority-rank">{String(sideCount).padStart(2, '0')}</span>
        <div className="priority-guest"><strong>{guest.name}</strong></div>
        <span className="priority-group">{guest.group}</span>
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
                <button type="button" role="menuitem" className="priority-menu-item is-add" onClick={() => moveGuestToSide(guest.id, guest.side === 'Groom' ? 'Bride' : 'Groom')}>
                  Move to {guest.side === 'Groom' ? 'Bride' : 'Groom'}
                </button>
                <button type="button" role="menuitem" className={`priority-menu-item${guest.willAttend ? ' is-remove' : ' is-add'}`} onClick={() => setGuestAttendance(guest.id, !guest.willAttend)}>
                  {guest.willAttend ? 'Mark not attending' : 'Mark attending'}
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
          className="priority-list"
          onClick={() => setOpenMenuGuestId(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            moveGuestToTable(side, section)
            setDraggedGuestId(null)
          }}
        >
          {tableGuests.map((guest) => {
            const tableCount = tableGuests.findIndex((item) => item.id === guest.id) + 1
            return renderGuestRow(guest, tableCount, side)
          })}
          {section === 'food' && Array.from({
            length: Math.max(0, foodCounts[side] - tableGuests.length),
          }, (_, index) => (
            <li className="priority-row is-empty-slot" key={`empty-${side}-${index}`}>
              <span />
              <span className="priority-rank">{String(tableGuests.length + index + 1).padStart(2, '0')}</span>
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

  const foodCapacity = FOOD_CAPACITY
  const hallCapacity = HALL_CAPACITY

  return (
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
          <span>Priority food</span>
          <strong>{foodCounts.Groom + foodCounts.Bride}</strong>
          <small>food stamps available</small>
        </div>
        <div>
          <span>Special food</span>
          <strong>{specialFoodNames.length}</strong>
          <small>separate food arrangement</small>
        </div>
        <div>
          <span>Hall capacity</span>
          <strong>{hallCapacity}</strong>
          <small>maximum seats available</small>
        </div>
        <div>
          <span>Priority roster</span>
          <strong>{guests.length}</strong>
          <small>guests currently listed</small>
        </div>
      </section>

      <div className="priority-list-heading">
        <div>
          <p className="priority-eyebrow">Attendance order</p>
          <h2>Priority tables</h2>
        </div>
        <button type="button" className="priority-reset" onClick={() => saveOrder(defaultGuests)}>
          Reset order
        </button>
        <button type="button" className="priority-save" onClick={downloadGeneratedData}>
          Download data
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
        {renderSection('special', 'Special Food')}
        {renderSection('seating', 'Seating')}
        {renderSection('other', 'Others')}
        {renderSection('not-attending', 'Not Attending')}
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PriorityPage />
  </StrictMode>,
)