import DashboardFooter from './DashboardFooter'
import DashboardHomePage from './pages/DashboardHomePage'
import DashboardMenuPage from './pages/DashboardMenuPage'

// Human-friendly page titles for each sidebar menu label.
const titleMap = {
  Dashboard: 'Home',
  Sales: 'Home',
  Analytics: 'Analytics',
  'Traffic Report': 'Traffic Report',
  'SEO Metrics': 'SEO Metrics',
  Layouts: 'Layouts',
  'Online Courses': 'Online Courses',
  'Course Grid': 'Course Grid',
  'Course Detail': 'Course Detail',
  Finance: 'Finance',
  Membership: 'Membership',
  Plans: 'Plans',
  Subscriptions: 'Subscriptions',
  User: 'User Management',
  'User List': 'User List',
  'User Roles': 'User Roles',
  Basic: 'Basic Elements',
  Alerts: 'Alerts',
  Badges: 'Badges',
  Advance: 'Advanced Elements',
  Modals: 'Modals',
  Tables: 'Tables',
  Icons: 'Icons',
  'Ant Icons': 'Ant Icons',
  'Brand Icons': 'Brand Icons',
  'Forms Elements': 'Form Elements',
  Inputs: 'Inputs',
  Selectors: 'Selectors',
  'Forms Plugins': 'Form Plugins',
  'Landing page': 'Landing Page',
  Authentication: 'Authentication',
  'Login page': 'Login Page',
  'Register page': 'Register Page',
  Settings: 'Settings',
  Email: 'Email',
  Inbox: 'Inbox',
  Compose: 'Compose',
  Chat: 'Chat',
  Conversations: 'Conversations',
  'Support Queue': 'Support Queue',
}

// Build breadcrumb parts from current menu path.
function buildBreadcrumbParts(activeTitle, menuPath) {
  const parts = ['Home']

  if (!menuPath.length || menuPath[0] !== 'Dashboard') {
    parts.push('Dashboard')
  }

  if (menuPath.length) {
    parts.push(...menuPath)
  } else {
    parts.push(activeTitle)
  }

  return parts.filter((item, index, array) => index === 0 || item !== array[index - 1])
}

function DashboardCenter({ activeMenu = 'Dashboard', searchQuery = '', menuPath = [] }) {
  // If menu label has a special display title use it, otherwise show raw label.
  const title = titleMap[activeMenu] || activeMenu
  const breadcrumbParts = buildBreadcrumbParts(title, menuPath)

  return (
    // Main content area beneath top header.
    <main className="db-main">
      <div className="db-breadcrumb">
        {breadcrumbParts.map((part, index) => (
          <span key={`${part}-${index}`} className={index === breadcrumbParts.length - 1 ? 'db-breadcrumb-current' : ''}>
            {index > 0 ? ' > ' : ''}
            {part}
          </span>
        ))}
      </div>
      <h2>{title}</h2>

      {/* Dashboard/Sales route uses special homepage component; all others use generic menu page. */}
      {activeMenu === 'Dashboard' || activeMenu === 'Sales' ? (
        <DashboardHomePage searchQuery={searchQuery} />
      ) : (
        <DashboardMenuPage activeMenu={activeMenu} searchQuery={searchQuery} />
      )}

      {/* Shared footer for dashboard area. */}
      <DashboardFooter />
    </main>
  )
}

export default DashboardCenter
