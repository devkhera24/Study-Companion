import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

function dateToInputValue(date) {
  try {
    return format(date, 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

function parseDateInput(value) {
  if (!value) return null;
  const parts = value.split('-').map((v) => Number(v));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

export default function RescheduleRevisionModal({ isOpen, revision, onClose, onSubmit }) {
  const initial = useMemo(() => {
    if (!revision?.scheduledFor) return '';
    const d = new Date(revision.scheduledFor);
    return Number.isNaN(d.getTime()) ? '' : dateToInputValue(d);
  }, [revision]);

  const [dateValue, setDateValue] = useState(initial);

  useEffect(() => {
    setDateValue(initial);
  }, [initial, isOpen]);

  const canSubmit = Boolean(dateValue);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Revision" size="sm">
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const nextDate = parseDateInput(dateValue);
          if (!nextDate) return;
          onSubmit?.(nextDate);
        }}
      >
        <div className="form-row">
          <label className="form-label" htmlFor="revp-date">
            New date
          </label>
          <input
            id="revp-date"
            className="form-input"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
