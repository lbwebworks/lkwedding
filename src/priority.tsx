import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { siteData } from './data/siteData'
import './index.css'
import './priority.css'

type PriorityGuest = {
  id: string
  name: string
  group: string
}

const STORAGE_KEY = 'lee-kish-priority-order'
const SPECIAL_FOOD_STORAGE_KEY = 'lee-kish-priority-special-food'
const ENTOURAGE_PLUS_STORAGE_KEY = 'lee-kish-priority-entourage-plus'
const FAMILY_PLUS_STORAGE_KEY = 'lee-kish-priority-family-plus'
const PEERS_PLUS_STORAGE_KEY = 'lee-kish-priority-peers-plus'

const toId = (group: string, name: string, index: number) =>
  `${group}-${name}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const guestGroups = [
  { title: 'Bride and Groom', names: siteData.priorityGuests.couple },
  {
    title: 'Parents',
    names: siteData.entourage.groups
      .filter((group) => group.title.includes('Parents'))
      .flatMap((group) => group.names),
  },
  {
    title: 'Primary Sponsors',
    names: siteData.entourage.groups
      .filter((group) => group.title === 'Principal Sponsors')
      .flatMap((group) => group.names)
      .filter((name) => name !== '...'),
  },
  {
    title: 'Secondary Sponsors',
    names: siteData.entourage.groups
      .filter((group) => siteData.priorityGuests.secondarySponsorRoles.includes(group.title))
      .flatMap((group) => group.names),
  },
  { title: siteData.familyAndRelatives.title, names: siteData.familyAndRelatives.names },
  { title: siteData.peers.title, names: siteData.peers.names },
  // Plus guests — ordered by importance: entouragePlus > familyPlus > peersPlus
  ...(siteData.entouragePlus ?? []).map((g) => ({
    title: `Entourage Plus (${g.inviter})`,
    names: g.invitees,
  })),
  ...(siteData.familyPlus ?? []).map((g) => ({
    title: `Family Plus (${g.inviter})`,
    names: g.invitees,
  })),
  ...(siteData.peersPlus ?? []).map((g) => ({
    title: `Peers Plus (${g.inviter})`,
    names: g.invitees,
  })),
]

const defaultGuests = guestGroups.flatMap(({ title, names }) =>
  names.map((name, index) => ({ id: toId(title, name, index), name, group: title })),
)

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

  if (!saved) {
    return siteData.specialFood
  }

  try {
    const savedNames = JSON.parse(saved) as string[]
    return Array.isArray(savedNames) ? savedNames : siteData.specialFood
  } catch {
    return siteData.specialFood
  }
}

function getInitialPlusList(storageKey: string, seedNames: string[]): string[] {
  const saved = window.localStorage.getItem(storageKey)

  if (!saved) {
    return seedNames
  }

  try {
    const savedNames = JSON.parse(saved) as string[]
    return Array.isArray(savedNames) ? savedNames : seedNames
  } catch {
    return seedNames
  }
}

const initialEntouragePlusNames = () =>
  getInitialPlusList(
    ENTOURAGE_PLUS_STORAGE_KEY,
    siteData.entouragePlus?.flatMap((g) => g.invitees) ?? [],
  )

const initialFamilyPlusNames = () =>
  getInitialPlusList(
    FAMILY_PLUS_STORAGE_KEY,
    siteData.familyPlus?.flatMap((g) => g.invitees) ?? [],
  )

const initialPeersPlusNames = () =>
  getInitialPlusList(
    PEERS_PLUS_STORAGE_KEY,
    siteData.peersPlus?.flatMap((g) => g.invitees) ?? [],
  )

function PriorityPage() {
  const [guests, setGuests] = useState(getInitialGuests)
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null)
  const [specialFoodNames, setSpecialFoodNames] = useState(getInitialSpecialFoodNames)
  const [entouragePlusNames, setEntouragePlusNames] = useState(initialEntouragePlusNames)
  const [familyPlusNames, setFamilyPlusNames] = useState(initialFamilyPlusNames)
  const [peersPlusNames, setPeersPlusNames] = useState(initialPeersPlusNames)
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

  const makePlusToggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    storageKey: string,
  ) => (guestName: string) => {
    setter((current) => {
      const next = current.includes(guestName)
        ? current.filter((name) => name !== guestName)
        : [...current, guestName]
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
    setOpenMenuGuestId(null)
  }

  const toggleEntouragePlus = makePlusToggle(setEntouragePlusNames, ENTOURAGE_PLUS_STORAGE_KEY)
  const toggleFamilyPlus = makePlusToggle(setFamilyPlusNames, FAMILY_PLUS_STORAGE_KEY)
  const togglePeersPlus = makePlusToggle(setPeersPlusNames, PEERS_PLUS_STORAGE_KEY)

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

  const foodCapacity = siteData.priorityGuests.foodCapacity
  const hallCapacity = siteData.priorityGuests.hallCapacity

  // Running count of non-special-food guests for food stamp allocation
  let foodStampCount = 0

  return (
    <main className="priority-page">
      <header className="priority-header">
        <a className="priority-back-link" href={`${import.meta.env.BASE_URL}`}>
          Back to invitation
        </a>
        <p className="priority-eyebrow">Coordinator workspace</p>
        <h1>{siteData.priorityGuests.title}</h1>
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
            const isSpecialFood = specialFoodNames.includes(guest.name)
            const isEntouragePlus = entouragePlusNames.includes(guest.name)
            const isFamilyPlus = familyPlusNames.includes(guest.name)
            const isPeersPlus = peersPlusNames.includes(guest.name)
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
                  {isEntouragePlus && (
                    <span className="priority-badge" title="Entourage plus">👥</span>
                  )}
                  {isFamilyPlus && (
                    <span className="priority-badge" title="Family plus">🏠</span>
                  )}
                  {isPeersPlus && (
                    <span className="priority-badge" title="Peers plus">🤝</span>
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
                        <button
                          type="button"
                          role="menuitem"
                          className={`priority-menu-item${isEntouragePlus ? ' is-remove' : ' is-add'}`}
                          onClick={() => toggleEntouragePlus(guest.name)}
                        >
                          {isEntouragePlus ? 'Remove from entourage plus' : 'Add to entourage plus'}
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className={`priority-menu-item${isFamilyPlus ? ' is-remove' : ' is-add'}`}
                          onClick={() => toggleFamilyPlus(guest.name)}
                        >
                          {isFamilyPlus ? 'Remove from family plus' : 'Add to family plus'}
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className={`priority-menu-item${isPeersPlus ? ' is-remove' : ' is-add'}`}
                          onClick={() => togglePeersPlus(guest.name)}
                        >
                          {isPeersPlus ? 'Remove from peers plus' : 'Add to peers plus'}
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