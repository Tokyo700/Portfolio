import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleContact } from './server/contact.js'

// Serves POST /api/contact during `npm run dev` / `npm run preview`,
// mirroring the Vercel function in api/contact.js.
function contactApi() {
  const middleware = async (req, res) => {
    const send = (status, data) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    }
    if (req.method !== 'POST') return send(405, { ok: false, error: 'Method not allowed' })

    let raw = ''
    for await (const chunk of req) {
      raw += chunk
      if (raw.length > 100_000) return send(413, { ok: false, error: 'Message too large' })
    }
    let body
    try {
      body = JSON.parse(raw || '{}')
    } catch {
      return send(400, { ok: false, error: 'Invalid request body' })
    }

    const { status, body: result } = await handleContact(body, { ip: req.socket.remoteAddress })
    send(status, result)
  }

  return {
    name: 'contact-api',
    // (block bodies on purpose: a function returned from these hooks is treated as a post-hook)
    configureServer(server) {
      server.middlewares.use('/api/contact', middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/contact', middleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  // make .env values (GMAIL_USER, GMAIL_APP_PASSWORD…) visible to the contact handler
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), contactApi()],
    build: {
      chunkSizeWarningLimit: 1200,
    },
  }
})
