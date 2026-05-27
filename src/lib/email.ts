import { Resend } from 'resend'
import type { DiagnosticOutput, ContextAnswers, CategoryId } from '@/diagnostic/types'
import { categories } from '@/diagnostic/config/categories'

const resendApiKey = process.env.RESEND_API_KEY
export const isEmailConfigured = Boolean(resendApiKey)

const resend = isEmailConfigured ? new Resend(resendApiKey) : null

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'diagnostic@mrtconsulting.com'
const CONSULTANT_EMAIL = process.env.CONSULTANT_EMAIL ?? 'team@mrtconsulting.com'

export async function sendUserConfirmation(params: {
  email: string
  name?: string
  output: DiagnosticOutput
}) {
  if (!resend) return { success: false, error: 'Email not configured' }

  const { email, name, output } = params
  const greeting = name ? `Dear ${name},` : 'Thank you for completing the diagnostic.'

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Your Business Diagnostic — MRT Consulting',
      html: buildUserEmailHtml({ greeting, output }),
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send user confirmation:', error)
    return { success: false, error: String(error) }
  }
}

export async function sendConsultantNotification(params: {
  sessionId: string
  context: ContextAnswers
  focusAreas: CategoryId[]
  answers: Record<string, string>
  output: DiagnosticOutput
  contact: { email: string; name?: string; company?: string }
}) {
  if (!resend) return { success: false, error: 'Email not configured' }

  const { sessionId, context, focusAreas, answers, output, contact } = params

  const categoryLabels = focusAreas
    .map((id) => categories.find((c) => c.id === id)?.label ?? id)
    .join(', ')

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONSULTANT_EMAIL,
      subject: `New Diagnostic — ${output.archetypeName} | ${categoryLabels}`,
      html: buildConsultantEmailHtml({ sessionId, context, focusAreas, output, contact }),
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send consultant notification:', error)
    return { success: false, error: String(error) }
  }
}

function buildUserEmailHtml({
  greeting,
  output,
}: {
  greeting: string
  output: DiagnosticOutput
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #0A1628; background: #F8F4EF;">
  <div style="border-bottom: 2px solid #0A1628; padding-bottom: 20px; margin-bottom: 32px;">
    <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C9943A; margin: 0 0 8px;">MRT Consulting</p>
    <h1 style="font-size: 22px; margin: 0; font-weight: 600;">Your Diagnostic is Under Review</h1>
  </div>

  <p style="line-height: 1.7; margin-bottom: 24px;">${greeting}</p>

  <p style="line-height: 1.7; margin-bottom: 24px;">
    One of our consultants will review your completed Business Diagnostic and prepare a personalized interpretation — including how your profile compares to similar businesses we have worked with.
  </p>

  <div style="background: white; border: 1px solid #E5DDD4; border-radius: 4px; padding: 24px; margin-bottom: 32px;">
    <p style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #8A97A8; margin: 0 0 12px;">Your Diagnostic Finding</p>
    <p style="font-size: 17px; line-height: 1.6; margin: 0; font-style: italic; color: #0A1628;">"${output.headline}"</p>
  </div>

  <p style="line-height: 1.7; margin-bottom: 24px;">
    You can expect to hear from us within <strong>48 hours</strong> with a brief prepared specifically for your situation.
  </p>

  <p style="line-height: 1.7; margin-bottom: 32px; color: #4A5568; font-size: 14px;">
    If you have any questions in the meantime, simply reply to this email.
  </p>

  <div style="border-top: 1px solid #E5DDD4; padding-top: 24px; font-size: 12px; color: #8A97A8;">
    <p style="margin: 0;">MRT Consulting · Business Diagnostic Tool</p>
  </div>
</body>
</html>`
}

function buildConsultantEmailHtml({
  sessionId,
  context,
  focusAreas,
  output,
  contact,
}: {
  sessionId: string
  context: ContextAnswers
  focusAreas: CategoryId[]
  output: DiagnosticOutput
  contact: { email: string; name?: string; company?: string }
}) {
  const categoryLabels = focusAreas
    .map((id) => categories.find((c) => c.id === id)?.label ?? id)
    .join(', ')

  const scoreRows = output.categoryScores
    .map(
      (s) =>
        `<tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #E5DDD4;">${categories.find((c) => c.id === s.categoryId)?.label ?? s.categoryId}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #E5DDD4; text-align: center;">${s.assessed ? `${s.normalized}/100` : 'Not assessed'}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #E5DDD4; text-align: center; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">${s.assessed ? s.level : '—'}</td>
        </tr>`
    )
    .join('')

  const observationsList = output.observations
    .map((o, i) => `<li style="margin-bottom: 12px; line-height: 1.6;">${o}</li>`)
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 40px 20px; color: #0A1628; background: #F8F4EF;">
  <div style="border-bottom: 2px solid #0A1628; padding-bottom: 20px; margin-bottom: 32px;">
    <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C9943A; margin: 0 0 8px;">MRT Consulting — Internal</p>
    <h1 style="font-size: 20px; margin: 0; font-weight: 600;">New Diagnostic Opt-In</h1>
    <p style="margin: 8px 0 0; color: #4A5568; font-size: 14px;">Session ${sessionId}</p>
  </div>

  <h2 style="font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A97A8; margin-bottom: 16px;">Contact</h2>
  <table style="width: 100%; margin-bottom: 32px;">
    <tr><td style="padding: 6px 0; color: #4A5568; width: 120px;">Email</td><td><strong>${contact.email}</strong></td></tr>
    ${contact.name ? `<tr><td style="padding: 6px 0; color: #4A5568;">Name</td><td>${contact.name}</td></tr>` : ''}
    ${contact.company ? `<tr><td style="padding: 6px 0; color: #4A5568;">Company</td><td>${contact.company}</td></tr>` : ''}
  </table>

  <h2 style="font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A97A8; margin-bottom: 16px;">Business Profile</h2>
  <table style="width: 100%; margin-bottom: 32px;">
    <tr><td style="padding: 6px 0; color: #4A5568; width: 120px;">Sector</td><td>${context.sector ?? '—'}</td></tr>
    <tr><td style="padding: 6px 0; color: #4A5568;">Scale</td><td>${context.scale ?? '—'}</td></tr>
    <tr><td style="padding: 6px 0; color: #4A5568;">Situation</td><td>${context.situation ?? '—'}</td></tr>
    <tr><td style="padding: 6px 0; color: #4A5568;">Role</td><td>${context.role ?? '—'}</td></tr>
    <tr><td style="padding: 6px 0; color: #4A5568;">Focus Areas</td><td>${categoryLabels}</td></tr>
  </table>

  <h2 style="font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A97A8; margin-bottom: 16px;">Archetype Classification</h2>
  <div style="background: white; border: 1px solid #E5DDD4; border-radius: 4px; padding: 20px; margin-bottom: 32px;">
    <p style="font-size: 13px; color: #8A97A8; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.1em;">${output.archetypeName}</p>
    <p style="margin: 0; font-style: italic; line-height: 1.6;">"${output.headline}"</p>
  </div>

  <h2 style="font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A97A8; margin-bottom: 16px;">Category Signals</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px; border: 1px solid #E5DDD4;">
    <thead>
      <tr style="background: #EFE9E1;">
        <th style="padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Category</th>
        <th style="padding: 10px 12px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Score</th>
        <th style="padding: 10px 12px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Signal</th>
      </tr>
    </thead>
    <tbody>${scoreRows}</tbody>
  </table>

  <h2 style="font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A97A8; margin-bottom: 16px;">Observed Patterns</h2>
  <ul style="padding-left: 20px; margin-bottom: 32px;">${observationsList}</ul>

  <h2 style="font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A97A8; margin-bottom: 16px;">Central Diagnostic Question</h2>
  <div style="background: white; border-left: 3px solid #1A7B72; padding: 16px 20px; margin-bottom: 32px;">
    <p style="margin: 0; font-style: italic; line-height: 1.6;">"${output.centralQuestion}"</p>
  </div>

  <div style="border-top: 1px solid #E5DDD4; padding-top: 24px; font-size: 12px; color: #8A97A8;">
    <p style="margin: 0;">MRT Consulting · Internal Diagnostic Notification · Do not forward</p>
  </div>
</body>
</html>`
}
