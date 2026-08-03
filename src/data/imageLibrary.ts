export type ImageEntry = {
  src: string
  fileName: string
}

const asSortedEntries = (modules: Record<string, string>): ImageEntry[] =>
  Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod]) => ({
      src: mod,
      fileName: path.split('/').pop() ?? path,
    }))

const toUrls = (entries: ImageEntry[]) => entries.map((entry) => entry.src)

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

export const weddingImages = {
  hero: toUrls(pickFolderEntries('hero')),
  story: toUrls(pickFolderEntries('story')),
  dressLadies: toUrls(pickFolderEntries('dress/ladies')),
  dressGentlemen: toUrls(pickFolderEntries('dress/gentlemen')),
  venue: toUrls(pickFolderEntries('venue')),
  saveTheDate: toUrls(pickFolderEntries('save-the-date')),
}

export const weddingImageEntries = {
  story: pickFolderEntries('story'),
  venue: pickFolderEntries('venue'),
}
