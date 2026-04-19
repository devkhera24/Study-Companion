import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'study_companion_v1';

const SEED_SUBJECTS = [
  { id: 's1', name: 'Data Structures', description: 'Core CS fundamentals', color: '#F5A623' },
  { id: 's2', name: 'Algorithms', description: 'Sorting, searching, graph algorithms', color: '#6B8F71' },
  { id: 's3', name: 'Mathematics', description: 'Calculus, linear algebra, discrete math', color: '#7B9CCC' },
];

const SEED_TOPICS = [
  {
    id: 't1',
    subjectId: 's1',
    name: 'Binary Trees',
    difficulty: 'Medium',
    status: 'Completed',
    notes: 'Cover traversals: inorder, preorder, postorder.',
  },
  {
    id: 't2',
    subjectId: 's1',
    name: 'Graph Algorithms',
    difficulty: 'Hard',
    status: 'In Progress',
    notes: 'BFS, DFS, Dijkstra',
  },
  { id: 't3', subjectId: 's2', name: 'Dynamic Programming', difficulty: 'Hard', status: 'Not Started', notes: '' },
  {
    id: 't4',
    subjectId: 's2',
    name: 'Sorting Algorithms',
    difficulty: 'Easy',
    status: 'Needs Revision',
    notes: 'Quick sort pivot selection edge cases',
  },
];

const SEED_TASKS = [
  {
    id: 'task1',
    title: 'Solve 10 binary tree problems',
    subject: 's1',
    topic: 't1',
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 'task2',
    title: 'Revise graph algorithms notes',
    subject: 's1',
    topic: 't2',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 'task3',
    title: 'Complete DP chapter exercises',
    subject: 's2',
    topic: 't3',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 'task4',
    title: 'Practice sorting problems',
    subject: 's2',
    topic: 't4',
    deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    priority: 'Low',
    status: 'Completed',
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

function safeParseJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function defaultState() {
  return {
    subjects: SEED_SUBJECTS,
    topics: SEED_TOPICS,
    tasks: SEED_TASKS,
    revisionSchedule: [],
  };
}

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const [subjects, setSubjects] = useState(SEED_SUBJECTS);
  const [topics, setTopics] = useState(SEED_TOPICS);
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [revisionSchedule, setRevisionSchedule] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParseJSON(raw) : null;
    if (!parsed) {
      setHydrated(true);
      return;
    }

    setSubjects(Array.isArray(parsed.subjects) ? parsed.subjects : SEED_SUBJECTS);
    setTopics(Array.isArray(parsed.topics) ? parsed.topics : SEED_TOPICS);
    setTasks(Array.isArray(parsed.tasks) ? parsed.tasks : SEED_TASKS);
    setRevisionSchedule(Array.isArray(parsed.revisionSchedule) ? parsed.revisionSchedule : []);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const next = { subjects, topics, tasks, revisionSchedule };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [hydrated, subjects, topics, tasks, revisionSchedule]);

  const addSubject = useCallback((subject) => {
    const next = {
      id: createId('s'),
      name: subject?.name ?? 'Untitled Subject',
      description: subject?.description ?? '',
      color: subject?.color ?? '#F5A623',
    };
    setSubjects((prev) => [next, ...prev]);
    return next;
  }, []);

  const updateSubject = useCallback((id, data) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }, []);

  const deleteSubject = useCallback((id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTopics((prev) => prev.filter((t) => t.subjectId !== id));
    setTasks((prev) => prev.filter((t) => t.subject !== id));
  }, []);

  const addTopic = useCallback((topic) => {
    const next = {
      id: createId('t'),
      subjectId: topic?.subjectId,
      name: topic?.name ?? 'Untitled Topic',
      difficulty: topic?.difficulty ?? 'Medium',
      status: topic?.status ?? 'Not Started',
      notes: topic?.notes ?? '',
    };
    setTopics((prev) => [next, ...prev]);
    return next;
  }, []);

  const updateTopic = useCallback((id, data) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const deleteTopic = useCallback((id) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    setTasks((prev) => prev.filter((t) => t.topic !== id));
    setRevisionSchedule((prev) => prev.filter((r) => r.topicId !== id));
  }, []);

  const addTask = useCallback((task) => {
    const next = {
      id: createId('task'),
      title: task?.title ?? 'Untitled Task',
      subject: task?.subject,
      topic: task?.topic,
      deadline: task?.deadline ?? new Date().toISOString(),
      priority: task?.priority ?? 'Medium',
      status: task?.status ?? 'Pending',
      completedAt: task?.status === 'Completed' ? new Date().toISOString() : task?.completedAt,
    };
    setTasks((prev) => [next, ...prev]);
    return next;
  }, []);

  const updateTask = useCallback((id, data) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, ...data };
        if (data?.status === 'Completed' && !t.completedAt) next.completedAt = new Date().toISOString();
        if (data?.status !== 'Completed') delete next.completedAt;
        return next;
      })
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isCompleted = t.status === 'Completed';
        if (isCompleted) {
          const next = { ...t, status: 'Pending' };
          delete next.completedAt;
          return next;
        }
        return { ...t, status: 'Completed', completedAt: new Date().toISOString() };
      })
    );
  }, []);

  const addRevision = useCallback((entry) => {
    const next = {
      id: createId('rev'),
      topicId: entry?.topicId,
      subjectId: entry?.subjectId,
      scheduledFor: entry?.scheduledFor ?? new Date().toISOString(),
      notes: entry?.notes ?? '',
      status: entry?.status ?? 'Pending',
      createdAt: new Date().toISOString(),
    };
    setRevisionSchedule((prev) => [next, ...prev]);
    return next;
  }, []);

  const updateRevision = useCallback((id, data) => {
    setRevisionSchedule((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  const deleteRevision = useCallback((id) => {
    setRevisionSchedule((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      subjects,
      topics,
      tasks,
      revisionSchedule,
      addSubject,
      updateSubject,
      deleteSubject,
      addTopic,
      updateTopic,
      deleteTopic,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addRevision,
      updateRevision,
      deleteRevision,
      __storageKey: STORAGE_KEY,
      __defaultState: defaultState,
    }),
    [
      subjects,
      topics,
      tasks,
      revisionSchedule,
      addSubject,
      updateSubject,
      deleteSubject,
      addTopic,
      updateTopic,
      deleteTopic,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addRevision,
      updateRevision,
      deleteRevision,
    ]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudyContext() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudyContext must be used within a StudyProvider');
  return ctx;
}

