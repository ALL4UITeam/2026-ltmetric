import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

function htmlInputs() {
  const entries = {}

  for (const name of fs.readdirSync(root)) {
    if (!name.endsWith('.html')) continue
    const key = name.replace(/\.html$/i, '')
    entries[key] = path.join(root, name)
  }

  return entries
}

function copyRuntimeFiles() {
  const copies = [
    ['libs', 'libs'],
    ['vendor', 'vendor'],
    ['js', 'js'],
    ['assets/js/home.js', 'assets/js/home.js'],
  ]

  return {
    name: 'copy-runtime-files',
    apply: 'build',
    closeBundle() {
      for (const [fromRel, toRel] of copies) {
        const from = path.join(root, fromRel)
        const to = path.join(root, 'dist', toRel)
        if (!fs.existsSync(from)) continue
        fs.mkdirSync(path.dirname(to), { recursive: true })
        fs.cpSync(from, to, { recursive: true })
      }

      const distDir = path.join(root, 'dist')
      for (const name of fs.readdirSync(distDir)) {
        if (!name.endsWith('.html')) continue
        const file = path.join(distDir, name)
        const html = fs.readFileSync(file, 'utf8')
          .replace(
            /<script type="module" crossorigin src="([^"]+)"><\/script>/g,
            '<script defer src="$1"></script>',
          )
          .replace(/\s+crossorigin(?:="[^"]*")?/g, '')
        fs.writeFileSync(file, html)
      }
    },
  }
}

export default defineConfig({
  plugins: [copyRuntimeFiles()],
  base: './',
  appType: 'mpa',
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    modulePreload: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: htmlInputs(),
    },
  },
})
