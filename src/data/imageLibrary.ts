export type ImageEntry = {
  src: string
  fileName: string
}

export type SaveDateImageEntry = ImageEntry & {
  thumbnailSrc: string
  viewerSrc: string
}

const asSortedEntries = (modules: Record<string, string>): ImageEntry[] =>
  Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod]) => ({
      src: mod,
      fileName: path.split('/').pop() ?? path,
    }))

const toUrls = (entries: ImageEntry[]) => entries.map((entry) => entry.src)

const sortEntriesByFileName = (entries: ImageEntry[]) =>
  [...entries].sort((a, b) => a.fileName.localeCompare(b.fileName))

const getFileStem = (fileName: string) => fileName.replace(/\.[^.]+$/, '').toLowerCase()

const allWeddingImages = import.meta.glob<string>([
  '../assets/wedding/**/*.png',
  '../assets/wedding/**/*.jpg',
  '../assets/wedding/**/*.jpeg',
  '../assets/wedding/**/*.webp',
  '../assets/wedding/**/*.avif',
  '../assets/wedding/**/*.PNG',
  '../assets/wedding/**/*.JPG',
  '../assets/wedding/**/*.JPEG',
  '../assets/wedding/**/*.WEBP',
  '../assets/wedding/**/*.AVIF',
], {
  eager: true,
  import: 'default',
})

const pickFolderEntries = (folderPath: string) =>
  asSortedEntries(
    Object.fromEntries(
      Object.entries(allWeddingImages).filter(([path]) =>
        path.includes(`/assets/wedding/${folderPath}/`),
      ),
    ),
  )

const saveDateFullEntries = sortEntriesByFileName(pickFolderEntries('save-the-date'))
const saveDateThumbEntries = sortEntriesByFileName(pickFolderEntries('save-the-date-thumbs'))
const saveDateViewerEntries = sortEntriesByFileName(pickFolderEntries('save-the-date-viewer'))
const saveDateThumbMap = new Map(
  saveDateThumbEntries.map((entry) => [getFileStem(entry.fileName), entry.src]),
)
const saveDateViewerMap = new Map(
  saveDateViewerEntries.map((entry) => [getFileStem(entry.fileName), entry.src]),
)

const toSaveDateEntries = (entries: ImageEntry[]): SaveDateImageEntry[] =>
  entries.map((entry) => ({
    ...entry,
    thumbnailSrc: saveDateThumbMap.get(getFileStem(entry.fileName)) ?? entry.src,
    viewerSrc: saveDateViewerMap.get(getFileStem(entry.fileName)) ?? entry.src,
  }))

export const weddingImages = {
  hero: toUrls(pickFolderEntries('hero')),
  story: toUrls(pickFolderEntries('story')),
  dressLadies: toUrls(pickFolderEntries('dress/ladies')),
  dressGentlemen: toUrls(pickFolderEntries('dress/gentlemen')),
  venue: toUrls(pickFolderEntries('venue')),
  saveTheDate: toUrls(saveDateFullEntries),
}

export const weddingImageEntries = {
  story: pickFolderEntries('story'),
  dressLadies: pickFolderEntries('dress/ladies'),
  dressGentlemen: pickFolderEntries('dress/gentlemen'),
  venue: pickFolderEntries('venue'),
  saveTheDate: toSaveDateEntries(saveDateFullEntries),
}
