import { useMemo } from 'react';

import { useStudyContext } from '../context/StudyContext.jsx';

export default function useTasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useStudyContext();

  const api = useMemo(() => {
    const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

    const getOverdueTasks = (now = new Date()) =>
      tasks.filter((t) => {
        if (t.status !== 'Pending') return false;
        const deadline = t.deadline ? new Date(t.deadline) : null;
        if (!deadline || Number.isNaN(deadline.getTime())) return false;
        return deadline.getTime() < now.getTime();
      });

    return { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, getTasksByStatus, getOverdueTasks };
  }, [tasks, addTask, updateTask, deleteTask, toggleTaskStatus]);

  return api;
}
