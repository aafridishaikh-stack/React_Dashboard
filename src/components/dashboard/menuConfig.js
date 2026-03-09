import DashboardIcon from '../../assets/menu-icons/dashboard-act.svg'
import inActDashboardIcon from '../../assets/menu-icons/dashboard-inact.svg'
import LayoutsIcon from '../../assets/menu-icons/layout.svg'
import CoursesIcon from '../../assets/menu-icons/online-course.svg'
import FinanceIcon from '../../assets/menu-icons/finance.svg'
import MembershipIcon from '../../assets/menu-icons/membership.svg'
import UserIcon from '../../assets/menu-icons/users.svg'
import BasicIcon from '../../assets/menu-icons/basic.svg'
import AdvanceIcon from '../../assets/menu-icons/advance.svg'
import IconsIcon from '../../assets/menu-icons/icons.svg'
import FormsElementsIcon from '../../assets/menu-icons/form-elements.svg'
import FormsPluginsIcon from '../../assets/menu-icons/form-plugins.svg'
import LandingIcon from '../../assets/menu-icons/landing-page.svg'
import AuthenticationIcon from '../../assets/menu-icons/authentication.svg'
import SettingsIcon from '../../assets/menu-icons/setting.svg'
import EmailIcon from '../../assets/menu-icons/email.svg'
import ChatIcon from '../../assets/menu-icons/chat.svg'

// Full sidebar structure: sections -> items -> optional children.
export const sideSections = [
  {
    title: 'Navigation',
    items: [
      {
        label: 'Dashboard',
        slug: 'dashboard',
        icon: inActDashboardIcon,
        activeIcon: DashboardIcon,
        badge: '9',
        children: [
          { label: 'Sales', slug: 'sales' },
          {
            label: 'Analytics',
            slug: 'analytics',
            children: [
              { label: 'Traffic Report', slug: 'traffic-report' },
              { label: 'SEO Metrics', slug: 'seo-metrics' },
            ],
          },
        ],
      },
      { label: 'Layouts', slug: 'layouts', icon: LayoutsIcon, activeIcon: LayoutsIcon, badge: '9' },
      {
        label: 'Online Courses',
        slug: 'online-courses',
        icon: CoursesIcon,
        activeIcon: CoursesIcon,
        children: [
          { label: 'Course Grid', slug: 'course-grid' },
          { label: 'Course Detail', slug: 'course-detail' },
        ],
      },
      { label: 'Finance', slug: 'finance', icon: FinanceIcon, activeIcon: FinanceIcon },
      {
        label: 'Membership',
        slug: 'membership',
        icon: MembershipIcon,
        activeIcon: MembershipIcon,
        children: [
          { label: 'Plans', slug: 'plans' },
          { label: 'Subscriptions', slug: 'subscriptions' },
        ],
      },
      {
        label: 'User',
        slug: 'user',
        icon: UserIcon,
        activeIcon: UserIcon,
        children: [
          { label: 'User List', slug: 'user-list' },
          { label: 'User Roles', slug: 'user-roles' },
        ],
      },
    ],
  },
  {
    title: 'Elements',
    items: [
      {
        label: 'Basic',
        slug: 'basic',
        icon: BasicIcon,
        activeIcon: BasicIcon,
        children: [
          { label: 'Alerts', slug: 'alerts' },
          { label: 'Badges', slug: 'badges' },
        ],
      },
      {
        label: 'Advance',
        slug: 'advance',
        icon: AdvanceIcon,
        activeIcon: AdvanceIcon,
        children: [
          { label: 'Modals', slug: 'modals' },
          { label: 'Tables', slug: 'tables' },
        ],
      },
      {
        label: 'Icons',
        slug: 'icons',
        icon: IconsIcon,
        activeIcon: IconsIcon,
        children: [
          { label: 'Ant Icons', slug: 'ant-icons' },
          { label: 'Brand Icons', slug: 'brand-icons' },
        ],
      },
    ],
  },
  {
    title: 'Forms',
    items: [
      {
        label: 'Forms Elements',
        slug: 'forms-elements',
        icon: FormsElementsIcon,
        activeIcon: FormsElementsIcon,
        children: [
          { label: 'Inputs', slug: 'inputs' },
          { label: 'Selectors', slug: 'selectors' },
        ],
      },
      { label: 'Forms Plugins', slug: 'forms-plugins', icon: FormsPluginsIcon, activeIcon: FormsPluginsIcon, badge: '9' },
    ],
  },
  {
    title: 'Pages',
    items: [
      { label: 'Landing page', slug: 'landing-page', icon: LandingIcon, activeIcon: LandingIcon },
      {
        label: 'Authentication',
        slug: 'authentication',
        icon: AuthenticationIcon,
        activeIcon: AuthenticationIcon,
        children: [
          { label: 'Login page', slug: 'login-page' },
          { label: 'Register page', slug: 'register-page' },
        ],
      },
      { label: 'Settings', slug: 'settings', icon: SettingsIcon, activeIcon: SettingsIcon },
    ],
  },
  {
    title: 'Applications',
    items: [
      {
        label: 'Email',
        slug: 'email',
        icon: EmailIcon,
        activeIcon: EmailIcon,
        children: [
          { label: 'Inbox', slug: 'inbox' },
          { label: 'Compose', slug: 'compose' },
        ],
      },
      {
        label: 'Chat',
        slug: 'chat',
        icon: ChatIcon,
        activeIcon: ChatIcon,
        children: [
          { label: 'Conversations', slug: 'conversations' },
          { label: 'Support Queue', slug: 'support-queue' },
        ],
      },
    ],
  },
]

// Flatten nested items into one array.
const flatten = (items, acc = []) => {
  items.forEach((item) => {
    acc.push(item)
    if (item.children?.length) {
      flatten(item.children, acc)
    }
  })
  return acc
}

// Find full nested path (as items) to a slug.
const findPath = (items, target, trail = []) => {
  for (const item of items) {
    const nextTrail = [...trail, item]
    if (item.slug === target) return nextTrail
    if (item.children?.length) {
      const nested = findPath(item.children, target, nextTrail)
      if (nested.length) return nested
    }
  }
  return []
}

// Every menu item in one list, used for fast lookup maps.
const allItems = flatten(sideSections.flatMap((section) => section.items))

// Convert slug -> display label (example: `user-list` => `User List`).
export const menuLabelMap = allItems.reduce((acc, item) => {
  acc[item.slug] = item.label
  return acc
}, {})

// Get full breadcrumb labels for a menu slug.
export const getMenuPathBySlug = (slug) =>
  sideSections.flatMap((section) => findPath(section.items, slug)).map((item) => item.label)
