import { defineConfig } from 'vite'
import { resolve } from 'node:path'

function adminRoute(req, _res, next) {
  if (/^\/admin(?:\?.*)?$/.test(req.url || '')) req.url = req.url.replace('/admin', '/admin/index.html')
  next()
}

export default defineConfig({
  plugins: [{
    name: 'admin-route',
    configureServer(server) { server.middlewares.use(adminRoute) },
    configurePreviewServer(server) { server.middlewares.use(adminRoute) },
  }],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        starter: resolve(import.meta.dirname, 'demo/index.html'),
        business: resolve(import.meta.dirname, 'demo/business.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
      },
    },
  },
})
