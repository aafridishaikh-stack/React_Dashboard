import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/auth.scss'
import Login from './Login'
import Register from './Register'
import { IllustrationPanel, TestimonialPanel } from './SidePanel'
import WizardAuth from './WizardAuth'

// Allowed URL modes for auth page.
const VALID_AUTH_MODES = ['signup', 'register', 'login']

function AuthPage({ onLogin = () => ({ ok: false }), onRegister = () => ({ ok: false }), onSignupEmail = () => ({ ok: false }) }) {
  // `navigate` lets us redirect to another route.
  const navigate = useNavigate()
  // Read current `mode` from `/auth/:mode`.
  const { mode } = useParams()

  // Fallback to login if URL contains unknown mode.
  const currentMode = VALID_AUTH_MODES.includes(mode) ? mode : 'login'

  // Keep URL clean: if mode is invalid, redirect once to `/auth/login`.
  useEffect(() => {
    if (!VALID_AUTH_MODES.includes(mode)) {
      navigate('/auth/login', { replace: true })
    }
  }, [mode, navigate])

  // Return different auth layouts based on selected mode.
  const renderAuthContent = () => {
    // Signup wizard + testimonial panel.
    if (currentMode === 'signup') {
      return (
        <div className="layout">
          <WizardAuth onSignupEmail={onSignupEmail} />
          <TestimonialPanel />
        </div>
      )
    }

    // Register form + side illustration.
    if (currentMode === 'register') {
      return (
        <div className="layout">
          <IllustrationPanel />
          <Register onRegister={onRegister} />
        </div>
      )
    }

    // Default mode: login form + side illustration.
    return (
      <div className="layout">
        <IllustrationPanel />
        <Login onLogin={onLogin} />
      </div>
    )
  }

  return (
    <main className="app-shell">
      {renderAuthContent()}
    </main>
  )
}

export default AuthPage
