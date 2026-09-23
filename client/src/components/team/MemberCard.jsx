import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Avatar, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material';
import { getInitials } from '@/utils/formatters';
import StatusChip from '@/components/common/StatusChip';

function MemberCard({ member, isDeleting, onDelete, onEdit }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 1.5 }}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 48, height: 48 }}>{getInitials(member.name)}</Avatar>
                        <Stack spacing={0.3}>
                            <Typography variant="h6">{member.name}</Typography>
                            <Typography color="text.secondary">{member.role}</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <StatusChip label={member.status} />
                        <Chip label={`${member.allocation}% allocation`} size="small" />
                        <Chip label={member.timezone} size="small" />
                    </Stack>
                    <Typography color="text.secondary">{member.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {member.location}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {member.skills.map((skill) => (
                            <Chip key={`${member.id}-${skill}`} label={skill} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                        ))}
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'flex-end' }}>
                <Button variant="text" startIcon={<EditRoundedIcon />} onClick={() => onEdit(member)}>
                    Edit
                </Button>
                <Button color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} disabled={isDeleting} onClick={() => onDelete(member)}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default MemberCard;
