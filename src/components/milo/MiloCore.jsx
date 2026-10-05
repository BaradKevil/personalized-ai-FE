import { Box } from '@mui/material';

/**
 * Milo Core — the AI companion's visual heart.
 *
 * A soft breathing orb with layered light, used to give Milo a calm,
 * intelligent presence across the app. Pure CSS animation (GPU-friendly,
 * no WebGL, no dependencies) so it renders identically everywhere.
 *
 * States:
 *  - idle      → slow breathing
 *  - thinking  → faster breathing + orbiting ring
 *  - listening → quick breathing + reverse ring
 *  - celebrate → pop + expanding pulse rings
 *
 * Size is a CSS variable, so any parent can resize it via `size`.
 */
const MiloCore = ({ state = 'idle', size = 56, sx = {} }) => {
    const stateClass =
        state === 'thinking' ? 'milo-core--thinking' : state === 'listening' ? 'milo-core--listening' : state === 'celebrate' ? 'milo-core--celebrate' : '';

    return (
        <Box
            aria-hidden="true"
            className={`milo-core ${stateClass}`}
            sx={{
                '--core-size': `${size}px`,
                ...sx,
            }}
        >
            <Box className="milo-core__ring" />
            <Box className="milo-core__orb" />
            <Box className="milo-core__pulse" />
        </Box>
    );
};

export default MiloCore;
