import http from 'node:http'
import https from 'node:https'
import Stripe from 'stripe'

const STRIPE_PRICES = {
  'baleia':              '', // TODO: criar price no Stripe
  'carnaval-backstage':  '', // TODO: criar price no Stripe
  'marius':              '', // TODO: criar price no Stripe
}

const PORT = 3001
const API_KEY = process.env.ANTHROPIC_API_KEY
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

if (!API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in environment')
  process.exit(1)
}

if (!stripe) {
  console.warn('STRIPE_SECRET_KEY not set — /api/checkout will return 503')
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(404)
    res.end()
    return
  }

  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', async () => {
    let parsed
    try { parsed = JSON.parse(body) } catch {
      res.writeHead(400)
      res.end(JSON.stringify({ error: 'invalid json' }))
      return
    }

    if (req.url === '/api/chat') {
      const payload = JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: parsed.system,
        messages: parsed.messages,
      })

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': API_KEY,
          'Content-Length': Buffer.byteLength(payload),
        },
      }

      const proxy = https.request(options, upstream => {
        res.writeHead(upstream.statusCode, { 'Content-Type': 'application/json' })
        upstream.pipe(res)
      })

      proxy.on('error', err => {
        console.error('Anthropic request error:', err.message)
        res.writeHead(502)
        res.end(JSON.stringify({ error: 'upstream error' }))
      })

      proxy.write(payload)
      proxy.end()
      return
    }

    if (req.url === '/api/checkout') {
      if (!stripe) {
        res.writeHead(503)
        res.end(JSON.stringify({ error: 'stripe_not_configured' }))
        return
      }

      const { excursionId, origin } = parsed
      const baseUrl = origin || 'http://localhost:5174'
      const priceId = STRIPE_PRICES[excursionId]

      if (!priceId) {
        res.writeHead(400)
        res.end(JSON.stringify({ error: 'unknown_excursion' }))
        return
      }

      try {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${baseUrl}/?payment=success`,
          cancel_url: `${baseUrl}/?payment=cancelled`,
        })

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ url: session.url }))
      } catch (err) {
        console.error('Stripe error:', err.message)
        res.writeHead(500)
        res.end(JSON.stringify({ error: err.message }))
      }
      return
    }

    res.writeHead(404)
    res.end()
  })
})

server.listen(PORT, () => console.log(`API server running on port ${PORT}`))
