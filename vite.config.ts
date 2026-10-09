import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { baseSecurityHeaders, previewSecurityHeaders } from './security-headers.ts'

// 開発サーバーは HMR がインラインスクリプトを使うため CSP を外し、
// preview（本番ビルドの確認）では本番と同じヘッダーを適用する。
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    headers: baseSecurityHeaders,
  },
  preview: {
    host: '127.0.0.1',
    headers: previewSecurityHeaders,
  },
  build: {
    sourcemap: false,
    assetsInlineLimit: 0,
  },
})
