import { cp, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const preserved = [
  '_headers',
  '_redirects',
  'GOVERNANCE.md',
  'IES.md',
  'METRICS.md',
  'MIGRATION.md',
  'VERIFICATION.md',
  'capt-verification',
  'immersive',
  'registry',
  'v1.html',
  'v2.html',
  'v3.html',
]

await mkdir(dist, { recursive: true })

for (const relativePath of preserved) {
  const source = path.join(root, relativePath)
  if (!existsSync(source)) continue
  await cp(source, path.join(dist, relativePath), { recursive: true, force: true })
}

console.log(`Copied ${preserved.length} governed legacy assets into dist`)
