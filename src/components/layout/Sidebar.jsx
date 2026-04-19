import { NavLink } from 'react-router-dom';
import {
  RiBookOpenLine,
  RiCalendarLine,
  RiDashboardLine,
  RiRobot2Line,
  RiTaskLine,
} from 'react-icons/ri';
import { useMemo, useState } from 'react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: RiDashboardLine },
  { to: '/subjects', label: 'Subjects', Icon: RiBookOpenLine },
  { to: '/tasks', label: 'Tasks', Icon: RiTaskLine },
  { to: '/revision', label: 'Revision', Icon: RiCalendarLine },
  { to: '/ai-tools', label: 'AI Tools', Icon: RiRobot2Line },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const width = isCollapsed ? 64 : 240;

  const nav = useMemo(
    () =>
      NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'sidebar-link',
              isCollapsed ? 'sidebar-link--collapsed' : '',
              isActive ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <Icon className="sidebar-icon" aria-hidden="true" />
          {!isCollapsed ? <span className="sidebar-text">{label}</span> : null}
        </NavLink>
      )),
    [isCollapsed]
  );

  return (
    <aside className="sidebar" style={{ width }}>
      <div className="sidebar-top">
        <div className="sidebar-logo" title="StudBud">
          {!isCollapsed ? (
            <>
              <span className="sidebar-logoText">StudBud</span>
              <span className="sidebar-logoDot" aria-hidden="true">
                .
              </span>
            </>
          ) : (
            <span className="sidebar-logoDot" aria-hidden="true">
              .
            </span>
          )}
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setIsCollapsed((v) => !v)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {nav}
      </nav>

      <div className="sidebar-bottom">
        {!isCollapsed ? <span className="sidebar-version">v1.0</span> : null}
      </div>
    </aside>
  );
}
