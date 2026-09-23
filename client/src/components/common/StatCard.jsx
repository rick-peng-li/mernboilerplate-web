import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Card, CardContent, Stack, Typography } from '@mui/material';

function StatCard({ label, value, helper }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography color="text.secondary">{label}</Typography>
                        <TrendingUpRoundedIcon color="secondary" />
                    </Stack>
                    <Typography variant="h3">{value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {helper}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default StatCard;
