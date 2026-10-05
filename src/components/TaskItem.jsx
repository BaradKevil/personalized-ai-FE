import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { dueLabel, isDueOverdue, isDueToday } from '../utils/date';
import { PRIORITIES } from '../utils/constants';

const priorityStyle = {
    high: { color: 'var(--error)', bg: 'var(--error-soft)' },
    medium: { color: 'var(--warning)', bg: 'var(--warning-soft)' },
    low: { color: 'var(--text-secondary)', bg: 'var(--surface-soft)' },
};

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
    const overdue = !task.completed && isDueOverdue(task.dueDate);
    const dueToday = !task.completed && isDueToday(task.dueDate);
    const prio = priorityStyle[task.priority] || priorityStyle.low;

    const dueColor = overdue ? 'var(--error)' : dueToday ? 'var(--accent)' : 'var(--text-muted)';

    return (
        <Box
            className="milo-rise"
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.3,
                p: 1.6,
                borderRadius: '10px',
                bgcolor: 'var(--surface)',
                border: '1px solid var(--border)',
                transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 'var(--shadow-sm)',
                    borderColor: 'var(--border-strong)',
                },
                opacity: task.completed ? 0.72 : 1,
            }}
        >
            {/* Complete toggle */}
            <Tooltip title={task.completed ? 'Mark as not done' : 'Mark as done'}>
                <Box
                    component="button"
                    onClick={() => onToggle(task.id)}
                    aria-label={task.completed ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
                    sx={{
                        width: 22,
                        height: 22,
                        mt: 0.2,
                        flexShrink: 0,
                        borderRadius: '6px',
                        border: task.completed ? 'none' : '2px solid var(--border-strong)',
                        bgcolor: task.completed ? 'var(--success)' : 'transparent',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                            borderColor: 'var(--success)',
                            bgcolor: task.completed ? 'var(--success)' : 'var(--success-soft)',
                        },
                    }}
                >
                    {task.completed && <FiCheck size={13} strokeWidth={3} />}
                </Box>
            </Tooltip>

            {/* Content */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: 15,
                        fontWeight: task.completed ? 500 : 700,
                        color: task.completed ? 'var(--text-muted)' : 'var(--ink)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        wordBreak: 'break-word',
                    }}
                >
                    {task.title}
                </Typography>

                {(task.dueDate || task.priority !== 'medium' || task.tags?.length) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap', mt: 0.7 }}>
                        {task.dueDate && (
                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: dueColor }}>
                                {overdue ? 'Overdue · ' : ''}
                                {dueLabel(task.dueDate)}
                            </Typography>
                        )}
                        {task.priority !== 'medium' && (
                            <Chip
                                label={PRIORITIES.find((p) => p.value === task.priority)?.label}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: prio.color,
                                    bgcolor: prio.bg,
                                    '& .MuiChip-label': { px: 0.8 },
                                }}
                            />
                        )}
                        {task.tags?.map((tag) => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    bgcolor: 'var(--surface-soft)',
                                    '& .MuiChip-label': { px: 0.8 },
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 0.2, opacity: { xs: 1, md: 0 }, transition: 'opacity 0.15s ease' }} className="task-actions">
                <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} sx={{ width: 30, height: 30, color: 'var(--text-muted)', '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-soft)' } }}>
                        <FiEdit2 size={14} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} sx={{ width: 30, height: 30, color: 'var(--text-muted)', '&:hover': { color: 'var(--error)', bgcolor: 'var(--error-soft)' } }}>
                        <FiTrash2 size={14} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default TaskItem;
