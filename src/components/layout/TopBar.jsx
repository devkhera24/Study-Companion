import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import SearchBar from '../SearchBar.jsx';

const TITLE_BY_PATH = {
  '/dashboard': 'Dashboard',
  '/subjects': 'Subjects',
  '/tasks': 'Tasks',
  '/revision': 'Revision Planner',
  '/ai-tools': 'AI Tools',
};

export default function TopBar() {
  const location = useLocation();
  const [query, setQuery] = useState('');

  const title = useMemo(() => TITLE_BY_PATH[location.pathname] ?? 'Study Companion', [location.pathname]);
  const today = useMemo(() => format(new Date(), 'EEEE, dd MMM'), []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-center">
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search tasks, subjects, topics…" />
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>
        <span className="topbar-divider" aria-hidden="true" />
        <div className="topbar-avatar" aria-label="User">
          ST
        </div>
      </div>
    </header>
  );
}
