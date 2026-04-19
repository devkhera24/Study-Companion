import useProgress from '../../hooks/useProgress.js';

const TONE = {
  gold: 'var(--accent-gold)',
  amber: 'var(--accent-gold)',
  sage: 'var(--accent-sage)',
  warning: 'var(--warning)',
};

export default function StatBlock({ label, icon, tone = 'gold', metricKey }) {
  const { totalTasks, completedTasks, pendingTasks, revisionTasks } = useProgress();

  const value =
    metricKey === 'completed'
      ? completedTasks
      : metricKey === 'pending'
        ? pendingTasks
        : metricKey === 'revision'
          ? revisionTasks
          : totalTasks;

  const color = TONE[tone] ?? TONE.gold;

  return (
    <div className="stat">
      <div className="stat-accent" style={{ background: color }} aria-hidden="true" />
      <div className="stat-body">
        <div className="stat-top">
          <div className="stat-label">{label}</div>
          <div className="stat-icon" style={{ color }} aria-hidden="true">
            {icon}
          </div>
        </div>
        <div className="stat-value" style={{ color }}>
          {value}
        </div>
      </div>
    </div>
  );
}
