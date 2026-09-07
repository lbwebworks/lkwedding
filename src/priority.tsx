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
  isCompanion: boolean
}

type TableSection = 'food' | 'special' | 'other'
type FoodCounts = { Groom: number; Bride: number }

const STORAGE_KEY = 'lee-kish-priority-order'
const SPECIAL_FOOD_STORAGE_KEY = 'lee-kish-priority-special-food'
const FOOD_QUOTA_STORAGE_KEY = 'lee-kish-priority-food-quota-v4'
const FOOD_CAPACITY = 100
const HALL_CAPACITY = 150

const attendeeName = (attendee: Attendee) => `${attendee.FirstName} ${attendee.LastName}`.trim()
const toPriorityGuest = (attendee: Attendee): PriorityGuest => ({
  id: attendee.Id,
  name: attendeeName(attendee),
  group: attendee.Title,
  side: attendee.Side === 'Bride' ? 'Bride' : 'Groom',
  isSpecialFood: attendee.IsFoodSpecial,
  isCompanion: attendee.CompanionOf !== null,
})

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
    const savedRoster = JSON.parse(savedOrder) as Array<string | { id: string; side: 'Groom' | 'Bride' }>
    const guestById = new Map(defaultGuests.map((guest) => [guest.id, guest]))
    const orderedGuests = savedRoster
      .map((savedGuest) => {
        const id = typeof savedGuest === 'string' ? savedGuest : savedGuest.id
        const guest = guestById.get(id)
        return guest && typeof savedGuest !== 'string'
          ? { ...guest, side: savedGuest.side }
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

function PriorityPage() {
  const [guests, setGuests] = useState(getInitialGuests)
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null)
  const [specialFoodNames, setSpecialFoodNames] = useState(getInitialSpecialFoodNames)
  const [openMenuGuestId, setOpenMenuGuestId] = useState<string | null>(null)
  const [foodCounts, setFoodCounts] = useState(getInitialFoodCounts)

  const saveOrder = (nextGuests: PriorityGuest[]) => {
    setGuests(nextGuests)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextGuests.map(({ id, side }) => ({ id, side }))),
    )
  }

  const setFoodQuota = (side: 'Groom' | 'Bride', value: number) => {
    const nextCounts: FoodCounts = side === 'Groom'
      ? { Groom: value, Bride: FOOD_CAPACITY - value }
      : { Groom: FOOD_CAPACITY - value, Bride: value }
    setFoodCounts(nextCounts)
    window.localStorage.setItem(FOOD_QUOTA_STORAGE_KEY, JSON.stringify(nextCounts))
  }

  const toggleSpecialFood = (guestName: string) => {
    setSpecialFoodNames((current) => {
      const next = current.includes(guestName)
        ? current.filter((name) => name !== guestName)
        : [...current, guestName]
      window.localStorage.setItem(SPECIAL_FOOD_STORAGE_KEY, JSON.stringify(next))
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
    nextGuests.splice(targetIndex, 0, movedGuest)
    saveOrder(nextGuests)
  }

  const getTableGuests = (side: 'Groom' | 'Bride', section: TableSection) => {
    const sideGuests = guests.filter((guest) => guest.side === side)
    const specialGuests = sideGuests.filter(
      (guest) => guest.isSpecialFood || specialFoodNames.includes(guest.name),
    )
    const regularGuests = sideGuests.filter(
      (guest) => !(guest.isSpecialFood || specialFoodNames.includes(guest.name)),
    )
    const foodCount = foodCounts[side]
    if (section === 'special') {
      return specialGuests
    }
    if (section === 'food') {
      return regularGuests.slice(0, foodCount)
    }
    return regularGuests.slice(foodCount)
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

    const sideGuests = nextGuests.filter((guest) => guest.side === targetSide)
    const specialGuests = sideGuests.filter(
      (guest) => guest.isSpecialFood || specialFoodNames.includes(guest.name),
    )
    const regularGuests = sideGuests.filter(
      (guest) => !(guest.isSpecialFood || specialFoodNames.includes(guest.name)),
    )
    const foodCount = foodCounts[targetSide]
    const targetGuests = section === 'special'
      ? specialGuests
      : section === 'food'
        ? regularGuests.slice(0, foodCount)
        : regularGuests.slice(foodCount)
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
    rank: number,
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
        <span className="priority-rank">{String(rank + 1).padStart(2, '0')}</span>
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
                  {isSpecialFood ? 'Remove from special food' : 'Add to special food'}
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
    )
  }

  const renderSide = (side: 'Groom' | 'Bride') => {
    const foodCount = foodCounts[side]
    const sections: Array<[TableSection, string]> = [
      ['food', 'Food priority'],
      ['special', 'Special food'],
      ['other', 'Others'],
    ]

    return (
      <section className="priority-side" aria-label={`${side} side priority tables`}>
        <div className="priority-side-heading">
          <h2>{side} side</h2>
          <label>
            <span>Food priority count</span>
            <input
              type="number"
              min="0"
              max={FOOD_CAPACITY}
              value={foodCount}
              onChange={(event) => {
                const value = Math.min(FOOD_CAPACITY, Math.max(0, Number(event.target.value) || 0))
                setFoodQuota(side, value)
              }}
            />
          </label>
        </div>
        {sections.map(([section, title]) => {
          const tableGuests = getTableGuests(side, section)
          return (
            <section className="priority-table-section" key={section} aria-label={`${side} ${title}`}>
              <h3>{title}</h3>
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
                {tableGuests.map((guest) => renderGuestRow(guest, guests.findIndex((item) => item.id === guest.id), side))}
              </ol>
            </section>
          )
        })}
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
      </div>
      <div className="priority-sides">
        {renderSide('Groom')}
        {renderSide('Bride')}
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PriorityPage />
  </StrictMode>,
)