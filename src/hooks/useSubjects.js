import { useMemo } from 'react';

import { useStudyContext } from '../context/StudyContext.jsx';

export default function useSubjects() {
  const {
    subjects,
    topics,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
  } = useStudyContext();

  const api = useMemo(() => {
    const getTopicsForSubject = (subjectId) => topics.filter((t) => t.subjectId === subjectId);

    return {
      subjects,
      topics,
      addSubject,
      updateSubject,
      deleteSubject,
      addTopic,
      updateTopic,
      deleteTopic,
      getTopicsForSubject,
    };
  }, [subjects, topics, addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic]);

  return api;
}
