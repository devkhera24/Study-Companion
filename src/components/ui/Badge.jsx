const STATUS_COLORS = {
  Completed: 'success',
  'In Progress': 'amber',
  'Not Started': 'muted',
  'Needs Revision': 'warning',
};

const PRIORITY_COLORS = {
  High: 'danger',
  Medium: 'amber',
  Low: 'sage',
};

const DIFFICULTY_COLORS = {
  Hard: 'danger',
  Medium: 'amber',
  Easy: 'success',
};

export default function Badge({ label, variant = 'status' }) {
  const map =
    variant === 'priority' ? PRIORITY_COLORS : variant === 'difficulty' ? DIFFICULTY_COLORS : STATUS_COLORS;
  const tone = map[label] ?? 'muted';
  const classes = ['ui-badge', `ui-badge--${tone}`].join(' ');

  return <span className={classes}>{label}</span>;
}
