import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { startOfDay } from 'date-fns';

import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

function buildSchema({ isEditing }) {
  return yup.object({
    title: yup.string().required('Task title is required').min(2, 'Task title must be at least 2 characters'),
    subject: yup.string().required('Subject is required'),
    topic: yup.string().required('Topic is required'),
    deadline: yup
      .string()
      .required('Deadline is required')
      .test('not-in-past', 'Deadline cannot be in the past', (value) => {
        if (isEditing) return true;
        if (!value) return false;
        const picked = startOfDay(new Date(`${value}T12:00:00`));
        const today = startOfDay(new Date());
        return picked.getTime() >= today.getTime();
      }),
    priority: yup.string().oneOf(['Low', 'Medium', 'High']).required('Priority is required'),
    status: yup.string().oneOf(['Pending', 'Completed']).required('Status is required'),
  });
}

function isoToDateInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dateInputToIso(value) {
  if (!value) return new Date().toISOString();
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export default function TaskModal({ isOpen, initialValues, subjects, topics, onClose, onSubmit }) {
  const isEditing = Boolean(initialValues?.id);

  const schema = useMemo(() => buildSchema({ isEditing }), [isEditing]);

  const defaults = useMemo(
    () => ({
      title: initialValues?.title ?? '',
      subject: initialValues?.subject ?? subjects?.[0]?.id ?? '',
      topic: initialValues?.topic ?? '',
      deadline: isoToDateInput(initialValues?.deadline) || isoToDateInput(new Date().toISOString()),
      priority: initialValues?.priority ?? 'Medium',
      status: initialValues?.status ?? 'Pending',
    }),
    [initialValues, subjects]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset, isOpen]);

  const subjectId = watch('subject');
  const topicId = watch('topic');
  const availableTopics = useMemo(() => topics.filter((t) => t.subjectId === subjectId), [topics, subjectId]);

  useEffect(() => {
    if (availableTopics.some((t) => t.id === topicId)) return;
    setValue('topic', availableTopics[0]?.id ?? '', { shouldDirty: true, shouldValidate: true });
  }, [availableTopics, setValue, topicId]);

  const save = async (values) => {
    const payload = {
      title: values.title,
      subject: values.subject,
      topic: values.topic,
      deadline: dateInputToIso(values.deadline),
      priority: values.priority,
      status: values.status,
    };
    await onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Task' : 'Add Task'} size="md">
      <form className="form" onSubmit={handleSubmit(save)}>
        <div className="form-row">
          <label className="form-label" htmlFor="task-title">
            Task Title
          </label>
          <input id="task-title" className="form-input" placeholder="e.g., Solve 5 DP problems" {...register('title')} />
          {errors.title ? <div className="form-error">{errors.title.message}</div> : null}
        </div>

        <div className="form-split">
          <div className="form-row">
            <label className="form-label" htmlFor="task-subject">
              Subject
            </label>
            <select id="task-subject" className="form-select" {...register('subject')}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.subject ? <div className="form-error">{errors.subject.message}</div> : null}
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="task-topic">
              Topic
            </label>
            <select id="task-topic" className="form-select" {...register('topic')}>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.topic ? <div className="form-error">{errors.topic.message}</div> : null}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="task-deadline">
            Deadline
          </label>
          <input id="task-deadline" className="form-input" type="date" {...register('deadline')} />
          {errors.deadline ? <div className="form-error">{errors.deadline.message}</div> : null}
        </div>

        <div className="form-row">
          <div className="form-label">Priority</div>
          <div className="pill-group" role="radiogroup" aria-label="Priority">
            {['Low', 'Medium', 'High'].map((p) => (
              <label key={p} className="pill">
                <input type="radio" value={p} {...register('priority')} />
                <span>{p}</span>
              </label>
            ))}
          </div>
          {errors.priority ? <div className="form-error">{errors.priority.message}</div> : null}
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="task-status">
            Status
          </label>
          <select id="task-status" className="form-select" {...register('status')}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status ? <div className="form-error">{errors.status.message}</div> : null}
        </div>

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
