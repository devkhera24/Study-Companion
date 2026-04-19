import { formatDistanceToNow } from 'date-fns';
import { RiDeleteBinLine, RiPencilLine } from 'react-icons/ri';

import Badge from '../ui/Badge.jsx';

const PRIORITY_TONE = {
  High: 'rgba(224, 92, 92, 0.85)',
  Medium: 'var(--accent-gold)',
  Low: 'rgba(107, 143, 113, 0.85)',
};

export default function TaskCard({ task, subjectName, topicName, isOverdue, onToggle, onEdit, onDelete }) {
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const deadlineText = deadline && !Number.isNaN(deadline.getTime()) ? formatDistanceToNow(deadline, { addSuffix: true }) : '';

  const priorityColor = PRIORITY_TONE[task.priority] ?? 'var(--accent-gold)';
  const completed = task.status === 'Completed';

  return (
    <div className={['task-card', isOverdue ? 'is-overdue' : '', completed ? 'is-completed' : ''].join(' ')}>
      <div className="task-priorityBar" style={{ background: priorityColor }} aria-hidden="true" />

      <label className="task-check" aria-label="Mark complete">
        <input type="checkbox" checked={completed} onChange={() => onToggle?.(task)} />
        <span className="task-checkBox" aria-hidden="true" />
      </label>

      <div className="task-main">
        <div className={['task-title', completed ? 'is-struck' : ''].join(' ')}>{task.title}</div>
        <div className="task-sub">
          <span>{subjectName ?? 'Unknown Subject'}</span>
          <span className="task-dot" aria-hidden="true">
            •
          </span>
          <span>{topicName ?? 'Unknown Topic'}</span>
        </div>
      </div>

      <div className="task-right">
        <div className="task-deadline">{deadlineText}</div>
        <div className="task-badges">
          <Badge label={task.priority} variant="priority" />
          <Badge label={task.status} variant="status" />
        </div>
      </div>

      <div className="task-actions" aria-label="Task actions">
        <button type="button" className="icon-btn" onClick={() => onEdit?.(task)} aria-label="Edit task">
          <RiPencilLine />
        </button>
        <button type="button" className="icon-btn danger" onClick={() => onDelete?.(task)} aria-label="Delete task">
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  );
}
