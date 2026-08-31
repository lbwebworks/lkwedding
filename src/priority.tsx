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

function PriorityPage() {
  const [guests, setGuests] = useState(getInitialGuests)
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null)

  const saveOrder = (nextGuests: PriorityGuest[]) => {
    setGuests(nextGuests)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextGuests.map((guest) => guest.id)))
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

  const foodCapacity = siteData.priorityGuests.foodCapacity
  const hallCapacity = siteData.priorityGuests.hallCapacity

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

        <ol className="priority-list">
          {guests.map((guest, index) => (
            <li
              key={guest.id}
              className={`priority-row${draggedGuestId === guest.id ? ' is-dragging' : ''}`}
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
                <span>{guest.group}</span>
              </div>
              <span className={`priority-allocation${index < foodCapacity ? ' is-food' : ''}`}>
                {index < foodCapacity ? 'Food priority' : 'Seating priority'}
              </span>
            </li>
          ))}
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