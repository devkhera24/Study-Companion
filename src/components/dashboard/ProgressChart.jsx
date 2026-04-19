import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import useProgress from '../../hooks/useProgress.js';

function TooltipContent({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltipTitle">{item.subjectName}</div>
      <div className="chart-tooltipRow">{item.rate}% complete</div>
    </div>
  );
}

export default function ProgressChart() {
  const { subjectProgress } = useProgress();

  const data = subjectProgress.map((s) => ({
    ...s,
    value: s.rate,
    name: s.subjectName,
  }));

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Tooltip content={<TooltipContent />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={96}
            paddingAngle={2}
            stroke="rgba(0,0,0,0)"
          >
            {data.map((entry) => (
              <Cell key={entry.subjectId} fill={entry.color ?? 'var(--accent-gold)'} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: 'var(--text-secondary)', fontSize: 12 }}
            formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
