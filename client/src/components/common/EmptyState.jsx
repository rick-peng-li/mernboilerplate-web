import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { Card, CardContent, Stack, Typography } from '@mui/material';

function EmptyState({ title, description }) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2} alignItems="center" textAlign="center" py={4}>
                    <InboxRoundedIcon color="secondary" sx={{ fontSize: 42 }} />
                    <Typography variant="h5">{title}</Typography>
                    <Typography color="text.secondary" maxWidth={520}>
                        {description}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default EmptyState;
