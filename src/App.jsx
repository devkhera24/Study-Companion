import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard.jsx';
import Subjects from './pages/Subjects.jsx';
import Tasks from './pages/Tasks.jsx';
import Revision from './pages/Revision.jsx';
import AITools from './pages/AITools.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/ai-tools" element={<AITools />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
