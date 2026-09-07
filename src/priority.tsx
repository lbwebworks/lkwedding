import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { siteData, type Attendee } from './data/siteData'
import './index.css'
import './priority.css'

type PriorityGuest = {
  id: string
  name: string
  group: string
  isSpecialFood: boolean
  isCompanion: boolean
}

const STORAGE_KEY = 'lee-kish-priority-order'
const SPECIAL_FOOD_STORAGE_KEY = 'lee-kish-priority-special-food'
const FOOD_CAPACITY = 100
const HALL_CAPACITY = 150

const attendeeName = (attendee: Attendee) => `${attendee.FirstName} ${attendee.LastName}`.trim()
const toPriorityGuest = (attendee: Attendee): PriorityGuest => ({
  id: attendee.Id,
  name: attendeeName(attendee),
  group: attendee.Title,
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
    const savedIds = JSON.parse(savedOrder) as string[]
    const guestById = new Map(defaultGuests.map((guest) => [guest.id, guest]))
    const orderedGuests = savedIds
      .map((id) => guestById.get(id))
      .filter((guest): guest is PriorityGuest => guest !== undefined)
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

function PriorityPage() {
  const [guests, setGuests] = useState(getInitialGuests)
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null)
  const [specialFoodNames, setSpecialFoodNames] = useState(getInitialSpecialFoodNames)
  const [openMenuGuestId, setOpenMenuGuestId] = useState<string | null>(null)

  const saveOrder = (nextGuests: PriorityGuest[]) => {
    setGuests(nextGuests)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextGuests.map((guest) => guest.id)))
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

  const moveGuest = (targetGuestId: string) => {
    if (!draggedGuestId || draggedGuestId === targetGuestId) {
      return
    }

    const sourceIndex = guests.findIndex((guest) => guest.id === draggedGuestId)
    const targetIndex = guests.findIndex((guest) => guest.id === targetGuestId)

    if (sourceIndex === -1 || targetIndex === -1) {
      return
    }

    const nextGuests = [...guests]
    const [movedGuest] = nextGuests.splice(sourceIndex, 1)
    nextGuests.splice(targetIndex, 0, movedGuest)
    saveOrder(nextGuests)
  }

  const foodCapacity = FOOD_CAPACITY
  const hallCapacity = HALL_CAPACITY

  // Running count of non-special-food guests for food stamp allocation
  let foodStampCount = 0

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
          <strong>{foodCapacity}</strong>
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

      <section className="priority-list-section" aria-label="Sortable guest priority list">
        <div className="priority-list-heading">
          <div>
            <p className="priority-eyebrow">Attendance order</p>
            <h2>Guest Roster</h2>
          </div>
          <button type="button" className="priority-reset" onClick={() => saveOrder(defaultGuests)}>
            Reset order
          </button>
        </div>

        <ol className="priority-list" onClick={() => setOpenMenuGuestId(null)}>
          {guests.map((guest, index) => {
            const isSpecialFood = guest.isSpecialFood || specialFoodNames.includes(guest.name)
            const isMenuOpen = openMenuGuestId === guest.id

            // Special food guests sit outside the food stamp count
            let allocationLabel: string
            let allocationClass: string
            if (isSpecialFood) {
              allocationLabel = 'Special food'
              allocationClass = 'priority-allocation is-special-food'
            } else {
              const slot = foodStampCount
              foodStampCount++
              if (slot < foodCapacity) {
                allocationLabel = 'Food priority'
                allocationClass = 'priority-allocation is-food'
              } else {
                allocationLabel = 'Seating priority'
                allocationClass = 'priority-allocation'
              }
            }

            return (
              <li
                key={guest.id}
                className={`priority-row${draggedGuestId === guest.id ? ' is-dragging' : ''}${isSpecialFood ? ' has-special-food' : ''}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  moveGuest(guest.id)
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
                <span className="priority-rank">{String(index + 1).padStart(2, '0')}</span>
                <div className="priority-guest">
                  <strong>{guest.name}</strong>
                </div>
                <span className="priority-group">{guest.group}</span>
                <span className={allocationClass}>
                  {allocationLabel}
                </span>
                <div className="priority-actions">
                  {isSpecialFood && (
                    <span className="priority-special-food-badge" title="Special food">🍽</span>
                  )}
                  {guest.isCompanion && (
                    <span className="priority-badge" title="Companion">🤝</span>
                  )}
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
                      <div
                        className="priority-menu"
                        role="menu"
                        onClick={(event) => event.stopPropagation()}
                      >
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
          })}
        </ol>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PriorityPage />
  </StrictMode>,
)