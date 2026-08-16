import { mkdir, readdir, stat, unlink, writeFile } from 'node:fs/promises'
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

  await mkdir(outputDir, { recursive: true })

  let generatedCount = 0

  for (const fileName of sourceFiles) {
    const inputPath = path.join(sourceDir, fileName)
    const outputPath = path.join(outputDir, buildThumbnailName(fileName))

    const [inputStat, outputStat] = await Promise.all([
      stat(inputPath),
      stat(outputPath).catch((error) => {
        if (error.code !== 'ENOENT') {
          throw error
        }
        return undefined
      }),
    ])

    // Skip already up-to-date thumbnails to avoid re-encoding every run.
    if (outputStat && outputStat.mtimeMs >= inputStat.mtimeMs) {
      continue
    }

    const thumbnail = await sharp(inputPath)
      .rotate()
      .resize({
        width: thumbnailWidth,
        height: thumbnailWidth,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 78, effort: 4 })
      .toBuffer()

    await writeFile(outputPath, thumbnail)
    generatedCount += 1
  }

  const expectedOutputFiles = new Set(sourceFiles.map(buildThumbnailName))
  const existingOutputFiles = await readdir(outputDir)

  for (const fileName of existingOutputFiles) {
    if (!expectedOutputFiles.has(fileName)) {
      await unlink(path.join(outputDir, fileName))
    }
  }

  console.log(
    `Generated ${generatedCount} of ${sourceFiles.length} save-the-date thumbnails (${sourceFiles.length - generatedCount} already up to date) in ${path.relative(repoRoot, outputDir)}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})