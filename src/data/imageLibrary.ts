const asSortedUrls = (modules: Record<string, { default: string }>) =>
  Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default)

export const weddingImages = {
  hero: asSortedUrls(
    import.meta.glob<{ default: string }>(
      '../assets/wedding/hero/*.{png,jpg,jpeg,webp,avif}',
      { eager: true },
    ),
  ),
  story: asSortedUrls(
    import.meta.glob<{ default: string }>(
      '../assets/wedding/story/*.{png,jpg,jpeg,webp,avif}',
      { eager: true },
    ),
  ),
  dressLadies: asSortedUrls(
    import.meta.glob<{ default: string }>(
      '../assets/wedding/dress/ladies/*.{png,jpg,jpeg,webp,avif}',
      { eager: true },
    ),
  ),
  dressGentlemen: asSortedUrls(
    import.meta.glob<{ default: string }>(
      '../assets/wedding/dress/gentlemen/*.{png,jpg,jpeg,webp,avif}',
      { eager: true },
    ),
  ),
  venue: asSortedUrls(
    import.meta.glob<{ default: string }>(
      '../assets/wedding/venue/*.{png,jpg,jpeg,webp,avif}',
      { eager: true },
    ),
  ),
  saveTheDate: asSortedUrls(
    import.meta.glob<{ default: string }>(
      '../assets/wedding/save-the-date/*.{png,jpg,jpeg,webp,avif}',
      { eager: true },
    ),
  ),
}
