const Loading = ({ message = 'Loading...', className = '' }) => (
	<div className={`loading-state ${className}`.trim()} role="status" aria-live="polite">
		<span className="loading-spinner" aria-hidden="true" />
		<span>{message}</span>
	</div>
);

export default Loading;