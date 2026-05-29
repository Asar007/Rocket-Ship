import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Clock, Loader2, PhoneCall, Send, ShieldCheck, X } from 'lucide-react'

const CALL_WINDOWS = ['Morning', 'Afternoon', 'Evening', 'Anytime']
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Allow +, digits, spaces, dashes, parens; require >= 7 digits total.
const phoneDigits = (v) => (v || '').replace(/\D/g, '')

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please tell us your name.'
  if (!form.phone.trim()) {
    errors.phone = 'Phone is required so we can call you back.'
  } else if (phoneDigits(form.phone).length < 7) {
    errors.phone = 'That phone number looks too short.'
  }
  if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
    errors.email = 'That email address doesn’t look right.'
  }
  return errors
}

function buildMailto(form) {
  const subject = `Callback request: ${form.company || form.name || 'New enquiry'}`
  const body = [
    `Name: ${form.name}`,
    `Company: ${form.company}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email || 'N/A'}`,
    `Preferred call window: ${form.window}`,
    '',
    'Brief:',
    form.brief?.trim() || '(no brief provided)',
  ].join('\n')
  return `mailto:md@madrasswastic.com?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`
}

// Module-level opener. The dialog wires this up while mounted so any button
// can imperatively call `openCallback()` without prop-drilling or context.
let openHandler = () => {}

export function openCallback() {
  openHandler()
}

export default function CallbackDialog() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    brief: '',
    window: 'Anytime',
    botcheck: '', // honeypot — must stay empty
  })
  const firstInputRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    openHandler = () => {
      setOpen(true)
      setStatus('idle')
      setSubmitError('')
      setErrors({})
    }
    return () => {
      openHandler = () => {}
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      // Focus trap — keep Tab/Shift+Tab cycling inside the dialog card.
      const card = cardRef.current
      if (!card) return
      const focusable = card.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !card.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = setTimeout(() => firstInputRef.current?.focus(), 80)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      clearTimeout(focusTimer)
    }
  }, [open])

  const onField = (k) => (e) => {
    const value = e.target.value
    setForm((s) => ({ ...s, [k]: value }))
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  const fallbackToMailto = () => {
    window.location.href = buildMailto(form)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return

    // Honeypot: silently drop bot submissions.
    if (form.botcheck) {
      setStatus('success')
      return
    }

    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length > 0) return

    // No access key configured — degrade gracefully to mailto so a built site
    // without env vars still gets the user to email rather than appear broken.
    if (!WEB3FORMS_KEY) {
      fallbackToMailto()
      setStatus('success')
      return
    }

    setStatus('submitting')
    setSubmitError('')

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Callback request: ${form.company || form.name || 'New enquiry'}`,
          from_name: form.name,
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email || 'not-provided@madrasswastic.com',
          preferred_call_window: form.window,
          brief: form.brief?.trim() || '(no brief provided)',
          botcheck: form.botcheck,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setSubmitError(data.message || 'Submission failed. Please try again or email us directly.')
      }
    } catch (err) {
      setStatus('error')
      setSubmitError('Network error. Check your connection or email us directly.')
    }
  }

  const inputBase =
    'w-full rounded-xl border bg-white/[0.03] px-3.5 py-3 text-base text-white placeholder-white/35 outline-none transition-all focus:bg-white/[0.05] sm:py-2.5 sm:text-[13px]'
  const inputOk = 'border-white/10 focus:border-gold-400/50'
  const inputErr = 'border-rose-400/60 focus:border-rose-400/80'
  const inputCls = (key) => `${inputBase} ${errors[key] ? inputErr : inputOk}`
  const labelCls =
    'mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/55'
  const errMsgCls = 'mt-1.5 flex items-center gap-1.5 text-[11.5px] text-rose-300'

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-navy-950/80 px-3 backdrop-blur-md sm:items-center sm:p-6"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
            paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="callback-title"
          onClick={() => setOpen(false)}
        >
          <motion.div
            key="card"
            ref={cardRef}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass-strong relative max-h-[calc(100svh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem)] w-full max-w-3xl overflow-y-auto rounded-t-[28px] border border-white/12 sm:max-h-[90svh] sm:rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white sm:right-4 sm:top-4"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Pitch */}
              <div className="border-b border-white/10 p-5 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-gold-400" />
                  <span className="eyebrow text-white/65">Schedule a callback</span>
                </div>
                <h3
                  id="callback-title"
                  className="mt-5 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl"
                >
                  Tell us about your build. We'll call you back within a working day.
                </h3>
                <p className="mt-4 text-[13.5px] leading-relaxed text-white/65">
                  Drawings, an RFQ, or a one-line napkin sketch, share whatever you've got. A
                  senior engineer reviews every enquiry before we respond.
                </p>

                <ul className="mt-7 space-y-3 text-[12.5px] text-white/65">
                  <li className="flex items-center gap-2.5">
                    <Clock className="h-3.5 w-3.5 text-electric-400" />
                    Mon to Sat · 9 am to 7 pm IST
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-400" />
                    Confidential by default · NDA on request
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Senior engineer reviews, not a sales pass-through
                  </li>
                </ul>
              </div>

              {/* Form */}
              <div className="p-5 sm:p-8 lg:col-span-7">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"
                    >
                      <div className="grid h-14 w-14 place-items-center rounded-full border border-emerald-400/40 bg-emerald-400/10">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      </div>
                      <h4 className="mt-5 font-display text-xl font-semibold text-white">
                        {WEB3FORMS_KEY ? 'Request received' : 'Email ready to send'}
                      </h4>
                      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/65">
                        {WEB3FORMS_KEY ? (
                          <>
                            Thanks. A senior engineer will call you back within a working day. If
                            it's urgent, reach us on{' '}
                            <span className="text-gold-300">+91 98841 48474</span>.
                          </>
                        ) : (
                          <>
                            We've opened your mail client with the brief filled in. If nothing
                            happened, write to{' '}
                            <span className="text-gold-300">md@madrasswastic.com</span>{' '}
                            directly.
                          </>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus('idle')}
                        className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55 transition-colors hover:text-white"
                      >
                        Send another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Honeypot: hidden from humans/AT, bots fill it; we drop those submissions. */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: '-9999px',
                          width: '1px',
                          height: '1px',
                          overflow: 'hidden',
                        }}
                      >
                        <label htmlFor="cb-botcheck">Leave this field empty</label>
                        <input
                          id="cb-botcheck"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={form.botcheck}
                          onChange={onField('botcheck')}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelCls} htmlFor="cb-name">Name</label>
                          <input
                            id="cb-name"
                            ref={firstInputRef}
                            value={form.name}
                            onChange={onField('name')}
                            placeholder="Your name"
                            autoComplete="name"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'cb-name-err' : undefined}
                            className={inputCls('name')}
                          />
                          {errors.name && (
                            <p id="cb-name-err" className={errMsgCls}>
                              <AlertCircle className="h-3 w-3" /> {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="cb-company">Company</label>
                          <input
                            id="cb-company"
                            value={form.company}
                            onChange={onField('company')}
                            placeholder="Organisation"
                            autoComplete="organization"
                            className={inputCls('company')}
                          />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="cb-phone">Phone</label>
                          <input
                            id="cb-phone"
                            type="tel"
                            inputMode="tel"
                            value={form.phone}
                            onChange={onField('phone')}
                            placeholder="+91 ..."
                            autoComplete="tel"
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? 'cb-phone-err' : undefined}
                            className={inputCls('phone')}
                          />
                          {errors.phone && (
                            <p id="cb-phone-err" className={errMsgCls}>
                              <AlertCircle className="h-3 w-3" /> {errors.phone}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="cb-email">Email</label>
                          <input
                            id="cb-email"
                            type="email"
                            inputMode="email"
                            value={form.email}
                            onChange={onField('email')}
                            placeholder="optional"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'cb-email-err' : undefined}
                            className={inputCls('email')}
                          />
                          {errors.email && (
                            <p id="cb-email-err" className={errMsgCls}>
                              <AlertCircle className="h-3 w-3" /> {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={labelCls} htmlFor="cb-brief">Project brief</label>
                        <textarea
                          id="cb-brief"
                          rows={3}
                          value={form.brief}
                          onChange={onField('brief')}
                          placeholder="A line, a paragraph, or a paste of your RFQ. Anything that helps us route you to the right engineer."
                          className={`${inputCls('brief')} resize-none`}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Preferred call window</label>
                        <div className="flex flex-wrap gap-2">
                          {CALL_WINDOWS.map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setForm((s) => ({ ...s, window: w }))}
                              className={`min-h-[44px] rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 sm:min-h-0 sm:px-3.5 sm:py-1.5 sm:text-[12px] ${
                                form.window === w
                                  ? 'border-gold-400/60 bg-gold-400/10 text-gold-200 shadow-[0_0_18px_-6px_rgba(240,198,116,0.45)]'
                                  : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white'
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>

                      {status === 'error' && submitError && (
                        <div
                          role="alert"
                          className="flex items-start gap-2 rounded-xl border border-rose-400/40 bg-rose-400/10 px-3.5 py-3 text-[12.5px] text-rose-100"
                        >
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-300" />
                          <span>
                            {submitError}{' '}
                            <button
                              type="button"
                              onClick={fallbackToMailto}
                              className="underline underline-offset-2 hover:text-white"
                            >
                              Open email instead
                            </button>
                            .
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col items-start justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                        <p className="text-[11px] leading-relaxed text-white/40 sm:max-w-xs">
                          By requesting a callback you agree to be contacted about this enquiry.
                          Details aren't shared with third parties.
                        </p>
                        <button
                          type="submit"
                          disabled={status === 'submitting'}
                          className="btn-primary w-full justify-center shrink-0 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                        >
                          {status === 'submitting' ? (
                            <>
                              Sending
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </>
                          ) : (
                            <>
                              Request callback
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
