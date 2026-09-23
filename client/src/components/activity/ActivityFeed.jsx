import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { Avatar, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { formatDateTime, getInitials } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';

function ActivityFeed({ activities, memberMap }) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2.5}>
                    {activities.map((activity, index) => (
                        <Stack key={activity.id} spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Avatar sx={{ width: 38, height: 38 }}>
                                    {getInitials(memberMap[activity.actorId]?.name || activity.type)}
                                </Avatar>
                                <Stack spacing={0.6} sx={{ flexGrow: 1 }}>
                                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                            <Typography variant="subtitle1">{activity.title}</Typography>
                                            <StatusChip label={activity.severity} />
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDateTime(activity.happenedAt)}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                                        {activity.description}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <BoltRoundedIcon fontSize="small" color="secondary" />
                                        <Typography variant="caption" color="text.secondary">
                                            {memberMap[activity.actorId]?.name || 'System'} · {activity.type}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            {index < activities.length - 1 ? <Divider /> : null}
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default ActivityFeed;
