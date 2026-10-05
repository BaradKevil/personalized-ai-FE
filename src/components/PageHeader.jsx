import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, actions }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography sx={{ fontSize: 14, color: 'var(--text-secondary)', mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
        </Box>
    );
};

export default PageHeader;
