import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { siteData, isAttending, type Roster } from './data/siteData'
import { seatPlan as defaultSeatPlan, type SeatPlan, type SeatTable } from './data/seatPlanData'
import './index.css'
import './seatplan.css'

const STORAGE_KEY = 'lee-kish-seatplan-v1'
// When the plan was last saved. Compared to the data files' build-time mtimes
// so newer file data (a new plan, or a roster change) supersedes stale state.
const SAVED_AT_STORAGE_KEY = 'lee-kish-seatplan-saved-at'
const MIN_COLUMNS = 1
const MAX_COLUMNS = 12

// The seat plan depends on seatPlanData.ts (the plan) and on rosterData.ts /
// siteData.ts (who is attending). Reset if any of them was built more recently
// than the last local save.
const SEATPLAN_DATA_MTIME = Math.max(
  __SEATPLAN_DATA_MTIME__,
  __ROSTER_DATA_MTIME__,
  __SITE_DATA_MTIME__,
)

// If a data file was rebuilt after the last local save, drop the saved plan so
// the page loads fresh from seatPlanData.ts. Later local edits still win.
const invalidateStaleSeatplanState = () => {
  const savedAt = Number(window.localStorage.getItem(SAVED_AT_STORAGE_KEY) ?? 0)
  if (!Number.isFinite(savedAt) || SEATPLAN_DATA_MTIME > savedAt) {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(SAVED_AT_STORAGE_KEY)
  }
}
invalidateStaleSeatplanState()

// Record that the plan was just saved (module-level so it is not treated as a
// render-phase impure call).
const markSeatplanSaved = () => {
  window.localStorage.setItem(SAVED_AT_STORAGE_KEY, String(Date.now()))
}

const fullName = (roster: Roster) => `${roster.LastName}, ${roster.FirstName}`.trim()

// Everyone except the couple (Groom/Bride, who have dedicated front seating) can
// be placed on the plan — including not-yet-attending guests, so a last-minute
// confirmation doesn't require re-seating. Attendance is shown as a distinction
// (see isAttending), not by excluding them from the plan.
const seatableRoster = siteData.rosters.filter(
  (roster) => roster.Relationship !== 'Groom' && roster.Relationship !== 'Bride',
)
const rosterById = new Map(seatableRoster.map((roster) => [roster.Id, roster]))

const clampColumns = (value: number) =>
  Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.floor(value) || MIN_COLUMNS))

const sanitizeSeatPlan = (plan: SeatPlan): SeatPlan => {
  const seen = new Set<string>()
  const tables = plan.tables.map((table) => ({
    id: table.id,
    name: table.name,
    // Drop unknown ids (not attending / not in roster) and de-duplicate so a
    // guest can only sit at one table.
    guestIds: table.guestIds.filter((id) => {
      if (seen.has(id) || !rosterById.has(id)) {
        return false
      }
      seen.add(id)
      return true
    }),
  }))
  return { columns: clampColumns(plan.columns), tables }
}

const getInitialSeatPlan = (): SeatPlan => {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return sanitizeSeatPlan(defaultSeatPlan)
  }
  try {
    const parsed = JSON.parse(saved) as SeatPlan
    if (parsed && Array.isArray(parsed.tables) && typeof parsed.columns === 'number') {
      return sanitizeSeatPlan(parsed)
    }
  } catch {
    // fall through
  }
  return sanitizeSeatPlan(defaultSeatPlan)
}

type DragState = { guestId: string; from: string | 'pane' } | null

function SeatPlanPage() {
  const [plan, setPlan] = useState<SeatPlan>(getInitialSeatPlan)
  const [drag, setDrag] = useState<DragState>(null)
  const [dropTableId, setDropTableId] = useState<string | 'pane' | null>(null)
  const [attendingOpen, setAttendingOpen] = useState(true)
  const [nonAttendingOpen, setNonAttendingOpen] = useState(true)

  const savePlan = (next: SeatPlan) => {
    setPlan(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    markSeatplanSaved()
  }

  // Ids currently seated at any table.
  const seatedIds = new Set(plan.tables.flatMap((table) => table.guestIds))
  const unseated = seatableRoster.filter((roster) => !seatedIds.has(roster.Id))
  const unseatedAttending = unseated.filter((roster) => isAttending(roster.Id))
  const unseatedNonAttending = unseated.filter((roster) => !isAttending(roster.Id))

  const setColumns = (value: number) => {
    savePlan({ ...plan, columns: clampColumns(value) })
  }

  const addTable = () => {
    const nextNumber = plan.tables.length + 1
    const newTable: SeatTable = {
      id: `table-${Date.now()}`,
      name: `Table ${nextNumber}`,
      guestIds: [],
    }
    savePlan({ ...plan, tables: [...plan.tables, newTable] })
  }

  const deleteTable = (tableId: string) => {
    const table = plan.tables.find((item) => item.id === tableId)
    if (!table) {
      return
    }
    if (
      table.guestIds.length > 0 &&
      !window.confirm(`Delete "${table.name}"? Its ${table.guestIds.length} seated guest(s) return to the attendees list.`)
    ) {
      return
    }
    savePlan({ ...plan, tables: plan.tables.filter((item) => item.id !== tableId) })
  }

  const renameTable = (tableId: string, name: string) => {
    savePlan({
      ...plan,
      tables: plan.tables.map((table) => (table.id === tableId ? { ...table, name } : table)),
    })
  }

  const removeFromTable = (tableId: string, guestId: string) => {
    savePlan({
      ...plan,
      tables: plan.tables.map((table) =>
        table.id === tableId
          ? { ...table, guestIds: table.guestIds.filter((id) => id !== guestId) }
          : table,
      ),
    })
  }

  // Seat a guest at a table (optionally before a specific guest id for ordering).
  // Removes the guest from any other table first so nobody is double-seated.
  const seatGuest = (guestId: string, targetTableId: string, beforeGuestId?: string) => {
    const tables = plan.tables.map((table) => ({
      ...table,
      guestIds: table.guestIds.filter((id) => id !== guestId),
    }))
    const target = tables.find((table) => table.id === targetTableId)
    if (!target) {
      return
    }
    if (beforeGuestId && beforeGuestId !== guestId) {
      const index = target.guestIds.indexOf(beforeGuestId)
      if (index >= 0) {
        target.guestIds.splice(index, 0, guestId)
      } else {
        target.guestIds.push(guestId)
      }
    } else {
      target.guestIds.push(guestId)
    }
    savePlan({ ...plan, tables })
  }

  const returnToPane = (guestId: string) => {
    savePlan({
      ...plan,
      tables: plan.tables.map((table) => ({
        ...table,
        guestIds: table.guestIds.filter((id) => id !== guestId),
      })),
    })
  }

  const exportPlan = () => {
    const formatTable = (table: SeatTable) =>
      `    { id: ${JSON.stringify(table.id)}, name: ${JSON.stringify(table.name)}, guestIds: [${table.guestIds
        .map((id) => JSON.stringify(id))
        .join(', ')}] },`
    const body = plan.tables.map(formatTable).join('\n')
    const fileContents =
      `export const seatPlan: SeatPlan = {\n` +
      `  columns: ${plan.columns},\n` +
      `  tables: [\n${body}\n  ],\n` +
      `}\n`
    const blob = new Blob([fileContents], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'seat-plan.ts'
    link.click()
    URL.revokeObjectURL(url)
  }

  // --- Drag and drop -------------------------------------------------------
  const onDragStartGuest = (event: React.DragEvent, guestId: string, from: string | 'pane') => {
    event.dataTransfer.effectAllowed = 'move'
    setDrag({ guestId, from })
  }
  const onDragEnd = () => {
    setDrag(null)
    setDropTableId(null)
  }
  const onDropTable = (tableId: string, beforeGuestId?: string) => {
    if (drag) {
      seatGuest(drag.guestId, tableId, beforeGuestId)
    }
    onDragEnd()
  }
  const onDropPane = () => {
    if (drag && drag.from !== 'pane') {
      returnToPane(drag.guestId)
    }
    onDragEnd()
  }

  // A collapsible section of unseated guests in the side pane. Attending and
  // not-attending guests behave identically (drag onto a table to seat); the
  // `notAttending` flag only drives the visual distinction.
  const renderUnseatedGroup = ({
    title,
    guests,
    open,
    onToggle,
    emptyLabel,
    notAttending,
  }: {
    title: string
    guests: Roster[]
    open: boolean
    onToggle: () => void
    emptyLabel: string
    notAttending: boolean
  }) => (
    <section className={`seatplan-group${notAttending ? ' is-not-attending' : ''}`}>
      <button
        type="button"
        className="seatplan-attendees-head seatplan-group-toggle"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className={`seatplan-group-chevron${open ? ' is-open' : ''}`} aria-hidden="true">
          ▸
        </span>
        <h2>{title}</h2>
        <span className="seatplan-attendees-count">{guests.length}</span>
      </button>
      {open ? (
        <ul className="seatplan-attendees-list">
          {guests.map((roster) => (
            <li
              key={roster.Id}
              className={`seatplan-attendee${drag?.guestId === roster.Id ? ' is-dragging' : ''}${notAttending ? ' is-not-attending' : ''}`}
              draggable
              onDragStart={(event) => onDragStartGuest(event, roster.Id, 'pane')}
              onDragEnd={onDragEnd}
            >
              <span className="seatplan-attendee-name">{fullName(roster)}</span>
              <span className="seatplan-attendee-side">{roster.Side}</span>
            </li>
          ))}
          {guests.length === 0 ? (
            <li className="seatplan-attendee is-empty">{emptyLabel}</li>
          ) : null}
        </ul>
      ) : null}
    </section>
  )

  return (
    <main className="seatplan-page">
      <header className="seatplan-header">
        <a className="seatplan-back-link" href={`${import.meta.env.BASE_URL}`}>
          Back to invitation
        </a>
        <p className="seatplan-eyebrow">Coordinator workspace</p>
        <h1>Seat Plan</h1>
        <p className="seatplan-description">
          Arrange guests into tables. Drag a guest from the right onto a table, or drag them back to
          unseat. Not-attending guests can be pre-seated too (shown dimmed) in case they confirm
          later. Changes are kept in this browser.
        </p>
      </header>

      <div className="seatplan-controls">
        <label className="seatplan-columns-control">
          <span>Columns</span>
          <input
            type="number"
            min={MIN_COLUMNS}
            max={MAX_COLUMNS}
            value={plan.columns}
            onChange={(event) => setColumns(Number(event.target.value))}
          />
        </label>
        <button type="button" className="seatplan-btn" onClick={addTable}>
          Add table
        </button>
        <button type="button" className="seatplan-btn" onClick={exportPlan}>
          Export
        </button>
        <span className="seatplan-summary">
          {seatedIds.size} seated · {unseatedAttending.length} unseated · {unseatedNonAttending.length} not attending
        </span>
      </div>

      <div className="seatplan-body">
        <section className="seatplan-content" aria-label="Tables">
          {plan.tables.length === 0 ? (
            <p className="seatplan-empty">No tables yet. Click "Add table" to start.</p>
          ) : (
            <div
              className="seatplan-grid"
              style={{ gridTemplateColumns: `repeat(${plan.columns}, minmax(0, 1fr))` }}
            >
              {plan.tables.map((table) => (
                <article
                  key={table.id}
                  className={`seatplan-table${dropTableId === table.id ? ' is-drop-target' : ''}`}
                  onDragOver={(event) => {
                    if (drag) {
                      event.preventDefault()
                      setDropTableId(table.id)
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    onDropTable(table.id)
                  }}
                >
                  <div className="seatplan-table-head">
                    <input
                      className="seatplan-table-name"
                      value={table.name}
                      aria-label="Table name"
                      onChange={(event) => renameTable(table.id, event.target.value)}
                    />
                    <span className="seatplan-table-count">{table.guestIds.length}</span>
                    <button
                      type="button"
                      className="seatplan-table-delete"
                      aria-label={`Delete ${table.name}`}
                      onClick={() => deleteTable(table.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <ol className="seatplan-seats">
                    {table.guestIds.map((id, index) => {
                      const roster = rosterById.get(id)
                      return (
                        <li
                          key={id}
                          className={`seatplan-seat${drag?.guestId === id ? ' is-dragging' : ''}${roster && !isAttending(id) ? ' is-not-attending' : ''}`}
                          draggable
                          onDragStart={(event) => onDragStartGuest(event, id, table.id)}
                          onDragEnd={onDragEnd}
                          onDragOver={(event) => {
                            if (drag) {
                              event.preventDefault()
                              event.stopPropagation()
                              setDropTableId(table.id)
                            }
                          }}
                          onDrop={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            onDropTable(table.id, id)
                          }}
                        >
                          <span className="seatplan-seat-num">{index + 1}</span>
                          <span className="seatplan-seat-name">{roster ? fullName(roster) : id}</span>
                          <button
                            type="button"
                            className="seatplan-seat-remove"
                            aria-label={`Remove ${roster ? fullName(roster) : id} from ${table.name}`}
                            onClick={() => removeFromTable(table.id, id)}
                          >
                            −
                          </button>
                        </li>
                      )
                    })}
                    {table.guestIds.length === 0 ? (
                      <li className="seatplan-seat is-empty">Drag guests here</li>
                    ) : null}
                  </ol>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside
          className={`seatplan-attendees${dropTableId === 'pane' ? ' is-drop-target' : ''}`}
          aria-label="Unseated guests"
          onDragOver={(event) => {
            if (drag && drag.from !== 'pane') {
              event.preventDefault()
              setDropTableId('pane')
            }
          }}
          onDrop={(event) => {
            event.preventDefault()
            onDropPane()
          }}
        >
          {renderUnseatedGroup({
            title: 'Attendees',
            guests: unseatedAttending,
            open: attendingOpen,
            onToggle: () => setAttendingOpen((open) => !open),
            emptyLabel: 'Everyone is seated.',
            notAttending: false,
          })}
          {renderUnseatedGroup({
            title: 'Not attending',
            guests: unseatedNonAttending,
            open: nonAttendingOpen,
            onToggle: () => setNonAttendingOpen((open) => !open),
            emptyLabel: 'No one marked not attending.',
            notAttending: true,
          })}
        </aside>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SeatPlanPage />
  </StrictMode>,
)
