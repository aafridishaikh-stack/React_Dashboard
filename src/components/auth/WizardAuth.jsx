import { useState } from 'react'
import Logo from './Logo'
import SocialButtons from './SocialButtons'

function WizardAuth({ onSignupEmail = () => ({ ok: false, message: 'Unable to continue.' }) }) {
  // Step UI state: false = social buttons step, true = work-email step.
  const [showEmailForm, setShowEmailForm] = useState(false)
  // Work email typed by user.
  const [workEmail, setWorkEmail] = useState('')
  // Feedback for validation or lookup errors.
  const [feedback, setFeedback] = useState('')

  // Update email field and clear old feedback.
  const handleWorkEmailChange = (event) => {
    setWorkEmail(event.target.value)
    if (feedback) setFeedback('')
  }

  // Continue to next step after checking work email.
  const handleContinue = () => {
    const cleanedEmail = workEmail.trim()

    // Required-field validation.
    if (!cleanedEmail) {
      setFeedback('Please enter your work email.')
      return
    }

    // Ask parent to verify if email exists in demo users list.
    const result = onSignupEmail({ email: cleanedEmail })

    if (!result.ok) {
      setFeedback(result.message)
      return
    }

    // Clear feedback on success (route changes are handled by parent auth state).
    setFeedback('')
  }

  return (
    <section className="panel auth-core">
      <header className="panel-header panel-header-spread">
        <Logo />
        <p className="step-status">
          Step <span className="current-step">{showEmailForm ? 2 : 1}</span> to 5
        </p>
      </header>

      <div className="hero-copy">
        <h1>Welcome to the Able Pro</h1>
        <p>Sign up or login with your work email.</p>
      </div>

      {!showEmailForm ? (
        <div className="wizard-area">
          {/* Clicking "Continue with work email" reveals the manual email input step. */}
          <SocialButtons includeWorkEmail onWorkEmailClick={() => setShowEmailForm(true)} />
        </div>
      ) : (
        <div className="wizard-area email-step">
          <label htmlFor="workEmail">Enter your work email to continue</label>
          <input id="workEmail" type="email" placeholder="Email" value={workEmail} onChange={handleWorkEmailChange} />
          {feedback && <p className="auth-feedback error">{feedback}</p>}
          <div className="split-actions">
            <button
              className="ghost"
              type="button"
              onClick={() => {
                // Go back to first step and reset message.
                setFeedback('')
                setShowEmailForm(false)
              }}
            >
              Back
            </button>
            <button className="primary" type="button" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}

      <p className="terms-note">
        By signing up, you confirm to have read Able pro <a href="#">Privacy Policy</a> and agree to the
        <a href="#"> Terms of Service</a>.
      </p>
    </section>
  )
}

export default WizardAuth
