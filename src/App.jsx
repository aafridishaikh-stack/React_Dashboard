// `useState` stores values that can change while the app is running.
import { useState } from 'react'
// React Router components used to define page routes.
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './components/auth/AuthPage'
import DashboardPage from './components/dashboard/DashboardPage'

// Key used to remember login state in the browser.
const AUTH_STORAGE_KEY = 'db-authenticated'
// Starter user so the login page works immediately for demo/learning.
const DEFAULT_USERS = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'admin@ablepro.com',
    password: 'Admin@123',
  },
]

// Helper: make email comparisons case-insensitive and whitespace-safe.
function normalizeEmail(value = '') {
  return value.trim().toLowerCase()
}

// Read login state from localStorage when app starts.
function readAuthStateFromStorage() {
  // In server-side rendering there is no `window`, so return a safe default.
  if (typeof window === 'undefined') return false

  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Save login state so refresh keeps the user logged in/out.
function saveAuthStateToStorage(isLoggedIn) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn))
  } catch {
    // Ignore storage errors in restricted environments.
  }
}

function App() {
  // `isAuthenticated` controls whether user sees auth pages or dashboard.
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthStateFromStorage)
  // Simple in-memory user list for demo register/login flow.
  const [users, setUsers] = useState(DEFAULT_USERS)

  // Use one function so React state and localStorage always stay in sync.
  const setLoggedInState = (isLoggedIn) => {
    setIsAuthenticated(isLoggedIn)
    saveAuthStateToStorage(isLoggedIn)
  }

  // Called by Login page.
  const handleLogin = ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email)
    // Find user by normalized email.
    const matchedUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail)

    if (!matchedUser) {
      return { ok: false, message: 'Invalid credentials. Account does not exist.' }
    }

    if (matchedUser.password !== password) {
      return { ok: false, message: 'Wrong password. Please try again.' }
    }

    // If credentials are correct, log user in.
    setLoggedInState(true)
    return { ok: true }
  }

  // Called by Register page.
  const handleRegister = ({ firstName, lastName, email, password }) => {
    const normalizedEmail = normalizeEmail(email)
    const emailAlreadyExists = users.some((user) => normalizeEmail(user.email) === normalizedEmail)

    if (emailAlreadyExists) {
      return { ok: false, message: 'This email is already registered.' }
    }

    // Add the new user to local React state and log them in.
    setUsers((prev) => [...prev, { firstName, lastName, email: normalizedEmail, password }])
    setLoggedInState(true)
    return { ok: true }
  }

  // Called by the signup wizard "work email" step.
  const handleSignupEmail = ({ email }) => {
    const normalizedEmail = normalizeEmail(email)
    const matchedUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail)

    if (!matchedUser) {
      return { ok: false, message: 'Email not found. Please use Register to create an account.' }
    }

    setLoggedInState(true)
    return { ok: true }
  }

  // Route rules:
  // 1) `/` redirects to login.
  // 2) `/auth/:mode` shows auth pages unless already logged in.
  // 3) `/dashboard/:menu?` shows dashboard only when logged in.
  // 4) Unknown route redirects to login.
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route
        path="/auth/:mode"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage
              onLogin={handleLogin}
              onRegister={handleRegister}
              onSignupEmail={handleSignupEmail}
            />
          )
        }
      />
      <Route
        path="/dashboard/:menu?"
        element={
          isAuthenticated ? (
            <DashboardPage onLogout={() => setLoggedInState(false)} />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

export default App
