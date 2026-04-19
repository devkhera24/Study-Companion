import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useMemo, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiHistoryLine } from 'react-icons/ri';

import RescheduleRevisionModal from '../components/revision/RescheduleRevisionModal.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useStudyContext } from '../context/StudyContext.jsx';

function safeDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function dayKey(date) {
  return format(date, 'yyyy-MM-dd');
}

export default function Revision() {
  const { revisionSchedule, topics, subjects, updateRevision, deleteRevision, updateTopic } = useStudyContext();

  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursorMonth, setCursorMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()));
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const topicById = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);
  const subjectById = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const pending = useMemo(() => {
    const items = revisionSchedule
      .filter((r) => (r.status ?? 'Pending') === 'Pending')
      .map((r) => ({ ...r, __date: safeDate(r.scheduledFor) }))
      .filter((r) => Boolean(r.__date));
    items.sort((a, b) => a.__date.getTime() - b.__date.getTime());
    return items;
  }, [revisionSchedule]);

  const overdue = useMemo(() => {
    return pending.filter((r) => isBefore(startOfDay(r.__date), today));
  }, [pending, today]);

  const countsByDay = useMemo(() => {
    const map = new Map();
    pending.forEach((r) => {
      const key = dayKey(startOfDay(r.__date));
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [pending]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursorMonth));
    const end = endOfWeek(endOfMonth(cursorMonth));
    const days = [];
    for (let d = start; !isAfter(d, end); d = addDays(d, 1)) {
      days.push(d);
    }
    return days;
  }, [cursorMonth]);

  const selectedRevisions = useMemo(() => {
    const list = pending.filter((r) => isSameDay(r.__date, selectedDay));
    list.sort((a, b) => a.__date.getTime() - b.__date.getTime());
    return list;
  }, [pending, selectedDay]);

  const monthLabel = useMemo(() => format(cursorMonth, 'MMMM yyyy'), [cursorMonth]);

  const jumpTo = (date) => {
    setCursorMonth(startOfMonth(date));
    setSelectedDay(startOfDay(date));
  };

  return (
    <div className="revision-page">
      <div className="page-header">
        <h1 className="page-title">Revision Planner</h1>
        <div className="revp-headerActions">
          <Button
            variant="ghost"
            onClick={() => {
              jumpTo(new Date());
            }}
          >
            Today
          </Button>
        </div>
      </div>

      {overdue.length ? (
        <div className="revp-overdue" role="status" aria-label="Overdue revisions">
          <div className="revp-overdueLeft">
            <span className="revp-overdueIcon" aria-hidden="true">
              <RiHistoryLine />
            </span>
            <div className="revp-overdueText">
              <div className="revp-overdueTitle">{overdue.length} revision{overdue.length === 1 ? '' : 's'} overdue</div>
              <div className="revp-overdueSub">Catch up or reschedule to stay on track.</div>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const oldest = overdue[0].__date;
              jumpTo(oldest);
            }}
          >
            Go to oldest
          </Button>
        </div>
      ) : null}

      <div className="revp-grid">
        <section className="revp-card" aria-label="Calendar">
          <div className="revp-cardHeader">
            <div className="revp-monthNav">
              <button
                type="button"
                className="revp-navBtn"
                onClick={() => setCursorMonth((m) => subMonths(m, 1))}
                aria-label="Previous month"
              >
                <RiArrowLeftSLine />
              </button>
              <div className="revp-monthLabel">{monthLabel}</div>
              <button
                type="button"
                className="revp-navBtn"
                onClick={() => setCursorMonth((m) => addMonths(m, 1))}
                aria-label="Next month"
              >
                <RiArrowRightSLine />
              </button>
            </div>
          </div>

          <div className="revp-weekdays" aria-hidden="true">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="revp-weekday">
                {d}
              </div>
            ))}
          </div>

          <div className="revp-calendar" role="grid" aria-label="Month view">
            {calendarDays.map((d) => {
              const inMonth = isSameMonth(d, cursorMonth);
              const isSelected = isSameDay(d, selectedDay);
              const isToday = isSameDay(d, today);
              const count = countsByDay.get(dayKey(d)) ?? 0;

              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  className={['revp-day', inMonth ? '' : 'is-outside', isSelected ? 'is-selected' : '', isToday ? 'is-today' : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedDay(startOfDay(d))}
                  role="gridcell"
                  aria-label={`${format(d, 'PPP')}${count ? `, ${count} revision${count === 1 ? '' : 's'}` : ''}`}
                >
                  <span className="revp-dayNum">{format(d, 'd')}</span>
                  {count ? <span className="revp-dayCount">{count}</span> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="revp-card" aria-label="Revisions">
          <div className="revp-cardHeader">
            <div>
              <div className="revp-listTitle">{format(selectedDay, 'EEEE, dd MMM')}</div>
              <div className="revp-listSub">{selectedRevisions.length} scheduled</div>
            </div>
          </div>

          {selectedRevisions.length ? (
            <div className="revp-list">
              {selectedRevisions.map((r) => {
                const topic = r.topicId ? topicById.get(r.topicId) : null;
                const subject = subjectById.get(r.subjectId ?? topic?.subjectId);
                const isOverdue = isBefore(startOfDay(r.__date), today);

                return (
                  <div key={r.id} className={['revp-item', isOverdue ? 'is-overdue' : ''].filter(Boolean).join(' ')}>
                    <div className="revp-itemMain">
                      <div className="revp-itemTitle">{topic?.name ?? 'Unknown Topic'}</div>
                      <div className="revp-itemMeta">
                        {subject?.name ? <Badge variant="status" label={subject.name} /> : null}
                        {isOverdue ? <Badge label="Overdue" /> : null}
                      </div>
                      {r.notes ? <div className="revp-itemNotes">{r.notes}</div> : null}
                    </div>

                    <div className="revp-itemActions">
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
                      <Button size="sm" variant="ghost" onClick={() => setRescheduleTarget(r)}>
                        Reschedule
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => deleteRevision(r.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No revisions scheduled"
              description="Select a day with revisions, or complete topics to automatically schedule sessions."
            />
          )}
        </section>
      </div>

      <RescheduleRevisionModal
        isOpen={Boolean(rescheduleTarget)}
        revision={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onSubmit={(nextDate) => {
          if (!rescheduleTarget) return;
          updateRevision(rescheduleTarget.id, { scheduledFor: startOfDay(nextDate).toISOString() });
          setRescheduleTarget(null);
        }}
      />
    </div>
  );
}
