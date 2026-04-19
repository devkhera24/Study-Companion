import EmptyState from '../ui/EmptyState.jsx';

export default function AIOutputCard({ title = 'Output', subtitle, content, isLoading = false }) {
  return (
    <div className="dash-card aiout-card">
      <div className="dash-cardHeader">
        <div className="aiout-header">
          <div>
            <div className="dash-cardTitle">{title}</div>
            {subtitle ? <div className="dash-cardSub">{subtitle}</div> : null}
          </div>
          {isLoading ? <div className="aiout-loading" aria-label="Generating" /> : null}
        </div>
      </div>

      <div className="aiout-body">
        {content ? (
          <pre className="aiout-pre">{content}</pre>
        ) : (
          <EmptyState title="No output yet" description="Choose a tool, paste notes, then click Generate." />
        )}
      </div>
    </div>
  );
}
