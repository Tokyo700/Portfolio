import nodemailer from 'nodemailer'

// GET /api/health — confirms the contact backend is configured and Gmail accepts
// the login. Sends no email and never reveals the credentials.
export default async function handler(req, res) {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '')
  const result = { ok: false, gmailUser: Boolean(user), gmailPassword: Boolean(pass), gmailLogin: 'not checked' }

  if (user && pass) {
    try {
      await nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }).verify()
      result.gmailLogin = 'ok'
      result.ok = true
    } catch (err) {
      result.gmailLogin = `failed: ${err.message}`
    }
  }

  res.setHeader('Cache-Control', 'no-store')
  return res.status(result.ok ? 200 : 503).json(result)
}
