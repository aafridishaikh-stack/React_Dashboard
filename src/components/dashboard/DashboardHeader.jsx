import { useMemo } from 'react'
import { Avatar, Badge, Button, Dropdown, Input } from 'antd'
import ProfileAvatar from '../../assets/profile.png'
import SunIcon from '../../assets/sun.svg'
import HomeIcon from '../../assets/home.svg'
import MessageIcon from '../../assets/message.svg'
import NotificationIcon from '../../assets/notification.svg'
import CollapseIcon from '../../assets/menu.svg'
import SearchIcon from '../../assets/search-normal.svg'

import {
  BulbOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SearchOutlined,
  SettingOutlined,
  SoundOutlined,
  UserOutlined,
} from '@ant-design/icons'

// Small gear dropdown.
const settingsItems = [
  { key: 'appearance', icon: <BulbOutlined />, label: 'Appearance' },
  { key: 'security', icon: <SettingOutlined />, label: 'Security' },
  { key: 'sound', icon: <SoundOutlined />, label: 'Sound & Alerts' },
]

// Demo inbox items for message dropdown.
const messageItems = [
  { key: 'm1', title: 'John Smith', body: 'Can you review the latest dashboard update?', time: '2m ago' },
  { key: 'm2', title: 'Allie Grater', body: 'UI changes are ready for testing.', time: '9m ago' },
  { key: 'm3', title: 'Support Bot', body: 'Daily report has been generated.', time: '18m ago' },
]

// Demo alerts for notification dropdown.
const notificationItems = [
  { key: 'n1', title: 'New user signup', body: 'Maria Chen joined as Analyst.', time: '1m ago' },
  { key: 'n2', title: 'Task completed', body: 'Invoice Generate task is closed.', time: '13m ago' },
  { key: 'n3', title: 'Backup success', body: 'Backup finished without issues.', time: '35m ago' },
]

// Build shared dropdown format for messages/notifications.
const toInfoDropdownMenu = (items, title) => ({
  items: [
    {
      key: 'header',
      disabled: true,
      label: <div className="db-dd-title">{title}</div>,
    },
    ...items.map((item) => ({
      key: item.key,
      label: (
        <div className="db-dd-item">
          <p>{item.title}</p>
          <small>{item.body}</small>
          <span>{item.time}</span>
        </div>
      ),
    })),
  ],
})

// Convert settings list into Ant Design menu format.
const settingsMenu = {
  items: settingsItems.map((item) => ({
    key: item.key,
    label: (
      <div className="db-dd-inline">
        {item.icon}
        <span>{item.label}</span>
      </div>
    ),
  })),
}

// Profile dropdown includes logout callback from parent.
const getProfileMenu = (onLogout) => ({
  items: [
    {
      key: 'profile',
      label: (
        <div className="db-dd-inline">
          <UserOutlined />
          <span>My Profile</span>
        </div>
      ),
    },
    {
      key: 'account',
      label: (
        <div className="db-dd-inline">
          <SettingOutlined />
          <span>Account Settings</span>
        </div>
      ),
    },
    {
      key: 'activity',
      label: (
        <div className="db-dd-inline">
          <FileTextOutlined />
          <span>Activity Logs</span>
        </div>
      ),
    },
    {
      key: 'more',
      label: (
        <div className="db-dd-inline">
          <EllipsisOutlined />
          <span>More Options</span>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div className="db-dd-inline danger">
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      ),
      onClick: onLogout,
    },
  ],
})

function DashboardHeader({
  onLogout = () => {},
  sidebarCollapsed = false,
  onToggleSidebar = () => {},
  searchOpen = false,
  onToggleSearch = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  darkTheme = false,
  onToggleTheme = () => {},
}) {
  // Memoized menus avoid rebuilding objects on every render.
  const profileItems = useMemo(() => getProfileMenu(onLogout), [onLogout])
  const messageMenu = useMemo(() => toInfoDropdownMenu(messageItems, 'Latest Messages'), [])
  const notificationMenu = useMemo(() => toInfoDropdownMenu(notificationItems, 'Notifications'), [])

  return (
    // Top navigation bar used across all dashboard pages.
    <header className="db-topbar">
      <div className="db-top-left">
        {/* Sidebar expand/collapse button. */}
        <Button
          type="text"
          className="db-icon-btn db-hamburger-btn"
          icon={sidebarCollapsed ? <img src={CollapseIcon} alt="Collapse icon" className="db-icon-btn" /> : <img src={CollapseIcon} alt="Collapse icon" className="db-icon-btn" />}
          onClick={onToggleSidebar}
        />

        <div className={`db-search-wrap ${searchOpen ? 'open' : ''}`}>
          {/* Show/hide search input. */}
          <Button type="text" className="db-icon-btn db-search-toggle-btn" icon={<img src={SearchIcon} alt="Search icon" className="db-icon-btn" />} onClick={onToggleSearch} />
          {searchOpen && (
            <Input
              className="db-search-input"
              placeholder="Search projects, tasks or members..."
              allowClear
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          )}
        </div>
      </div>

      <div className="db-top-right">
        {/* Theme switch between dark and light style. */}
        <Button
          type="text"
          className="db-icon-btn"
          icon={darkTheme ? <img src={SunIcon} alt="Sun icon" className="db-theme-sun-icon" /> : <MoonOutlined />}
          onClick={onToggleTheme}
        />

        {/* Settings dropdown. */}
        <Dropdown menu={settingsMenu} trigger={['click']} placement="bottomRight">
          <Button type="text" className="db-icon-btn" 
          icon={<img src={HomeIcon} alt="Home icon" className="db-icon-btn" />} />
        </Dropdown>

        {/* Messages dropdown. */}
        <Dropdown menu={messageMenu} trigger={['click']} placement="bottomRight" classNames={{ root: 'db-rich-dropdown' }}>
          <Button type="text" className="db-icon-btn" icon={<img src={MessageIcon} alt="Message icon" className="db-icon-btn" />} />
        </Dropdown>

        {/* Notifications dropdown with count badge. */}
        <Dropdown menu={notificationMenu} trigger={['click']} placement="bottomRight" classNames={{ root: 'db-rich-dropdown' }}>
          <Badge count={9} size="small" color="#3f78f3" offset={[-5, 1]}>
            <Button type="text" className="db-icon-btn" icon={<img src={NotificationIcon} alt="Notification icon" className="db-icon-btn" />} />
          </Badge>
        </Dropdown>

        {/* Profile menu with logout action. */}
        <Dropdown menu={profileItems} trigger={['click']} placement="bottomRight">
          <button type="button" className="db-profile-trigger" aria-label="Profile menu">
            <span className="db-profile-dot" />
            <Avatar className="db-profile-avatar" size={36} src={ProfileAvatar} />
          </button>
        </Dropdown>
      </div>
    </header>
  )
}

export default DashboardHeader
