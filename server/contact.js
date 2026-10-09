import nodemailer from 'nodemailer'

/*
 * Contact-form backend shared by the Vercel function (api/contact.js) and
 * the local dev server (vite.config.js). It validates the submission and
 * emails it to you through Gmail.
 *
 * Required env vars (see .env.example):
 *   GMAIL_USER          the Gmail address that sends the mail
 *   GMAIL_APP_PASSWORD  a 16-character Google App Password (not your normal password)
 * Optional:
 *   CONTACT_TO          where messages are delivered (defaults to GMAIL_USER)
 */

const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 }
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/

// soft per-IP limit: 5 messages per 10 minutes
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map()

const text = (v) => (typeof v === 'string' ? v.trim() : '')
const oneLine = (v) => v.replace(/[\r\n\t]+/g, ' ')
const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function isRateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

export function validate(body) {
  const data = {
    name: oneLine(text(body?.name)),
    email: text(body?.email),
    subject: oneLine(text(body?.subject)),
    message: text(body?.message),
  }
  for (const [field, max] of Object.entries(LIMITS)) {
    if (!data[field]) return { error: `Please fill in your ${field}.` }
    if (data[field].length > max) return { error: `Your ${field} is too long (max ${max} characters).` }
  }
  if (!EMAIL_RE.test(data.email)) return { error: 'Please enter a valid email address.' }
  return { data }
}

let gmail
function gmailTransport() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '') // Google shows it in 4 groups
  if (!user || !pass) return null
  gmail ??= nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
  return gmail
}

function buildEmail({ name, email, subject, message }) {
  const sender = process.env.GMAIL_USER ?? 'portfolio@localhost'
  const received = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
  const safe = { name: escapeHtml(name), email: escapeHtml(email), subject: escapeHtml(subject) }
  const body = escapeHtml(message).replace(/\n/g, '<br>')

  return {
    from: { name: 'Portfolio Contact', address: sender },
    to: process.env.CONTACT_TO || sender,
    replyTo: { name, address: email }, // hitting "Reply" in Gmail answers the visitor directly
    subject: `[Portfolio] ${subject} — ${name}`,
    text: `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nReceived: ${received} IST\n\n${message}\n`,
    html: `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#0b0b0b;color:#f2f2f2;border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(90deg,#f16b0d,#e61416);padding:20px 28px;font-size:18px;font-weight:bold;color:#fff">New message from your portfolio</div>
  <div style="padding:24px 28px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#9a9a9a;width:90px">Name</td><td style="padding:6px 0">${safe.name}</td></tr>
      <tr><td style="padding:6px 0;color:#9a9a9a">Email</td><td style="padding:6px 0"><a href="mailto:${safe.email}" style="color:#ff8a3d">${safe.email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#9a9a9a">Subject</td><td style="padding:6px 0">${safe.subject}</td></tr>
      <tr><td style="padding:6px 0;color:#9a9a9a">Received</td><td style="padding:6px 0">${received} IST</td></tr>
    </table>
    <div style="margin-top:18px;padding:18px;background:#161616;border:1px solid #2a2a2a;border-radius:12px;font-size:15px;line-height:1.6">${body}</div>
    <p style="margin-top:18px;font-size:12px;color:#777">Reply to this email to answer ${safe.name} directly.</p>
  </div>
</div>`,
  }
}

/**
 * Handles one submission. Returns { status, body } so any server
 * (Vercel, Vite dev, Express…) can send it back as JSON.
 */
export async function handleContact(payload, { ip = 'unknown', transport } = {}) {
  // honeypot: real visitors never see or fill this field, bots usually do
  if (text(payload?.company)) return { status: 200, body: { ok: true } }

  const { data, error } = validate(payload)
  if (error) return { status: 400, body: { ok: false, error } }

  if (isRateLimited(ip)) {
    return { status: 429, body: { ok: false, error: 'Too many messages — please try again in a few minutes.' } }
  }

  const mailer = transport ?? gmailTransport()
  if (!mailer) {
    console.error('[contact] GMAIL_USER / GMAIL_APP_PASSWORD are not set — see .env.example')
    return { status: 500, body: { ok: false, error: 'The contact form isn’t set up yet. Please email me directly.' } }
  }

  try {
    await mailer.sendMail(buildEmail(data))
    return { status: 200, body: { ok: true } }
  } catch (err) {
    console.error('[contact] sending failed:', err.message)
    return { status: 502, body: { ok: false, error: 'Couldn’t send your message right now. Please try again or email me directly.' } }
  }
}
