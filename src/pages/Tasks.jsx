import { endOfMonth, endOfWeek, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';

import SearchBar from '../components/SearchBar.jsx';
import TaskCard from '../components/tasks/TaskCard.jsx';
import TaskFilters from '../components/tasks/TaskFilters.jsx';
import TaskModal from '../components/tasks/TaskModal.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useSubjects from '../hooks/useSubjects.js';
import useTasks from '../hooks/useTasks.js';

function priorityRank(p) {
  return p === 'High' ? 0 : p === 'Medium' ? 1 : 2;
}

function safeDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { subjects, topics } = useSubjects();

  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const [filters, setFilters] = useState({
    subjectId: 'all',
    priorities: [],
    deadlineRange: 'all',
    sortBy: 'due',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const subjectById = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);
  const topicById = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  const now = useMemo(() => new Date(), []);
  const today = useMemo(() => startOfDay(new Date()), []);

  const baseFiltered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    const withinDeadlineRange = (t) => {
      const d = safeDate(t.deadline);
      if (!d) return filters.deadlineRange === 'all';
      if (filters.deadlineRange === 'all') return true;

      if (filters.deadlineRange === 'today') return isSameDay(d, today);

      if (filters.deadlineRange === 'week') {
        const end = endOfWeek(today);
        return (isAfter(d, new Date(today.getTime() - 1)) || isSameDay(d, today)) && (isBefore(d, end) || isSameDay(d, end));
      }

      if (filters.deadlineRange === 'month') {
        const end = endOfMonth(today);
        return (isAfter(d, new Date(today.getTime() - 1)) || isSameDay(d, today)) && (isBefore(d, end) || isSameDay(d, end));
      }

      return true;
    };

    const matches = tasks
      .filter((t) => (filters.subjectId === 'all' ? true : t.subject === filters.subjectId))
      .filter((t) => (filters.priorities.length ? filters.priorities.includes(t.priority) : true))
      .filter(withinDeadlineRange)
      .filter((t) => {
        if (!q) return true;
        const subj = subjectById.get(t.subject)?.name ?? '';
        const top = topicById.get(t.topic)?.name ?? '';
        const hay = `${t.title ?? ''} ${subj} ${top}`.toLowerCase();
        return hay.includes(q);
      });

    const sorted = [...matches].sort((a, b) => {
      if (filters.sortBy === 'priority') {
        return priorityRank(a.priority) - priorityRank(b.priority);
      }

      if (filters.sortBy === 'subject') {
        const as = subjectById.get(a.subject)?.name ?? '';
        const bs = subjectById.get(b.subject)?.name ?? '';
        return as.localeCompare(bs);
      }

      const da = safeDate(a.deadline)?.getTime() ?? Number.POSITIVE_INFINITY;
      const db = safeDate(b.deadline)?.getTime() ?? Number.POSITIVE_INFINITY;
      return da - db;
    });

    return sorted;
  }, [debouncedQuery, filters, subjectById, tasks, today, topicById]);

  const revisionTopicIds = useMemo(
    () => new Set(topics.filter((t) => t.status === 'Needs Revision').map((t) => t.id)),
    [topics]
  );

  const tabCounts = useMemo(() => {
    const counts = { all: 0, pending: 0, completed: 0, overdue: 0, revision: 0 };
    baseFiltered.forEach((t) => {
      counts.all += 1;

      const d = safeDate(t.deadline);
      const overdue = t.status === 'Pending' && d && d.getTime() < now.getTime();
      const revision = Boolean(t.topic) && revisionTopicIds.has(t.topic);

      if (t.status === 'Pending' && !overdue) counts.pending += 1;
      if (t.status === 'Completed') counts.completed += 1;
      if (overdue) counts.overdue += 1;
      if (revision) counts.revision += 1;
    });
    return counts;
  }, [baseFiltered, now, revisionTopicIds]);

  const visible = useMemo(() => {
    if (activeTab === 'all') return baseFiltered;

    return baseFiltered.filter((t) => {
      const d = safeDate(t.deadline);
      const overdue = t.status === 'Pending' && d && d.getTime() < now.getTime();
      const revision = Boolean(t.topic) && revisionTopicIds.has(t.topic);

      if (activeTab === 'pending') return t.status === 'Pending' && !overdue;
      if (activeTab === 'completed') return t.status === 'Completed';
      if (activeTab === 'overdue') return overdue;
      if (activeTab === 'revision') return revision;
      return true;
    });
  }, [activeTab, baseFiltered, now, revisionTopicIds]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({ subjectId: 'all', priorities: [], deadlineRange: 'all', sortBy: 'due' });
    setQuery('');
    setActiveTab('all');
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'revision', label: 'Revision' },
  ];

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <Button onClick={openAdd}>Add Task</Button>
      </div>

      <div className="tasks-searchRow">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search tasks, subjects, topics…"
          meta={`${baseFiltered.length} results`}
        />
      </div>

      <TaskFilters
        subjects={subjects}
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ subjectId: 'all', priorities: [], deadlineRange: 'all', sortBy: 'due' })}
      />

      <div className="task-tabs" role="tablist" aria-label="Task tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={['task-tab', activeTab === t.id ? 'is-active' : ''].join(' ')}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.label}</span>
            <span className="task-tabCount">{tabCounts[t.id]}</span>
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="task-list" aria-label="Task list">
          {visible.map((t) => {
            const subjName = subjectById.get(t.subject)?.name;
            const topName = topicById.get(t.topic)?.name;
            const d = safeDate(t.deadline);
            const overdue = t.status === 'Pending' && d && d.getTime() < now.getTime();

            return (
              <TaskCard
                key={t.id}
                task={t}
                subjectName={subjName}
                topicName={topName}
                isOverdue={overdue}
                onToggle={() => toggleTaskStatus(t.id)}
                onEdit={() => openEdit(t)}
                onDelete={() => deleteTask(t.id)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No tasks found"
          description="Try changing tabs, clearing filters, or creating a new task."
          actionLabel="Clear"
          onAction={clearFilters}
        />
      )}

      <TaskModal
        isOpen={modalOpen}
        initialValues={editing}
        subjects={subjects}
        topics={topics}
        onClose={() => setModalOpen(false)}
        onSubmit={async (payload) => {
          if (editing?.id) {
            updateTask(editing.id, payload);
          } else {
            addTask(payload);
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
}
