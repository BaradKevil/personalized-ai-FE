import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi';

const GoalCard = ({ goal, onToggleStep, onAddStep, onDelete }) => {
    const [newStep, setNewStep] = useState('');
    const [adding, setAdding] = useState(false);

    const done = (goal.steps || []).filter((s) => s.done).length;
    const total = (goal.steps || []).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    const addStep = () => {
        const text = newStep.trim();
        if (!text) return;
        onAddStep(text);
        setNewStep('');
        setAdding(false);
    };

    return (
        <Box
            className="milo-rise"
            sx={{
                bgcolor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                p: 2.2,
                boxShadow: 'var(--shadow-xs)',
                transition: 'box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease',
                '&:hover': {
                    boxShadow: 'var(--shadow-md)',
                    transform: 'translateY(-1px)',
                    borderColor: 'var(--border-strong)',
                },
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '16px', lineHeight: 1.3, color: 'var(--ink)' }}>
                        {goal.title}
                    </Typography>
                    {goal.description && (
                        <Typography sx={{ fontSize: '12.5px', color: 'var(--text-secondary)', mt: 0.3, lineHeight: 1.5 }}>
                            {goal.description}
                        </Typography>
                    )}
                </Box>
                <Tooltip title="Delete goal">
                    <IconButton
                        size="small"
                        onClick={() => onDelete(goal)}
                        aria-label={`Delete goal ${goal.title}`}
                        sx={{ color: 'var(--text-muted)', borderRadius: '6px', '&:hover': { color: 'var(--error)', bgcolor: 'var(--error-soft)' } }}
                    >
                        <FiTrash2 size={14} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Progress */}
            <Box sx={{ mb: 1.8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                    <Typography sx={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {total === 0 ? 'Getting started' : `${done} of ${total} steps completed`}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                        {percent}%
                    </Typography>
                </Box>
                <Box sx={{ height: 6, borderRadius: '99px', bgcolor: 'var(--surface-soft)', overflow: 'hidden' }}>
                    <Box
                        sx={{
                            height: '100%',
                            width: `${percent}%`,
                            borderRadius: '99px',
                            bgcolor: percent === 100 ? 'var(--success)' : 'var(--accent)',
                            transition: 'width 0.4s ease',
                        }}
                    />
                </Box>
            </Box>

            {/* Steps list */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                {(goal.steps || []).map((step) => (
                    <Box
                        key={step.id}
                        onClick={() => onToggleStep(step.id)}
                        role="checkbox"
                        aria-checked={step.done}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onToggleStep(step.id);
                            }
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.1,
                            px: 1,
                            py: 0.65,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background 0.12s ease',
                            '&:hover': { bgcolor: 'var(--surface-soft)' },
                        }}
                    >
                        <Box
                            sx={{
                                width: 18,
                                height: 18,
                                flexShrink: 0,
                                borderRadius: '4px',
                                border: step.done ? 'none' : '1.5px solid var(--border-strong)',
                                bgcolor: step.done ? 'var(--success)' : 'transparent',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.12s ease',
                            }}
                        >
                            {step.done && <FiCheck size={11} strokeWidth={3} />}
                        </Box>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                fontWeight: step.done ? 500 : 600,
                                color: step.done ? 'var(--text-muted)' : 'var(--ink)',
                                textDecoration: step.done ? 'line-through' : 'none',
                            }}
                        >
                            {step.text}
                        </Typography>
                    </Box>
                ))}

                {adding ? (
                    <Box sx={{ display: 'flex', gap: 0.8, mt: 0.8, px: 0.4 }}>
                        <input
                            autoFocus
                            value={newStep}
                            onChange={(e) => setNewStep(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') addStep();
                                if (e.key === 'Escape') setAdding(false);
                            }}
                            placeholder="Next milestone step…"
                            aria-label="New step"
                            style={{
                                flex: 1,
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                fontSize: '13px',
                                fontFamily: 'inherit',
                                outline: 'none',
                                background: 'var(--surface)',
                                color: 'var(--ink)',
                            }}
                        />
                        <Box
                            component="button"
                            onClick={addStep}
                            aria-label="Add step"
                            sx={{
                                border: 'none',
                                borderRadius: '6px',
                                px: 1.2,
                                bgcolor: 'var(--accent)',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '12.5px',
                                cursor: 'pointer',
                                transition: 'background 0.12s ease',
                                '&:hover': { bgcolor: 'var(--accent-hover)' },
                            }}
                        >
                            Add
                        </Box>
                    </Box>
                ) : (
                    <Box
                        component="button"
                        onClick={() => setAdding(true)}
                        sx={{
                            alignSelf: 'flex-start',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                            ml: 0.4,
                            bgcolor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        <FiPlus size={12} /> Add next step
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default GoalCard;
