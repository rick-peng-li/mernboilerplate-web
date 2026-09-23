import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Avatar, Button, Card, CardActions, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { formatDate, getInitials } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';

function TaskCard({ task, assignee, project, isDeleting, onDelete, onEdit }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 1.5 }}>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                        <Typography variant="h6">{task.title}</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                            <StatusChip label={task.status} />
                            <StatusChip label={task.priority} />
                        </Stack>
                    </Stack>
                    <Typography color="text.secondary" lineHeight={1.7}>
                        {task.summary}
                    </Typography>
                    <LinearProgress value={task.status === 'Done' ? 100 : task.status === 'Review' ? 85 : task.status === 'In Progress' ? 55 : 20} variant="determinate" />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar sx={{ width: 34, height: 34 }}>{getInitials(assignee?.name)}</Avatar>
                            <Stack spacing={0.15}>
                                <Typography variant="body2">{assignee?.name || 'Unassigned'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {project?.title || 'No project'}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            Due {formatDate(task.dueDate)}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'flex-end' }}>
                <Button variant="text" startIcon={<EditRoundedIcon />} onClick={() => onEdit(task)}>
                    Edit
                </Button>
                <Button color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} disabled={isDeleting} onClick={() => onDelete(task)}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default TaskCard;
