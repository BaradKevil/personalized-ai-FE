import MiloEmpty from './milo/MiloEmpty';

/**
 * EmptyState — kept for backwards compatibility with existing callers.
 * Renders the Milo Core-based empty state (icon prop is now used to
 * set the Core's animation state: 'thinking' | 'listening' | 'celebrate').
 */
const EmptyState = ({ icon, title, message, actionLabel, onAction, actionIcon, ...rest }) => {
    const state = icon === 'thinking' ? 'thinking' : icon === 'listening' ? 'listening' : icon === 'celebrate' ? 'celebrate' : 'idle';
    return <MiloEmpty title={title} message={message} actionLabel={actionLabel} onAction={onAction} actionIcon={actionIcon} state={state} {...rest} />;
};

export default EmptyState;
