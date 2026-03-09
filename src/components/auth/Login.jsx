import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import SocialButtons from './SocialButtons'

function Login({ onLogin = () => ({ ok: false, message: 'Unable to login.' }) }) {
  // Form input state.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Shows validation/server-style messages to the user.
  const [feedback, setFeedback] = useState('')

  // Update email as user types.
  const updateEmail = (event) => {
    setEmail(event.target.value)
    // Clear old error when user starts fixing input.
    if (feedback) setFeedback('')
  }

  // Update password as user types.
  const updatePassword = (event) => {
    setPassword(event.target.value)
    if (feedback) setFeedback('')
  }

  // Runs when form is submitted.
  const handleSubmit = () => {
    // Trim spaces to avoid accidental input issues.
    const cleanedEmail = email.trim()
    const cleanedPassword = password.trim()

    // Basic required-field validation.
    if (!cleanedEmail || !cleanedPassword) {
      setFeedback('Please enter both email and password.')
      return
    }

    // Ask parent (`App.jsx`) to verify credentials.
    const result = onLogin({ email: cleanedEmail, password: cleanedPassword })

    // Show login error message from parent logic.
    if (!result.ok) {
      setFeedback(result.message)
      return
    }

    // Clear any old messages on success.
    setFeedback('')
  }

  return (
    <section className="panel auth-form split-form">
      <div className="card">
        <Logo />
        <SocialButtons prefix="Sign Up with" />

        <div className="divider"><span>OR</span></div>
        <h2>Login with your email</h2>

        <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
          <input type="email" placeholder="Email" value={email} onChange={updateEmail} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
          />

          <label className="check-row">
            <input type="checkbox" defaultChecked />
            <span>Remember me?</span>
            <a href="#">Forgot Password?</a>
          </label>

          {feedback && <p className="auth-feedback error">{feedback}</p>}

          <button type="button" className="primary full-width" onClick={handleSubmit}>Sign In</button>
        </form>

        {/* <div className="auth-demo-box">
          <p>Dummy Login Credentials</p>
          <small>Email: admin@ablepro.com</small>
          <small>Password: Admin@123</small>
        </div> */}

        <p className="switch-text">
          Don&apos;t have an account yet?
          <Link to="/auth/register"> Create Account</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
