import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/.vscode/**',
      '**/AppData/**',
      '**/Local Settings/**',
      '**/Downloads/**',
      '**/Desktop/Old Desktop/**'
    ],
    include: ['src/test/**/*.test.{ts,tsx}']
  },
})
