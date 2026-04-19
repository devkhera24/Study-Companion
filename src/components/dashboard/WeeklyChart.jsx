import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

import useProgress from '../../hooks/useProgress.js';

function TooltipContent({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltipTitle">{format(new Date(p.date), 'EEEE')}</div>
      <div className="chart-tooltipRow">{p.count} completed</div>
    </div>
  );
}

export default function WeeklyChart() {
  const { weeklyData } = useProgress();

  const data = weeklyData.map((d) => ({
    ...d,
    day: format(new Date(d.date), 'EEE'),
  }));

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(245, 166, 35, 0.55)" />
              <stop offset="100%" stopColor="rgba(245, 166, 35, 0)" />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
          <Tooltip content={<TooltipContent />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--accent-gold)"
            strokeWidth={2}
            fill="url(#amberFill)"
            dot={{ r: 3, stroke: 'var(--accent-gold)', fill: 'var(--bg-secondary)' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
