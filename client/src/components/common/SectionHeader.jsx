import { Stack, Typography } from '@mui/material';

function SectionHeader({ eyebrow, title, description, action }) {
    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
            sx={{ mb: 3 }}
        >
            <Stack spacing={0.75}>
                {eyebrow ? (
                    <Typography variant="caption" sx={{ color: 'secondary.main', letterSpacing: 2, textTransform: 'uppercase' }}>
                        {eyebrow}
                    </Typography>
                ) : null}
                <Typography variant="h4">{title}</Typography>
                {description ? (
                    <Typography variant="body1" color="text.secondary" maxWidth={720}>
                        {description}
                    </Typography>
                ) : null}
            </Stack>
            {action}
        </Stack>
    );
}

export default SectionHeader;
