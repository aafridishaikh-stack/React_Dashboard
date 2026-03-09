import { useMemo, useState } from 'react'
import { Avatar, Badge } from 'antd'
import ProfileAvatar from '../../assets/profile.png'
import ProfileFilterIcon from '../../assets/filter.svg'
import SidebarArrowClosed from '../../assets/sidebar-arrow-closed.svg'
import SidebarArrowOpen from '../../assets/sidebar-arrow-open.svg'
import { sideSections } from './menuConfig'

// Returns path of parent slugs for a target item in nested menu tree.
const getPathToSlug = (items, target, trail = []) => {
  for (const item of items) {
    const nextTrail = [...trail, item.slug]
    if (item.slug === target) return nextTrail
    if (item.children?.length) {
      const path = getPathToSlug(item.children, target, nextTrail)
      if (path.length) return path
    }
  }
  return []
}

// For expandable groups, choose the first visible leaf page as default selection.
const getFirstLeafSlug = (item) => {
  if (!item.children?.length) return item.slug
  return getFirstLeafSlug(item.children[0])
}

function DashboardSidebar({ activeMenu = 'dashboard', onMenuChange = () => {} }) {
  // Manual open/close state for expandable groups.
  const [openGroups, setOpenGroups] = useState({})
  // Groups that should auto-open because they are ancestors of active item.
  const activeAncestorPath = useMemo(
    () => sideSections.flatMap((section) => getPathToSlug(section.items, activeMenu)),
    [activeMenu],
  )

  // Toggle group open/closed while respecting default auto-open behavior.
  const toggleGroup = (slug) => {
    setOpenGroups((prev) => {
      const currentlyOpen = prev[slug] ?? activeAncestorPath.includes(slug)
      return { ...prev, [slug]: !currentlyOpen }
    })
  }

  const handleItemSelect = (item) => {
    if (item.children?.length) {
      setOpenGroups((prev) => ({ ...prev, [item.slug]: true }))
      onMenuChange(getFirstLeafSlug(item))
      return
    }

    onMenuChange(item.slug)
  }

  // Recursive renderer for sidebar tree.
  const renderItems = (items, level = 0) => (
    <div className={`db-submenu level-${level}`}>
      {items.map((item) => {
        const isActive = activeAncestorPath.includes(item.slug)
        const isOpen = openGroups[item.slug] ?? activeAncestorPath.includes(item.slug)
        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon

        return (
          <div key={item.slug} className="db-nav-block">
            <div
              className={`db-nav-item ${isActive ? 'active' : ''} ${level > 0 ? 'sub-level' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => handleItemSelect(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleItemSelect(item)
                }
              }}
            >
              <span className="db-nav-label">
                {/* Root level items show icon, nested items are text only. */}
                {level === 0 && Icon ? (
                  <span className="db-nav-icon-wrap">
                    {typeof Icon === 'string' ? (
                      <img src={Icon} alt="" aria-hidden="true" className="db-nav-icon-image" />
                    ) : (
                      <Icon className="db-nav-icon" />
                    )}
                  </span>
                ) : null}
                {item.label}
              </span>

              <span className="db-nav-end">
                {/* Optional small badge number. */}
                {item.badge ? (
                  <Badge count={item.badge} size="small" color="#3d76f3" className="db-ant-badge" />
                ) : null}
                {/* Expand/collapse arrow for groups with children. */}
                {item.children?.length ? (
                  <button
                    className="db-nav-arrow-btn"
                    type="button"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      toggleGroup(item.slug)
                    }}
                  >
                    <img
                      src={isOpen ? SidebarArrowOpen : SidebarArrowClosed}
                      alt=""
                      aria-hidden="true"
                      className="db-nav-arrow"
                    />
                  </button>
                ) : null}
              </span>
            </div>

            {item.children?.length && isOpen ? renderItems(item.children, level + 1) : null}
          </div>
        )
      })}
    </div>
  )

  return (
    // Left sidebar with user card + grouped navigation.
    <aside className="db-sidebar">
      <div className="db-sidebar-top">
        <h1 className="db-logo">Logo</h1>

        <div className="db-user-card">
          <div className="db-user-avatar-wrap">
            <Avatar className="db-ant-avatar" size={46} src={ProfileAvatar} />
            <span className="db-user-online-dot" />
          </div>
          <div className="db-user-copy">
            <p className="db-user-name">John Smith</p>
            <p className="db-user-role">Administrator</p>
          </div>
          <button type="button" className="db-user-action-btn" aria-label="User quick actions">
            <img src={ProfileFilterIcon} alt="" aria-hidden="true" className="db-user-action-icon" />
          </button>
        </div>
      </div>

      <div className="db-sidebar-nav">
        {sideSections.map((section) => (
          <section key={section.title} className="db-nav-group">
            <h2>{section.title}</h2>
            {renderItems(section.items)}
          </section>
        ))}
      </div>
    </aside>
  )
}

export default DashboardSidebar
