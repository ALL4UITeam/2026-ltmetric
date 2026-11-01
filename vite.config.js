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

export default defineConfig({
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
    assetsInlineLimit: 0,
    rollupOptions: {
      input: htmlInputs(),
    },
  },
})
