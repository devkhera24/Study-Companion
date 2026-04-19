import { useCallback, useEffect, useMemo, useState } from 'react';
import { RiCalendarLine, RiCheckboxCircleLine, RiFileListLine, RiTimeLine } from 'react-icons/ri';

import StatBlock from '../components/dashboard/StatBlock.jsx';
import ProgressChart from '../components/dashboard/ProgressChart.jsx';
import WeeklyChart from '../components/dashboard/WeeklyChart.jsx';
import RevisionReminder from '../components/dashboard/RevisionReminder.jsx';
import Button from '../components/ui/Button.jsx';

const FALLBACK_QUOTE = {
  content: 'Small disciplines repeated with consistency lead to remarkable results.',
  author: 'Study Companion',
};

export default function Dashboard() {
  const [quote, setQuote] = useState(FALLBACK_QUOTE);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  const loadQuote = useCallback(async () => {
    setIsQuoteLoading(true);
    try {
      const res = await fetch('https://api.quotable.io/random?tags=education,inspirational');
      if (!res.ok) throw new Error('Quote request failed');
      const data = await res.json();
      if (data?.content) {
        setQuote({ content: data.content, author: data.author ?? 'Unknown' });
      } else {
        setQuote(FALLBACK_QUOTE);
      }
    } catch {
      setQuote(FALLBACK_QUOTE);
    } finally {
      setIsQuoteLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const stats = useMemo(
    () => [
      { label: 'Total Tasks', icon: <RiFileListLine />, tone: 'gold', key: 'total' },
      { label: 'Completed', icon: <RiCheckboxCircleLine />, tone: 'sage', key: 'completed' },
      { label: 'Pending', icon: <RiTimeLine />, tone: 'amber', key: 'pending' },
      { label: 'Revision Due', icon: <RiCalendarLine />, tone: 'warning', key: 'revision' },
    ],
    []
  );

  return (
    <div className="dash">
      <section className="dash-stats" aria-label="Stats">
        {stats.map((s) => (
          <StatBlock key={s.key} label={s.label} icon={s.icon} tone={s.tone} metricKey={s.key} />
        ))}
      </section>

      <section className="dash-charts" aria-label="Charts">
        <div className="dash-card">
          <div className="dash-cardHeader">
            <div className="dash-cardTitle">Subject Progress</div>
            <div className="dash-cardSub">Completion rates by subject</div>
          </div>
          <ProgressChart />
        </div>

        <div className="dash-card">
          <div className="dash-cardHeader">
            <div className="dash-cardTitle">Weekly Productivity</div>
            <div className="dash-cardSub">Tasks completed in the last 7 days</div>
          </div>
          <WeeklyChart />
        </div>
      </section>

      <section className="dash-revision" aria-label="Upcoming revisions">
        <div className="dash-sectionHeader">
          <h2 className="dash-sectionTitle">Upcoming Revisions</h2>
        </div>
        <RevisionReminder />
      </section>

      <section className="dash-quote" aria-label="Motivational quote">
        <div className="dash-card dash-quoteCard">
          <div className="dash-quoteHeader">
            <div className="dash-cardTitle">Motivation</div>
            <Button variant="ghost" size="sm" onClick={loadQuote} isLoading={isQuoteLoading}>
              Refresh
            </Button>
          </div>

          <blockquote className="dash-quoteText">“{quote.content}”</blockquote>
          <div className="dash-quoteAuthor">— {quote.author}</div>
        </div>
      </section>
    </div>
  );
}

