import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material';
import { formatDate } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';

function ReleaseCard({ release, owner, isDeleting, onDelete, onEdit, projectNames }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 1.5 }}>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                        <Stack spacing={0.75}>
                            <Chip label={release.version} color="secondary" variant="outlined" sx={{ width: 'fit-content' }} />
                            <Typography variant="h6">{release.name}</Typography>
                        </Stack>
                        <StatusChip label={release.status} />
                    </Stack>
                    <Typography color="text.secondary" lineHeight={1.7}>
                        {release.summary}
                    </Typography>
                    <Typography variant="body2">
                        Owner: <Typography component="span" color="text.secondary">{owner?.name || 'Unassigned'}</Typography>
                    </Typography>
                    <Typography variant="body2">
                        Release date: <Typography component="span" color="text.secondary">{formatDate(release.releaseDate)}</Typography>
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {projectNames.map((name) => (
                            <Chip key={`${release.id}-${name}`} icon={<RocketLaunchRoundedIcon />} label={name} size="small" />
                        ))}
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'flex-end' }}>
                <Button variant="text" startIcon={<EditRoundedIcon />} onClick={() => onEdit(release)}>
                    Edit
                </Button>
                <Button color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} disabled={isDeleting} onClick={() => onDelete(release)}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default ReleaseCard;
