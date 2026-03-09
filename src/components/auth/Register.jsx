import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import SocialButtons from './SocialButtons'

function Register({ onRegister = () => ({ ok: false, message: 'Unable to register.' }) }) {
  // Keep all register fields in one object for easier updates.
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: true,
  })
  // Feedback shown below the form.
  const [feedback, setFeedback] = useState('')

  // Reusable field updater so we do not write many nearly identical handlers.
  const updateField = (fieldName) => (event) => {
    // Checkbox uses `checked`; text/email/password inputs use `value`.
    const nextValue = fieldName === 'acceptedTerms' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [fieldName]: nextValue }))
    // Clear old message while user edits.
    if (feedback) setFeedback('')
  }

  // Return an error message if form is invalid, otherwise return empty string.
  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
      return 'Please fill all required fields.'
    }

    if (form.password !== form.confirmPassword) {
      return 'Password and Confirm Password must match.'
    }

    if (!form.acceptedTerms) {
      return 'You must accept Terms & Condition.'
    }

    return ''
  }

  // Runs when register form is submitted.
  const handleSubmit = (event) => {
    // Keep SPA behavior (no page reload).
    event.preventDefault()

    // First check local validation rules.
    const validationMessage = validateForm()
    if (validationMessage) {
      setFeedback(validationMessage)
      return
    }

    // Parent handles user creation and duplicate-email check.
    const result = onRegister(form)

    if (!result.ok) {
      setFeedback(result.message)
      return
    }

    // Clear message on success.
    setFeedback('')
  }

  return (
    <section className="panel auth-form split-form">
      <div className="card">
        <Logo />
        <SocialButtons prefix="Sign Up with" />

        <div className="divider"><span>OR</span></div>
        <h2>Login with your email</h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="double-field">
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={updateField('firstName')}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={updateField('lastName')}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField('email')}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField('password')}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={updateField('confirmPassword')}
          />

          <label className="check-row">
            <input
              type="checkbox"
              checked={form.acceptedTerms}
              onChange={updateField('acceptedTerms')}
            />
            <span>I agree to all the Terms & Condition</span>
          </label>

          {feedback && <p className="auth-feedback error">{feedback}</p>}

          <button type="submit" className="primary full-width">Create Account</button>
        </form>

        <p className="switch-text">
          Already have an Account?
          <Link to="/auth/login"> Log In</Link>
        </p>
      </div>
    </section>
  )
}

export default Register
