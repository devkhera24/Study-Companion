import { differenceInCalendarDays } from 'date-fns';
import { useMemo } from 'react';

import { useStudyContext } from '../../context/StudyContext.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function RevisionReminder() {
  const { revisionSchedule, topics, subjects, deleteRevision, updateTopic } = useStudyContext();

  const upcoming = useMemo(() => {
    const pending = revisionSchedule
      .filter((r) => (r.status ?? 'Pending') === 'Pending')
      .filter((r) => r.scheduledFor);
    pending.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
    return pending.slice(0, 8);
  }, [revisionSchedule]);

  if (!upcoming.length) {
    return (
      <EmptyState
        title="No revisions scheduled"
        description="When you complete topics or mark them as needing revision, sessions will appear here."
      />
    );
  }

  return (
    <div className="rev-list">
      {upcoming.map((r) => {
        const topic = topics.find((t) => t.id === r.topicId);
        const subject = subjects.find((s) => s.id === (r.subjectId ?? topic?.subjectId));
        const days = r.scheduledFor ? differenceInCalendarDays(new Date(r.scheduledFor), new Date()) : null;
        const when =
          days == null
            ? 'Unknown'
            : days === 0
              ? 'Today'
              : days === 1
                ? 'Tomorrow'
                : days > 1
                  ? `In ${days} days`
                  : `${Math.abs(days)} days overdue`;

        return (
          <div className="rev-item" key={r.id}>
            <div className="rev-main">
              <div className="rev-title">{topic?.name ?? 'Unknown Topic'}</div>
              <div className="rev-meta">
                {subject?.name ? <Badge variant="status" label={subject.name} /> : null}
                <span className="rev-when">{when}</span>
              </div>
            </div>
            <div className="rev-actions">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (r.topicId) updateTopic(r.topicId, { status: 'Completed' });
                  deleteRevision(r.id);
                }}
              >
                Mark Revised
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
