// React hooks for state and side effects.
import { useEffect, useState } from 'react'
// Router hooks for reading URL and navigating.
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/dashboard.scss'
import DashboardCenter from './DashboardCenter'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import { getMenuPathBySlug, menuLabelMap } from './menuConfig'

const THEME_STORAGE_KEY = 'db-theme'

function readThemeFromStorage() {
  if (typeof window === 'undefined') return false

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
  } catch {
    return false
  }
}

function DashboardPage({ onLogout = () => {} }) {
  // Current menu slug from URL: `/dashboard/:menu?`.
  const { menu } = useParams()
  // Used for route redirects when slug is invalid.
  const navigate = useNavigate()

  // Controls loading screen stages.
  const [loadingStage, setLoadingStage] = useState('initial')
  // Sidebar collapsed/expanded state.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // Header search open state.
  const [searchOpen, setSearchOpen] = useState(false)
  // Text entered in dashboard search.
  const [searchQuery, setSearchQuery] = useState('')
  // Reads initial theme from localStorage.
  const [darkTheme, setDarkTheme] = useState(readThemeFromStorage)

  // If URL has no menu slug, default to the first dashboard child page (`sales`).
  const activeMenuSlug = menu || 'sales'
  // Convert slug to user-facing label (example: `traffic-report` -> `Traffic Report`).
  const activeMenuLabel = menuLabelMap[activeMenuSlug]
  // Full breadcrumb path labels for current menu.
  const menuPath = getMenuPathBySlug(activeMenuSlug)

  // Redirect to base dashboard if slug is unknown.
  useEffect(() => {
    if (!activeMenuLabel) {
      navigate('/dashboard', { replace: true })
    }
  }, [activeMenuLabel, navigate])

  // Simulate a small loading sequence for dashboard entry animation.
  useEffect(() => {
    const textTimer = setTimeout(() => setLoadingStage('text'), 1000)
    const readyTimer = setTimeout(() => setLoadingStage('ready'), 2000)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(readyTimer)
    }
  }, [])

  // Trigger resize when sidebar width changes so charts recalculate correctly.
  useEffect(() => {
    const immediate = setTimeout(() => window.dispatchEvent(new Event('resize')), 0)
    const afterTransition = setTimeout(() => window.dispatchEvent(new Event('resize')), 300)

    return () => {
      clearTimeout(immediate)
      clearTimeout(afterTransition)
    }
  }, [sidebarCollapsed])

  // Toggle dark/light mode and persist preference.
  const handleToggleTheme = () => {
    setDarkTheme((prev) => {
      const next = !prev

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
        } catch {
          // Ignore storage access errors.
        }
      }

      return next
    })
  }

  // Main dashboard layout: sidebar + topbar + content area.
  return (
    <div className={`db-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${darkTheme ? 'dark-theme' : ''}`}>
      <DashboardSidebar
        activeMenu={activeMenuSlug}
        onMenuChange={(slug) => navigate(slug === 'dashboard' ? '/dashboard' : `/dashboard/${slug}`)}
      />

      <div className="db-main-wrap">
        <DashboardHeader
          onLogout={onLogout}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          searchOpen={searchOpen}
          onToggleSearch={() => setSearchOpen((prev) => !prev)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          darkTheme={darkTheme}
          onToggleTheme={handleToggleTheme}
        />

        {loadingStage !== 'ready' ? (
          <main className="db-main db-loading-screen">
            {loadingStage === 'text' && <p className="db-loading-text">Loading dashboard...</p>}
          </main>
        ) : (
          <DashboardCenter
            activeMenu={activeMenuLabel || 'Dashboard'}
            searchQuery={searchQuery}
            menuPath={menuPath}
          />
        )}
      </div>
    </div>
  )
}

export default DashboardPage
