import Button from '../ui/Button.jsx';

const PRIORITIES = ['Low', 'Medium', 'High'];

export default function TaskFilters({ subjects, filters, onChange, onClear }) {
  const subjectId = filters.subjectId;
  const priorities = filters.priorities;

  return (
    <div className="task-filters" aria-label="Task filters">
      <div className="task-filter">
        <label className="task-filterLabel" htmlFor="filter-subject">
          Subject
        </label>
        <select
          id="filter-subject"
          className="task-filterSelect"
          value={subjectId}
          onChange={(e) => onChange?.({ ...filters, subjectId: e.target.value })}
        >
          <option value="all">All</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="task-filter">
        <div className="task-filterLabel">Priority</div>
        <div className="task-priorityPills" role="group" aria-label="Priority filter">
          {PRIORITIES.map((p) => {
            const active = priorities.includes(p);
            return (
              <button
                key={p}
                type="button"
                className={['task-pill', active ? 'is-active' : ''].join(' ')}
                onClick={() => {
                  const next = active ? priorities.filter((x) => x !== p) : [...priorities, p];
                  onChange?.({ ...filters, priorities: next });
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="task-filter">
        <label className="task-filterLabel" htmlFor="filter-deadline">
          Deadline
        </label>
        <select
          id="filter-deadline"
          className="task-filterSelect"
          value={filters.deadlineRange}
          onChange={(e) => onChange?.({ ...filters, deadlineRange: e.target.value })}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="task-filter">
        <label className="task-filterLabel" htmlFor="filter-sort">
          Sort
        </label>
        <select
          id="filter-sort"
          className="task-filterSelect"
          value={filters.sortBy}
          onChange={(e) => onChange?.({ ...filters, sortBy: e.target.value })}
        >
          <option value="due">Due Date</option>
          <option value="priority">Priority</option>
          <option value="subject">Subject Name</option>
        </select>
      </div>

      <div className="task-filter task-filter--clear">
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
