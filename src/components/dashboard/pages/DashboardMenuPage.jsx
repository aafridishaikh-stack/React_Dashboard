import { Card, List, Tag } from 'antd'

// Content map for non-home dashboard pages.
const menuPageMeta = {
  Sales: {
    subtitle: 'Sales performance, targets, and region-wise numbers.',
    highlights: ['Monthly Target: 82%', 'Top Region: North America', 'Leads Converted: 412'],
  },
  Analytics: {
    subtitle: 'Traffic, funnel conversion, and user behavior summary.',
    highlights: ['Session Duration: 4m 12s', 'Bounce Rate: 23%', 'Conversion: 6.8%'],
  },
  Layouts: {
    subtitle: 'Layout settings and reusable UI templates.',
    highlights: ['Horizontal Layout', 'Compact Sidebar', 'Dashboard Presets'],
  },
  'Online Courses': {
    subtitle: 'Course progress and content publishing status.',
    highlights: ['Active Courses: 26', 'Published: 18', 'Draft: 8'],
  },
  Finance: {
    subtitle: 'Expenses, invoices, and payment lifecycle.',
    highlights: ['Open Invoices: 17', 'Net Margin: 31%', 'Outstanding: $42,300'],
  },
  Membership: {
    subtitle: 'Member tiers, renewals, and cancellations.',
    highlights: ['Total Members: 5,124', 'Renewal Rate: 84%', 'Churn: 2.1%'],
  },
  User: {
    subtitle: 'User accounts, roles, and permissions.',
    highlights: ['Admins: 7', 'Editors: 34', 'Viewers: 192'],
  },
  Basic: {
    subtitle: 'Basic UI elements and usage documentation.',
    highlights: ['Buttons', 'Typography', 'Spacing'],
  },
  Advance: {
    subtitle: 'Advanced component patterns and interactions.',
    highlights: ['Dynamic Forms', 'Virtualized Lists', 'Advanced Filters'],
  },
  Icons: {
    subtitle: 'Icon sets and custom icon usage.',
    highlights: ['Outlined Pack', 'Filled Pack', 'Brand Icons'],
  },
  'Forms Elements': {
    subtitle: 'Input controls and validation states.',
    highlights: ['Text Inputs', 'Selectors', 'Validation Rules'],
  },
  'Forms Plugins': {
    subtitle: 'Integrated plugins used by forms.',
    highlights: ['Date Picker', 'Rich Text', 'File Upload'],
  },
  'Landing page': {
    subtitle: 'Landing page blocks and published variants.',
    highlights: ['Hero Sections', 'Feature Grid', 'Pricing Blocks'],
  },
  Authentication: {
    subtitle: 'Authentication flows and session state.',
    highlights: ['Login', 'Register', 'Password Recovery'],
  },
  Settings: {
    subtitle: 'System settings and preferences.',
    highlights: ['Profile', 'Security', 'Notifications'],
  },
  Email: {
    subtitle: 'Mailbox summary and campaign status.',
    highlights: ['Inbox: 38', 'Scheduled: 12', 'Sent Today: 140'],
  },
  Chat: {
    subtitle: 'Live chat sessions and support queues.',
    highlights: ['Open Chats: 14', 'Avg Response: 42s', 'Resolved Today: 68'],
  },
}

// Default checklist shown in right card.
const defaultTasks = [
  'Review pending records',
  'Update page-level configuration',
  'Validate UI state and interactions',
  'Prepare summary for team handoff',
]

function DashboardMenuPage({ activeMenu, searchQuery = '' }) {
  // If menu has no custom meta, show a generic fallback.
  const meta = menuPageMeta[activeMenu] || {
    subtitle: 'Menu details and working context.',
    highlights: ['No specific metrics configured yet.'],
  }

  // Filter tasks by search text from topbar.
  const tasks = defaultTasks.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    // Two-card layout: summary on left, task list on right.
    <section className="db-grid-2 equal">
      <Card className="db-card" bordered={false}>
        <h3>{activeMenu}</h3>
        <p className="db-muted-copy">{meta.subtitle}</p>
        <div className="db-highlight-list">
          {meta.highlights.map((item) => (
            <Tag key={item} color="blue">
              {item}
            </Tag>
          ))}
        </div>
      </Card>

      <Card className="db-card" bordered={false}>
        <h3>{activeMenu} Tasks</h3>
        <List
          dataSource={tasks.length ? tasks : defaultTasks}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    </section>
  )
}

export default DashboardMenuPage
