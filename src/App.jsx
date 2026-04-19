import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/layout/Layout.jsx';
import Button from './components/ui/Button.jsx';
import Modal from './components/ui/Modal.jsx';
import Badge from './components/ui/Badge.jsx';
import ProgressBar from './components/ui/ProgressBar.jsx';
import EmptyState from './components/ui/EmptyState.jsx';
import Loader from './components/ui/Loader.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Subjects from './pages/Subjects.jsx';
import Tasks from './pages/Tasks.jsx';
import Revision from './pages/Revision.jsx';
import AITools from './pages/AITools.jsx';

import { useState } from 'react';

function UIStorybook() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);

  return (
    <section className="ui-story" aria-label="UI storyboard">
      <h3>UI Component Storyboard (Step 4)</h3>

      <div className="ui-storyRow">
        <Button variant="primary" size="sm">
          Primary sm
        </Button>
        <Button variant="primary" size="md" icon={<span>+</span>}>
          Primary md
        </Button>
        <Button variant="primary" size="lg" isLoading>
          Loading
        </Button>
        <Button variant="secondary" size="md">
          Secondary
        </Button>
        <Button variant="ghost" size="md">
          Ghost
        </Button>
        <Button variant="danger" size="md">
          Danger
        </Button>
      </div>

      <div className="ui-storyRow">
        <Badge variant="status" label="Completed" />
        <Badge variant="status" label="In Progress" />
        <Badge variant="status" label="Not Started" />
        <Badge variant="status" label="Needs Revision" />
        <Badge variant="priority" label="High" />
        <Badge variant="priority" label="Medium" />
        <Badge variant="priority" label="Low" />
        <Badge variant="difficulty" label="Hard" />
        <Badge variant="difficulty" label="Medium" />
        <Badge variant="difficulty" label="Easy" />
      </div>

      <div className="ui-storyGrid">
        <ProgressBar label="Completion" value={72} showPercent />
        <ProgressBar label="Amber" value={38} color="var(--accent-gold)" showPercent />
        <ProgressBar label="Sage" value={55} color="var(--accent-sage)" showPercent />
      </div>

      <div style={{ marginTop: 14 }}>
        <EmptyState
          title="No study sessions yet"
          description="Add tasks, track progress, and schedule revisions to build momentum."
          action={{ label: 'Open Modal', onClick: () => setIsModalOpen(true), variant: 'secondary' }}
        />
      </div>

      <div className="ui-storyRow" style={{ marginTop: 14 }}>
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Show Modal
        </Button>
        <Button variant="ghost" onClick={() => setIsLoadingOpen(true)}>
          Show Loader
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Modal Preview" size="md">
        <p style={{ marginTop: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Backdrop blur, Escape/backdrop click to close, and a subtle slide-up transition.
        </p>
        <div className="ui-storyRow" style={{ justifyContent: 'flex-end', marginBottom: 0 }}>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Confirm
          </Button>
        </div>
      </Modal>

      {isLoadingOpen ? <Loader /> : null}
      {isLoadingOpen ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70 }} onClick={() => setIsLoadingOpen(false)} />
      ) : null}
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard />
                <UIStorybook />
              </>
            }
          />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/ai-tools" element={<AITools />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
