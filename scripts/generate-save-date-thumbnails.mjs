import { mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')
const sourceDir = path.join(repoRoot, 'src', 'assets', 'wedding', 'save-the-date')
const outputDir = path.join(repoRoot, 'src', 'assets', 'wedding', 'save-the-date-thumbs')
const supportedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])
const thumbnailWidth = 640

const isSupportedImage = (fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase())

const buildThumbnailName = (fileName) => `${path.parse(fileName).name}.webp`

async function main() {
  const sourceFiles = (await readdir(sourceDir)).filter(isSupportedImage).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )

  await rm(outputDir, { recursive: true, force: true })
  await mkdir(outputDir, { recursive: true })

  for (const fileName of sourceFiles) {
    const inputPath = path.join(sourceDir, fileName)
    const outputPath = path.join(outputDir, buildThumbnailName(fileName))

    await sharp(inputPath)
      .rotate()
      .resize({
        width: thumbnailWidth,
        height: thumbnailWidth,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 78, effort: 4 })
      .toFile(outputPath)
  }

  console.log(`Generated ${sourceFiles.length} save-the-date thumbnails in ${path.relative(repoRoot, outputDir)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})