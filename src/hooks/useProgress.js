import { useMemo } from 'react';

import { useStudyContext } from '../context/StudyContext.jsx';

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function useProgress() {
  const { subjects, topics, tasks } = useStudyContext();

  return useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

    const revisionTasks = tasks.filter((t) => {
      if (!t.topic) return false;
      const topic = topics.find((tp) => tp.id === t.topic);
      return topic?.status === 'Needs Revision';
    }).length;

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const subjectProgress = subjects.map((s) => {
      const subjectTasks = tasks.filter((t) => t.subject === s.id);
      const subjectTotal = subjectTasks.length;
      const subjectCompleted = subjectTasks.filter((t) => t.status === 'Completed').length;
      const rate = subjectTotal === 0 ? 0 : Math.round((subjectCompleted / subjectTotal) * 100);
      return {
        subjectId: s.id,
        subjectName: s.name,
        color: s.color,
        total: subjectTotal,
        completed: subjectCompleted,
        rate,
      };
    });

    const today = startOfDay(new Date());
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(today);
      day.setDate(day.getDate() - (6 - i));
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const count = tasks.filter((t) => {
        if (t.status !== 'Completed') return false;
        if (!t.completedAt) return false;
        const completedAt = new Date(t.completedAt);
        if (Number.isNaN(completedAt.getTime())) return false;
        return completedAt >= dayStart && completedAt < dayEnd;
      }).length;

      return {
        date: dayStart.toISOString(),
        count,
      };
    });

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      revisionTasks,
      completionRate,
      subjectProgress,
      weeklyData,
    };
  }, [subjects, topics, tasks]);
}
