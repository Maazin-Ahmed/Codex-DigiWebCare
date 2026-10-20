import { useState } from 'react'
import { brand } from '../content.js'

const initialForm = { name: '', email: '', message: '' }

function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setStatus('')
  }

  const validate = () => {
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 10) nextErrors.message = 'Please tell us a little more about the project.'
    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('Please check the highlighted fields.')
      return
    }

    const subject = encodeURIComponent(`${brand.name} enquiry from ${form.name.trim()}`)
    const body = encodeURIComponent(`Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`)
    setStatus('Opening your email app to send the message…')
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <label htmlFor="contact-name">Name <span>*</span></label>
        <input
          id="contact-name"
          name="name"
          value={form.name}
          onChange={updateField}
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && <small id="contact-name-error">{errors.name}</small>}
      </div>
      <div className="contact-form__row">
        <label htmlFor="contact-email">Email <span>*</span></label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && <small id="contact-email-error">{errors.email}</small>}
      </div>
      <div className="contact-form__row contact-form__row--full">
        <label htmlFor="contact-message">Message <span>*</span></label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={updateField}
          rows="5"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && <small id="contact-message-error">{errors.message}</small>}
      </div>
      <div className="contact-form__actions">
        <button className="button button--primary" type="submit">Send a message <span aria-hidden="true">↗</span></button>
        <p role="status">{status}</p>
      </div>
      <p className="contact-form__note">Submitting opens your email app with the message addressed to {brand.email}. No SMS subscription is created by this form.</p>
    </form>
  )
}

export default ContactForm
