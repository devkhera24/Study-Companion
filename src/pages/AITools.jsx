import { useMemo, useState } from 'react';

import AIOutputCard from '../components/ai/AIOutputCard.jsx';
import Button from '../components/ui/Button.jsx';

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniq(items) {
  return Array.from(new Set(items));
}

function generateSummary(notes) {
  const sentences = splitSentences(notes);
  if (!sentences.length) return '';

  const picked = sentences.slice(0, Math.min(6, sentences.length));
  return ['Summary', '', ...picked.map((s) => `- ${s}`)].join('\n');
}

function generateFlashcards(notes) {
  const lines = notes
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const qa = [];

  // Prefer explicit definitions: "Term: definition"
  lines.forEach((l) => {
    const m = l.match(/^(.{2,40}?)\s*:\s*(.{4,200})$/);
    if (m) qa.push({ q: `What is ${m[1].trim()}?`, a: m[2].trim() });
  });

  // Otherwise, build cards from top keywords.
  if (!qa.length) {
    const words = notes
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !['which', 'their', 'there', 'about', 'would', 'could', 'should'].includes(w));

    const top = uniq(words).slice(0, 8);
    top.forEach((w) => {
      qa.push({ q: `Explain: ${w}`, a: 'Write a short definition in your own words.' });
    });
  }

  const trimmed = qa.slice(0, 10);
  return ['Flashcards', '', ...trimmed.flatMap((c, i) => [`${i + 1}. Q: ${c.q}`, `   A: ${c.a}`, ''])].join('\n').trim();
}

function generateQuiz(notes) {
  const sentences = splitSentences(notes);
  const picks = sentences.slice(0, 6);
  if (!picks.length) return '';

  const questions = picks.map((s, i) => {
    const short = s.length > 120 ? `${s.slice(0, 117)}…` : s;
    return `${i + 1}. In one sentence, explain: ${short}`;
  });

  return ['Quiz (Short Answer)', '', ...questions].join('\n');
}

const TOOL_META = {
  summary: {
    label: 'Summarize Notes',
    subtitle: 'Turns your notes into concise bullet points',
  },
  flashcards: {
    label: 'Generate Flashcards',
    subtitle: 'Creates simple Q/A prompts from your notes',
  },
  quiz: {
    label: 'Generate Quiz',
    subtitle: 'Creates short-answer questions from your notes',
  },
};

export default function AITools() {
  const [tool, setTool] = useState('summary');
  const [notes, setNotes] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const meta = useMemo(() => TOOL_META[tool] ?? TOOL_META.summary, [tool]);

  const onGenerate = async () => {
    const text = notes.trim();
    if (!text) {
      setOutput('');
      return;
    }

    setIsGenerating(true);
    try {
      // Local heuristic generation (no external API key required).
      const next =
        tool === 'flashcards'
          ? generateFlashcards(text)
          : tool === 'quiz'
            ? generateQuiz(text)
            : generateSummary(text);
      setOutput(next);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="page-header">
        <h1 className="page-title">AI Tools</h1>
      </div>

      <div className="ai-grid">
        <div className="dash-card ai-card">
          <div className="dash-cardHeader">
            <div className="dash-cardTitle">{meta.label}</div>
            <div className="dash-cardSub">{meta.subtitle}</div>
          </div>

          <div className="ai-body">
            <div className="form">
              <div className="form-row">
                <label className="form-label" htmlFor="ai-tool">
                  Tool
                </label>
                <select id="ai-tool" className="form-select" value={tool} onChange={(e) => setTool(e.target.value)}>
                  <option value="summary">Summarize</option>
                  <option value="flashcards">Flashcards</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="ai-notes">
                  Notes
                </label>
                <textarea
                  id="ai-notes"
                  className="form-textarea"
                  rows={10}
                  placeholder="Paste your notes here…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <Button variant="ghost" onClick={() => {
                  setNotes('');
                  setOutput('');
                }}>
                  Clear
                </Button>
                <Button onClick={onGenerate} isLoading={isGenerating} disabled={!notes.trim()}>
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </div>

        <AIOutputCard title="Output" subtitle="Generated from your notes" content={output} isLoading={isGenerating} />
      </div>
    </div>
  );
}
