import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import { useDashboardContext } from '@/app/useDashboardContext';

const architectureItems = [
    {
        icon: <BoltRoundedIcon color="secondary" />,
        title: 'Vite + React 19 frontend',
        description: 'A modern client workspace with file-based separation for routing, pages, components, hooks, services, and shared utilities.',
    },
    {
        icon: <StorageRoundedIcon color="secondary" />,
        title: 'Express 5 backend',
        description: 'A layered API service with controllers, routes, middleware, validators, models, and configuration separated by responsibility.',
    },
    {
        icon: <TimelineRoundedIcon color="secondary" />,
        title: 'End-to-end CRUD flow',
        description: 'Project records, summary metrics, and service health are all connected and ready for extension.',
    },
];

function HomePage() {
    const { errorMessage, health, recentProjects, summary } = useDashboardContext();

    return (
        <Stack spacing={5}>
            <Card
                sx={{
                    overflow: 'hidden',
                    background:
                        'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(88,28,135,0.88) 45%, rgba(3,105,161,0.92) 100%)',
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack spacing={2.5}>
                                <Chip label="Modernized MERN architecture" color="secondary" sx={{ width: 'fit-content' }} />
                                <Typography variant="h2">
                                    Frontend and backend are now separated, upgraded, and ready for real delivery.
                                </Typography>
                                <Typography variant="body1" color="rgba(255,255,255,0.8)" maxWidth={720}>
                                    The project is rebuilt around Vite, React 19, Material UI, Express 5, Mongoose 9, and a cleaner application structure.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                    <Button
                                        component={RouterLink}
                                        to="/projects"
                                        variant="contained"
                                        color="secondary"
                                        endIcon={<ArrowForwardRoundedIcon />}
                                    >
                                        Open project workspace
                                    </Button>
                                    <Chip label={`Backend: ${health.message}`} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.25)' }} />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 5,
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                }}
                            >
                                <Typography variant="overline" color="rgba(255,255,255,0.72)">
                                    Runtime snapshot
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1, mb: 2 }}>
                                    {health.mode} mode
                                </Typography>
                                <Typography color="rgba(255,255,255,0.82)">
                                    {health.timestamp || 'Waiting for the first successful response from the API.'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard label="Total projects" value={summary.total} helper="All records tracked across the workspace." />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard label="Completed" value={summary.completed} helper="Shipped initiatives already delivered." />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard label="In progress" value={summary.inProgress} helper="Projects that are currently moving forward." />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard label="Planned" value={summary.planned} helper="Upcoming work queued for future delivery." />
                </Grid>
            </Grid>

            <Box>
                <SectionHeader
                    eyebrow="Architecture"
                    title="A cleaner structure for current generation development"
                    description="The new layout separates routing, pages, components, utilities, and backend responsibilities so the project can scale without turning into a single-file demo."
                />
                <Grid container spacing={2.5}>
                    {architectureItems.map((item) => (
                        <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        {item.icon}
                                        <Typography variant="h5">{item.title}</Typography>
                                        <Typography color="text.secondary" lineHeight={1.8}>
                                            {item.description}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box>
                <SectionHeader
                    eyebrow="Recent records"
                    title="Latest project entries"
                    description={errorMessage || 'A quick preview of the most recent items already connected to the API layer.'}
                    action={
                        <Button component={RouterLink} to="/projects" variant="outlined">
                            Manage all projects
                        </Button>
                    }
                />
                <Grid container spacing={2.5}>
                    {recentProjects.map((project) => (
                        <Grid key={project.id} size={{ xs: 12, md: 4 }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Chip label={project.category} color="secondary" variant="outlined" sx={{ width: 'fit-content' }} />
                                        <Typography variant="h5">{project.title}</Typography>
                                        <Typography color="text.secondary" lineHeight={1.8}>
                                            {project.summary}
                                        </Typography>
                                        <Stack direction="row" flexWrap="wrap" gap={1}>
                                            {project.stack.map((item) => (
                                                <Chip key={`${project.id}-${item}`} label={item} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                                            ))}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Stack>
    );
}

export default HomePage;
