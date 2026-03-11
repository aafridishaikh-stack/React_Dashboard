import { useEffect, useMemo, useState } from 'react'
import {
  CaretUpFilled,
  CalendarOutlined,
  CreditCardOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  LinkOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Input, Modal } from 'antd'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import blueGraph from '../../../assets/blue-graph.svg'
import redGraph from '../../../assets/red-graph.svg'
import trendDownIcon from '../../../assets/txn-trend-down.svg'
import trendUpIcon from '../../../assets/txn-trend-up.svg'
import trendWarnIcon from '../../../assets/txn-trend-warn.svg'

// Register Chart.js pieces once before any chart is rendered.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

// KPI cards shown in the first row.
const statCards = [
  {
    title: 'All Earnings',
    color: 'blue',
    icon: CreditCardOutlined,
    control: 'select',
    filters: {
      Today: { value: '$30,200', growth: '30.6%', bars: [18, 24, 22, 31, 40, 56, 44, 36, 30, 28, 22, 34, 42, 58, 44, 38] },
      Weekly: { value: '$82,100', growth: '22.4%', bars: [26, 34, 31, 42, 38, 48, 52, 60, 54, 40, 36, 42, 57, 62, 55, 50] },
      Monthly: { value: '$302,000', growth: '16.1%', bars: [22, 30, 44, 38, 52, 62, 58, 48, 54, 60, 50, 46, 58, 64, 60, 56] },
    },
  },
  {
    title: 'Page Views',
    color: 'amber',
    icon: FileTextOutlined,
    control: 'select',
    filters: {
      Today: { value: '290+', growth: '30.6%', bars: [14, 18, 16, 20, 22, 28, 34, 30, 26, 24, 20, 22, 25, 29, 27, 24] },
      Weekly: { value: '1,980+', growth: '18.2%', bars: [16, 22, 20, 26, 28, 34, 36, 32, 30, 28, 26, 29, 33, 38, 35, 30] },
      Monthly: { value: '8,940+', growth: '12.8%', bars: [18, 24, 22, 30, 36, 40, 44, 40, 36, 34, 32, 35, 39, 44, 42, 38] },
    },
  },
  {
    title: 'Total Task',
    color: 'green',
    icon: CalendarOutlined,
    control: 'dots',
    filters: {
      Today: { value: '14,568', growth: '30.6%', bars: [12, 16, 14, 18, 24, 28, 34, 31, 28, 26, 22, 25, 30, 34, 31, 27] },
      Weekly: { value: '18,905', growth: '19.9%', bars: [16, 20, 22, 26, 30, 34, 38, 36, 33, 31, 29, 32, 35, 39, 37, 34] },
      Monthly: { value: '46,920', growth: '11.7%', bars: [18, 24, 26, 30, 34, 38, 42, 40, 38, 35, 33, 36, 40, 44, 42, 39] },
    },
  },
  {
    title: 'Download',
    color: 'red',
    icon: DownloadOutlined,
    control: 'dots',
    filters: {
      Today: { value: '$30,200', growth: '30.6%', bars: [10, 14, 16, 18, 26, 30, 36, 32, 29, 24, 22, 26, 30, 35, 32, 28] },
      Weekly: { value: '$72,480', growth: '20.4%', bars: [14, 18, 22, 24, 30, 34, 40, 36, 33, 30, 28, 30, 34, 39, 36, 33] },
      Monthly: { value: '$249,630', growth: '13.2%', bars: [18, 22, 26, 30, 36, 40, 45, 42, 39, 36, 34, 37, 41, 46, 44, 40] },
    },
  },
]

// Transaction rows for bottom-left card.
const transactions = [
  { name: 'headspace', time: '02:30 pm', amount: '+210,000', growth: '30.6%', trend: 'up', status: 'success', brand: 'hs' },
  { name: 'Spotify Music', time: '04:30 pm', amount: '- 10,000', growth: '30.6%', trend: 'down', status: 'pending', brand: 'sp' },
  { name: 'Medium Platform', time: '06:30 pm', amount: '+210,000', growth: '30.6%', trend: 'up', status: 'success', brand: 'md' },
  { name: 'Uber', time: '08:40 pm', amount: '+210,000', growth: '30.6%', trend: 'warn', status: 'success', brand: 'ub' },
  { name: 'Ola Cabs', time: '07:40 pm', amount: '+210,000', growth: '30.6%', trend: 'up', status: 'pending', brand: 'oc' },
]

const trendIcons = {
  up: trendUpIcon,
  down: trendDownIcon,
  warn: trendWarnIcon,
}

// Initial items shown in "Project - Able Pro" panel.
const initialProjectTasks = [
  { title: 'Horizontal Layout', count: 2, tone: 'amber' },
  { title: 'Invoice Generate', count: 8, tone: 'blue', active: true },
  { title: 'Package update', count: 2, tone: 'amber' },
  { title: 'Figma auto layout', count: 2, tone: 'amber' },
]

// Selectable team members for "Add Team Members" modal.
const dummyTeamMembers = [
  { id: 'tm-1', name: 'Allie Grater', role: 'Designer', initials: 'AG', tone: 'rose' },
  { id: 'tm-2', name: 'John Smith', role: 'Admin', initials: 'JS', tone: 'sand' },
  { id: 'tm-3', name: 'Maria Chen', role: 'Engineer', initials: 'MC', tone: 'mint' },
  { id: 'tm-4', name: 'Nina Patel', role: 'Product', initials: 'NP', tone: 'lilac' },
  { id: 'tm-5', name: 'Omar Khan', role: 'Finance', initials: 'OK', tone: 'sky' },
]

// Targets used in animated project overview counters.
const TOTAL_TASKS_TARGET = 34686
const PENDING_TASKS_TARGET = 3786

// Line chart config for Monthly Revenue panel.
const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      data: [20, 70, 40, 68, 71, 90, 52, 58, 47, 61, 52, 66],
      borderColor: '#2f74ff',
      backgroundColor: 'transparent',
      tension: 0.42,
      fill: false,
      pointRadius: 0,
    },
  ],
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1400,
    easing: 'easeOutQuart',
  },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#7b879d', font: { size: 12 } },
    },
    y: {
      min: 0,
      max: 100,
      ticks: { stepSize: 20, color: '#7b879d', font: { size: 12 } },
      grid: { color: '#edf1f8', borderDash: [4, 4] },
      border: { display: false },
    },
  },
}

const DONUT_RADIUS = 104
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const DONUT_GAP = 10
const donutSegments = [
  { key: 'light', length: 74, gradient: 'db-donut-light' },
  { key: 'blue', length: 251, gradient: 'db-donut-blue', explodeX: 6, explodeY: -10 },
  { key: 'orange', length: 165, gradient: 'db-donut-orange' },
  { key: 'green', length: 123, gradient: 'db-donut-green' },
]

function DashboardHomePage({ searchQuery = '' }) {
  // Tab state for transactions card.
  const [activeTransactionTab, setActiveTransactionTab] = useState('all')
  // Changes key for mini-bar re-animation when card filter changes.
  const [cardRefreshSeed, setCardRefreshSeed] = useState({})
  // Refresh counters used by different cards/panels.
  const [panelRefresh, setPanelRefresh] = useState({
    revenue: 0,
    overview: 0,
    income: 0,
    project: 0,
    transactions: 0,
    team: 0,
  })
  // Project task list shown in project panel.
  const [projectTasks, setProjectTasks] = useState(initialProjectTasks)
  // "Add task" modal state + form fields.
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskScope, setTaskScope] = useState('Project - Able Pro')
  // "Add team members" modal state.
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState(dummyTeamMembers.slice(0, 4))
  const [selectedTeamIds, setSelectedTeamIds] = useState(dummyTeamMembers.slice(0, 4).map((member) => member.id))
  // Animated values for KPI and overview counters.
  const [animatedMetrics, setAnimatedMetrics] = useState({
    kpi: 5.44,
    totalTasks: TOTAL_TASKS_TARGET,
    pendingTasks: PENDING_TASKS_TARGET,
  })
  // Selected filter per stat card.
  const [cardFilters, setCardFilters] = useState({
    'All Earnings': 'Today',
    'Page Views': 'Weekly',
    'Total Task': 'Today',
    Download: 'Weekly',
  })

  // Search text from topbar -> normalized terms.
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchTerms = normalizedSearch.split(/\s+/).filter(Boolean)

  // Helper used to hide/show dashboard blocks by search keywords.
  const matchesBlock = (keywords = []) => {
    if (!searchTerms.length) return true
    const haystack = keywords.join(' ').toLowerCase()
    return searchTerms.every((term) => haystack.includes(term))
  }

  // Transactions shown by selected tab + optional reverse on refresh.
  const filteredTransactions = useMemo(() => {
    const byTab = transactions.filter((item) => {
      if (activeTransactionTab === 'all') return true
      return item.status === activeTransactionTab
    })

    return panelRefresh.transactions % 2 === 0 ? byTab : [...byTab].reverse()
  }, [activeTransactionTab, panelRefresh.transactions])

  // Visibility flags for each major dashboard block.
  const visibleStatCards = statCards.filter((item) =>
    matchesBlock([item.title, 'stats', 'kpi', 'earnings', 'views', 'task', 'download']),
  )
  const showMonthlyRevenue = matchesBlock(['monthly revenue', 'revenue', 'line chart', 'item 01', 'item 02'])
  const showProjectCard = matchesBlock(['project able pro', 'new tasks', 'release', 'horizontal layout', 'invoice'])
  const showOverview = matchesBlock(['project overview', 'total tasks', 'pending tasks'])
  const showTeam = matchesBlock(['able pro', 'team', 'members', 'group'])
  const showTransactions = matchesBlock(['transactions', 'all transaction', 'success', 'pending', 'history'])
  const showTotalIncome = matchesBlock(['total income', 'income', 'rent', 'download', 'views', 'doughnut'])

  const hasAnyVisibleBlock =
    visibleStatCards.length > 0 ||
    showMonthlyRevenue ||
    showProjectCard ||
    showOverview ||
    showTeam ||
    showTransactions ||
    showTotalIncome

  // Keep as memoized value for future extension and clearer intent.
  const visibleTeamMembers = useMemo(() => {
    return teamMembers
  }, [teamMembers])

  // Animate KPI percent when revenue panel refreshes.
  useEffect(() => {
    const start = performance.now()
    const duration = 850
    let frame = 0

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3

      setAnimatedMetrics((prev) => ({
        ...prev,
        kpi: 5.44 * eased,
      }))

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [panelRefresh.revenue])

  // Animate project overview numbers when overview panel refreshes.
  useEffect(() => {
    const start = performance.now()
    const duration = 850
    let frame = 0

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3

      setAnimatedMetrics((prev) => ({
        ...prev,
        totalTasks: Math.round(TOTAL_TASKS_TARGET * eased),
        pendingTasks: Math.round(PENDING_TASKS_TARGET * eased),
      }))

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [panelRefresh.overview])

  // Percent widths used for reveal effect in overview graph images.
  const totalTasksProgress = Math.max(0, Math.min(100, (animatedMetrics.totalTasks / TOTAL_TASKS_TARGET) * 100))
  const pendingTasksProgress = Math.max(0, Math.min(100, (animatedMetrics.pendingTasks / PENDING_TASKS_TARGET) * 100))

  // Shared dropdown action handler for panel menus.
  const handlePanelMenuClick = (panel) => ({ key }) => {
    if (key === 'refresh') {
      if (panel === 'project') {
        setProjectTasks((prev) =>
          prev.map((item, index) => ({
            ...item,
            active: index === ((panelRefresh.project + 1) % prev.length),
          })),
        )
      }

      if (panel !== 'team') {
        setPanelRefresh((prev) => ({ ...prev, [panel]: prev[panel] + 1 }))
      }
    }
  }

  // Build panel menu config.
  const getPanelMenu = (panel) => ({
    onClick: handlePanelMenuClick(panel),
    items: [
      { key: 'refresh', label: 'Refresh' },
      { key: 'export', label: 'Export' },
      { key: 'settings', label: 'Settings' },
    ],
  })

  // Open "Add task" modal and prefill which area user came from.
  const openAddTaskModal = (scope) => {
    setTaskScope(scope)
    setTaskName('')
    setTaskModalOpen(true)
  }

  // Add new task to project list.
  const handleCreateTask = () => {
    if (!taskName.trim()) {
      return
    }

    setProjectTasks((prev) => [
      ...prev.map((task) => ({ ...task, active: false })),
      {
        title: taskName.trim(),
        count: 1,
        tone: 'amber',
        active: true,
      },
    ])
    setTaskModalOpen(false)
  }

  // Save selected members from modal into visible team list.
  const handleAddTeamMembers = () => {
    const nextMembers = dummyTeamMembers.filter((member) => selectedTeamIds.includes(member.id))
    setTeamMembers(nextMembers)
    setTeamModalOpen(false)
  }

  return (
    <>
      {/* Row 1: top KPI cards with mini bar charts and card-level filters. */}
      {!!visibleStatCards.length && (
        <div className="db-stats-grid">
          {visibleStatCards.map((item) => (
          <article key={item.title} className="db-panel db-stat-panel">
            <div className="db-stat-head">
              <div className="db-stat-left">
                <span className={`db-stat-icon ${item.color}`}>
                  <item.icon />
                </span>
                <p>{item.title}</p>
              </div>

              {item.control === 'select' ? (
                <select
                  className={`db-filter-select${item.title === 'All Earnings' ? ' db-filter-select-plain' : ''}`}
                  value={cardFilters[item.title]}
                  onChange={(event) =>
                    setCardFilters((prev) => ({
                      ...prev,
                      [item.title]: event.target.value,
                    }))
                  }
                >
                  {Object.keys(item.filters).map((filterName) => (
                    <option key={filterName} value={filterName}>
                      {filterName}
                    </option>
                  ))}
                </select>
              ) : (
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: Object.keys(item.filters).map((filterName) => ({
                      key: filterName,
                      label: filterName,
                    })),
                    selectedKeys: [cardFilters[item.title]],
                    onClick: ({ key }) => {
                      setCardFilters((prev) => ({
                        ...prev,
                        [item.title]: key,
                      }))
                      setCardRefreshSeed((prev) => ({
                        ...prev,
                        [item.title]: (prev[item.title] || 0) + 1,
                      }))
                    },
                  }}
                >
                  <Button type="text" className="db-card-menu-btn" aria-label={`${item.title} options`}>
                    <MoreOutlined />
                  </Button>
                </Dropdown>
              )}
            </div>

            <div className="db-stat-body">
              <div className="db-mini-bars">
                {item.filters[cardFilters[item.title]].bars.map((value, index) => (
                  <span
                    key={`${item.title}-${index}-${cardRefreshSeed[item.title] || 0}`}
                    className={`bar ${item.color}`}
                    style={{
                      height: `${value}px`,
                      animationDelay: `${index * 0.05}s`,
                    }}
                  />
                ))}
              </div>
              <div className="db-panel-foot">
                <strong>{item.filters[cardFilters[item.title]].value}</strong>
                <span className={`db-growth ${item.color}`}> {item.filters[cardFilters[item.title]].growth}</span>
              </div>
            </div>
          </article>
          ))}
        </div>
      )}

      {/* Row 2: monthly revenue chart + project tasks card. */}
      {(showMonthlyRevenue || showProjectCard) && (
        <section className="db-grid-2">
          {showMonthlyRevenue && (
            <article className="db-panel db-chart-panel">
          <div className="db-chart-head">
            <h3>Monthly Revenue</h3>
            <Dropdown trigger={['click']} menu={getPanelMenu('revenue')}>
              <Button type="text" className="db-card-menu-btn" aria-label="Monthly Revenue options">
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="db-chart-meta">
            <div className="db-legend">
              <span><i className="blue" /> Item 01</span>
              <span><i className="soft-blue" /> Item 02</span>
            </div>
            <p className="db-chart-kpi">{animatedMetrics.kpi.toFixed(2)}% <span>+2.6%</span></p>
          </div>
          <div className="db-chart-wrap"><Line key={`line-${panelRefresh.revenue}`} data={lineData} options={lineOptions} /></div>
            </article>
          )}

          {showProjectCard && (
            <article className="db-panel db-project-panel">
          <div className="db-chart-head">
            <h3>Project - Able Pro</h3>
            <Dropdown trigger={['click']} menu={getPanelMenu('project')}>
              <Button type="text" className="db-card-menu-btn" aria-label="Project options">
                <MoreOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="db-task-chip"><span className="db-task-icon"><CalendarOutlined /></span> New Tasks <span>20</span></div>
          <p className="db-release">Release v1.2.0 <span>70%</span></p>
          <div className="db-progress"><span /></div>
          <ul>
            {projectTasks.map((task) => (
              <li key={task.title} className={task.active ? 'active' : ''}>
                <span className={`dot ${task.tone === 'blue' ? 'blue' : ''}`} />
                {task.title}
                <small><LinkOutlined /> {task.count}</small>
              </li>
            ))}
          </ul>
          <Button type="text" className="db-primary-btn db-block-btn" onClick={() => openAddTaskModal('Project - Able Pro')}>
            <PlusOutlined /> Add task
          </Button>
            </article>
          )}
        </section>
      )}

      {/* Row 3: project overview metrics + team quick card. */}
      {(showOverview || showTeam) && (
        <section className="db-grid-2 slim">
          {showOverview && (
            <article className="db-panel db-overview-panel">
          <div className="db-chart-head">
            <h3>Project overview</h3>
            <Dropdown trigger={['click']} menu={getPanelMenu('overview')}>
              <Button type="text" className="db-card-menu-btn" aria-label="Project overview options">
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="db-overview-grid">
            <div className="db-overview-box">
              <p>Total Tasks</p>
              <strong>{animatedMetrics.totalTasks.toLocaleString()}</strong>
              <div className="db-mini-line-reveal" style={{ '--reveal-width': `${totalTasksProgress}%` }}>
                <img
                  key={`total-map-${panelRefresh.overview}`}
                  className="db-mini-line-image"
                  src={blueGraph}
                  alt="Total tasks trend"
                />
              </div>
            </div>
            <div className="db-overview-box with-divider">
              <p>Pending Tasks</p>
              <strong>{animatedMetrics.pendingTasks.toLocaleString()}</strong>
              <div className="db-mini-line-reveal" style={{ '--reveal-width': `${pendingTasksProgress}%` }}>
                <img
                  key={`pending-map-${panelRefresh.overview}`}
                  className="db-mini-line-image"
                  src={redGraph}
                  alt="Pending tasks trend"
                />
              </div>
            </div>
            <Button type="text" className="db-primary-btn db-overview-add-btn" onClick={() => openAddTaskModal('Project overview')}>
              <PlusOutlined /> Add task
            </Button>
          </div>
            </article>
          )}

          {showTeam && (
            <article className="db-panel db-team-panel">
          <div className="db-team-head">
            <div className="db-team-title">
              <span className="db-team-badge" />
              <div>
                <h3>Able pro</h3>
                <p>@ableprodevelop</p>
              </div>
            </div>
            <Dropdown trigger={['click']} menu={getPanelMenu('team')}>
              <Button type="text" className="db-card-menu-btn" aria-label="Able pro options">
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="db-team-row">
            {teamMembers.length > 0 ? (
              <div className="db-team-avatars">
                {visibleTeamMembers.slice(0, 3).map((member) => (
                  <span key={member.id} className={`avatar ${member.tone}`} title={member.name}>
                    {member.initials}
                  </span>
                ))}
              </div>
            ) : null}
            {teamMembers.length >= 4 ? <span className="count">+{teamMembers.length - 3}</span> : null}
            <Button type="text" className="db-team-add" onClick={() => setTeamModalOpen(true)}>+</Button>
          </div>
            </article>
          )}
        </section>
      )}

      {/* Row 4: transactions list + total income donut chart. */}
      {(showTransactions || showTotalIncome) && (
        <section className="db-grid-2 equal">
          {showTransactions && (
            <article className="db-panel db-trans-panel">
          <div className="db-chart-head">
            <h3>Transactions</h3>
            <Dropdown trigger={['click']} menu={getPanelMenu('transactions')}>
              <Button type="text" className="db-card-menu-btn" aria-label="Transactions options">
                <MoreOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="db-tabs">
            <Button
              type="text"
              className={activeTransactionTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTransactionTab('all')}
            >
              All Transaction
            </Button>
            <Button
              type="text"
              className={activeTransactionTab === 'success' ? 'active' : ''}
              onClick={() => setActiveTransactionTab('success')}
            >
              Success
            </Button>
            <Button
              type="text"
              className={activeTransactionTab === 'pending' ? 'active' : ''}
              onClick={() => setActiveTransactionTab('pending')}
            >
              Pending
            </Button>
          </div>
          <div className="db-transaction-list">
            {filteredTransactions.map((item) => (
              <div key={item.name} className="db-row">
                <div className="db-row-user">
                  <span className={`brand ${item.brand}`}><span className="brand-mark" /></span>
                  <div><p>{item.name}</p><small>{item.time}</small></div>
                </div>
                <div className="db-row-amount">
                  <strong>{item.amount}</strong>
                  <small className={item.trend}>
                    <img className="db-trend-icon" src={trendIcons[item.trend]} alt={`${item.trend} trend`} />
                    {item.growth}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <div className="db-transaction-actions"><Button type="text" className="db-ghost-btn">View all Transaction History</Button><Button type="text" className="db-primary-btn">Create new Transaction</Button></div>
            </article>
          )}

          {showTotalIncome && (
            <article className="db-panel db-income-panel">
          <div className="db-chart-head">
            <h3>Total Income</h3>
            <Dropdown trigger={['click']} menu={getPanelMenu('income')}>
              <Button type="text" className="db-card-menu-btn" aria-label="Total Income options">
                <MoreOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="db-donut-wrap">
            <div className="db-donut-chart-wrap" role="img" aria-label="Income distribution donut chart">
              <svg className="db-donut-svg" viewBox="0 0 280 280" aria-hidden="true">
                <defs>
                  <linearGradient id="db-donut-blue" x1="68" y1="20" x2="244" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1e90ff" />
                    <stop offset="100%" stopColor="#0b5ed7" />
                  </linearGradient>
                  <linearGradient id="db-donut-orange" x1="76" y1="236" x2="232" y2="136" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffa94d" />
                    <stop offset="100%" stopColor="#ff8c00" />
                  </linearGradient>
                  <linearGradient id="db-donut-green" x1="24" y1="198" x2="132" y2="92" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#20c997" />
                    <stop offset="100%" stopColor="#12b886" />
                  </linearGradient>
                  <linearGradient id="db-donut-light" x1="68" y1="40" x2="190" y2="118" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#eef3f8" />
                    <stop offset="100%" stopColor="#dfe7ef" />
                  </linearGradient>
                </defs>

                {donutSegments.map((segment, index) => {
                  const consumed = donutSegments
                    .slice(0, index)
                    .reduce((sum, item) => sum + item.length + DONUT_GAP, 0)

                  const commonProps = {
                    cx: 140,
                    cy: 140,
                    r: DONUT_RADIUS,
                    fill: 'none',
                    stroke: `url(#${segment.gradient})`,
                    strokeWidth: 50,
                    strokeLinecap: 'butt',
                    strokeDasharray: `${segment.length} ${DONUT_CIRCUMFERENCE}`,
                    strokeDashoffset: -consumed,
                    transform: 'rotate(-128 140 140)',
                  }

                  if (segment.explodeX || segment.explodeY) {
                    return (
                      <g key={segment.key} transform={`translate(${segment.explodeX || 0} ${segment.explodeY || 0})`}>
                        <circle {...commonProps} />
                      </g>
                    )
                  }

                  return <circle key={segment.key} {...commonProps} />
                })}
              </svg>
            </div>
            <div className="db-donut-center"><strong>$560</strong><p>Total income</p></div>
          </div>
          <div className="db-income-grid">
            {[
              { label: 'Income', dot: 'blue' },
              { label: 'Rent', dot: 'amber' },
              { label: 'Download', dot: 'green' },
              { label: 'Views', dot: 'light' },
            ].map((item) => (
              <div key={item.label}>
                <p><i className={`dot ${item.dot}`} /> {item.label}</p>
                <strong>
                  $23,876
                  <small className="db-income-growth"><CaretUpFilled /> + $763,43</small>
                </strong>
              </div>
            ))}
          </div>
            </article>
          )}
        </section>
      )}

      {/* Fallback when search terms hide every dashboard block. */}
      {!hasAnyVisibleBlock && (
        <article className="db-panel db-empty-search">
          <h3>No matching dashboard blocks</h3>
          <p>Try searching for blocks like monthly revenue, transactions, total income, or project overview.</p>
        </article>
      )}

      {/* Modal for creating a new task in project/overview sections. */}
      <Modal
        title={`Add Task - ${taskScope}`}
        open={taskModalOpen}
        onCancel={() => setTaskModalOpen(false)}
        onOk={handleCreateTask}
        okText="Create Task"
        okButtonProps={{ disabled: !taskName.trim() }}
      >
        <div className="db-task-modal">
          <label htmlFor="task-name">Task Name</label>
          <Input
            id="task-name"
            placeholder="Enter task name"
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
          />
          <label htmlFor="task-scope">Scope</label>
          <select
            id="task-scope"
            className="db-native-select"
            value={taskScope}
            onChange={(event) => setTaskScope(event.target.value)}
          >
            <option value="Project - Able Pro">Project - Able Pro</option>
            <option value="Project overview">Project overview</option>
          </select>
        </div>
      </Modal>

      {/* Modal for choosing which members appear in team card. */}
      <Modal
        title="Add Team Members"
        open={teamModalOpen}
        onCancel={() => setTeamModalOpen(false)}
        onOk={handleAddTeamMembers}
        okText="Update"
      >
        <div className="db-team-modal">
          <div className="db-team-modal-actions">
            <Button
              type="text"
              className="db-modal-link-btn"
              onClick={() => setSelectedTeamIds(dummyTeamMembers.map((member) => member.id))}
            >
              Select all
            </Button>
            <Button
              type="text"
              className="db-modal-link-btn"
              onClick={() => setSelectedTeamIds([])}
            >
              Clear
            </Button>
          </div>
          <p className="db-team-modal-note">Choose team members to add into Able pro group.</p>
          {dummyTeamMembers.map((member) => (
            <label key={member.id} className="db-team-member-option">
              <span className={`avatar ${member.tone}`}>{member.initials}</span>
              <span className="db-member-meta">
                <strong>{member.name}</strong>
                <small>{member.role}</small>
              </span>
              <Checkbox
                checked={selectedTeamIds.includes(member.id)}
                onChange={(event) =>
                  setSelectedTeamIds((prev) =>
                    event.target.checked ? [...prev, member.id] : prev.filter((id) => id !== member.id),
                  )
                }
              />
            </label>
          ))}
        </div>
      </Modal>
    </>
  )
}

export default DashboardHomePage
