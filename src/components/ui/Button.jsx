export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  onClick,
  disabled,
  type = 'button',
  ...rest
}) {
  const isDisabled = Boolean(disabled || isLoading);
  const classes = ['ui-btn', `ui-btn--${variant}`, `ui-btn--${size}`].join(' ');

  return (
    <button type={type} className={classes} onClick={onClick} disabled={isDisabled} {...rest}>
      {isLoading ? (
        <span className="ui-btnSpinner" aria-label="Loading" />
      ) : (
        <>
          {icon ? <span className="ui-btnIcon" aria-hidden="true">{icon}</span> : null}
          <span className="ui-btnText">{children}</span>
        </>
      )}
    </button>
  );
}
