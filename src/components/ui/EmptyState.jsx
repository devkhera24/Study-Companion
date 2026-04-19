import Button from './Button.jsx';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="ui-empty">
      <div className="ui-emptyArt" aria-hidden="true" />
      <div className="ui-emptyTitle">{title}</div>
      {description ? <div className="ui-emptyDesc">{description}</div> : null}
      {action ? (
        <div className="ui-emptyAction">
          <Button variant={action.variant ?? 'primary'} onClick={action.onClick} icon={action.icon}>
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
