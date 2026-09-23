import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import { projectStatusMeta } from '@/utils/project-status';

function ProjectCard({ project, isDeleting, onDelete, onEdit }) {
    const statusMeta = projectStatusMeta[project.status] || projectStatusMeta.Planned;

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 1.5 }}>
                <Stack spacing={2.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Stack spacing={1}>
                            <Chip label={project.category} color="secondary" variant="outlined" sx={{ width: 'fit-content' }} />
                            <Typography variant="h5">{project.title}</Typography>
                        </Stack>
                        <Chip label={statusMeta.label} color={statusMeta.color} />
                    </Stack>

                    <Typography color="text.secondary" lineHeight={1.7}>
                        {project.summary}
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {project.stack.map((item) => (
                            <Chip key={`${project.id}-${item}`} label={item} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                        ))}
                    </Stack>

                    <Stack direction="row" flexWrap="wrap" gap={2}>
                        {project.repoUrl ? (
                            <Link href={project.repoUrl} target="_blank" rel="noreferrer" underline="hover">
                                Repository <LaunchRoundedIcon sx={{ fontSize: 14, ml: 0.5 }} />
                            </Link>
                        ) : null}
                        {project.demoUrl ? (
                            <Link href={project.demoUrl} target="_blank" rel="noreferrer" underline="hover">
                                Demo <LaunchRoundedIcon sx={{ fontSize: 14, ml: 0.5 }} />
                            </Link>
                        ) : null}
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'flex-end' }}>
                <Button variant="text" startIcon={<EditRoundedIcon />} onClick={() => onEdit(project)}>
                    Edit
                </Button>
                <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    disabled={isDeleting}
                    onClick={() => onDelete(project)}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default ProjectCard;
