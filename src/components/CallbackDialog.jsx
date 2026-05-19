import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, PhoneCall, Send, ShieldCheck, X } from 'lucide-react'

const CALL_WINDOWS = ['Morning', 'Afternoon', 'Evening', 'Anytime']

// Module-level opener. The dialog wires this up while mounted so any button
// can imperatively call `openCallback()` without prop-drilling or context.
let openHandler = () => {}

export function openCallback() {
  openHandler()
}

export default function CallbackDialog() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    brief: '',
    window: 'Anytime',
  })
  const firstInputRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    openHandler = () => {
      setOpen(true)
      setSubmitted(false)
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

  const onField = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
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
    window.location.href = `mailto:md@madrasswastic.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-white placeholder-white/35 outline-none transition-all focus:border-gold-400/50 focus:bg-white/[0.05]'
  const labelCls =
    'mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/55'

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
          className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-950/80 px-3 backdrop-blur-md sm:items-center sm:p-6"
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
            className="glass-strong relative w-full max-w-3xl overflow-hidden rounded-t-[28px] border border-white/12 sm:rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Pitch */}
              <div className="border-b border-white/10 p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
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
              <div className="p-6 sm:p-8 lg:col-span-7">
                <AnimatePresence mode="wait">
                  {submitted ? (
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
                        Email ready to send
                      </h4>
                      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/65">
                        We've opened your mail client with the brief filled in. If nothing
                        happened, write to{' '}
                        <span className="text-gold-300">md@madrasswastic.com</span>{' '}
                        directly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55 transition-colors hover:text-white"
                      >
                        Edit and resend
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
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>Name</label>
                          <input
                            ref={firstInputRef}
                            required
                            value={form.name}
                            onChange={onField('name')}
                            placeholder="Your name"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Company</label>
                          <input
                            value={form.company}
                            onChange={onField('company')}
                            placeholder="Organisation"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Phone</label>
                          <input
                            required
                            type="tel"
                            value={form.phone}
                            onChange={onField('phone')}
                            placeholder="+91 ..."
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Email</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={onField('email')}
                            placeholder="optional"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Project brief</label>
                        <textarea
                          rows={3}
                          value={form.brief}
                          onChange={onField('brief')}
                          placeholder="A line, a paragraph, or a paste of your RFQ. Anything that helps us route you to the right engineer."
                          className={`${inputCls} resize-none`}
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
                              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
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

                      <div className="flex flex-col items-start justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                        <p className="text-[11px] leading-relaxed text-white/40 sm:max-w-xs">
                          By requesting a callback you agree to be contacted about this enquiry.
                          Details aren't shared with third parties.
                        </p>
                        <button
                          type="submit"
                          className="btn-primary shrink-0"
                        >
                          Request callback
                          <Send className="h-4 w-4" />
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
