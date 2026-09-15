/// <reference types="vite/client" />

// Build-time modified timestamps (ms since epoch) of the data files, injected
// via `define` in vite.config.ts. Pages compare these to their saved localStorage
// timestamp to decide whether file data or local edits are more recent.
declare const __ROSTER_DATA_MTIME__: number
declare const __SITE_DATA_MTIME__: number
declare const __SEATPLAN_DATA_MTIME__: number
