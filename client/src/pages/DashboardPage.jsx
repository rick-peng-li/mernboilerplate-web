import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import ActivityFeed from '@/components/activity/ActivityFeed';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import { formatDate, formatPercent } from '@/utils/formatters';

function DashboardPage() {
    const { dashboard, health, members } = useWorkspaceContext();
    const memberMap = Object.fromEntries(members.map((member) => [member.id, member]));

    return (
        <Stack spacing={4.5}>
            <Card
                sx={{
                    overflow: 'hidden',
                    background:
                        'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(91,33,182,0.82) 48%, rgba(6,182,212,0.82) 100%)',
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack spacing={2.25}>
                                <Chip label="Workspace overview" color="secondary" sx={{ width: 'fit-content' }} />
                                <Typography variant="h2">
                                    A richer project operations workspace with linked portfolio, delivery, and release modules.
                                </Typography>
                                <Typography color="rgba(255,255,255,0.82)" maxWidth={720}>
                                    Dashboard, projects, tasks, team members, releases, activity, analytics, and settings now work together through shared frontend state and backend APIs.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                    <Button component={RouterLink} to="/projects" variant="contained" color="secondary" endIcon={<ArrowForwardRoundedIcon />}>
                                        Open projects
                                    </Button>
                                    <Button component={RouterLink} to="/analytics" variant="outlined" color="inherit" startIcon={<InsightsRoundedIcon />}>
                                        View analytics
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Card sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}>
                                <CardContent>
                                    <Stack spacing={1.5}>
                                        <Typography variant="overline" color="rgba(255,255,255,0.72)">
                                            Runtime
                                        </Typography>
                                        <Typography variant="h4">{health.mode} mode</Typography>
                                        <Typography color="rgba(255,255,255,0.82)">{health.message}</Typography>
                                        <Typography variant="body2" color="rgba(255,255,255,0.72)">
                                            Last update: {formatDate(health.timestamp)}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                    <StatCard label="Projects" value={dashboard.summary.totalProjects} helper="All tracked initiatives across the workspace." />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                    <StatCard label="Active Projects" value={dashboard.summary.activeProjects} helper="Projects currently moving through delivery." />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                    <StatCard label="Tasks" value={dashboard.summary.totalTasks} helper="Execution items shared across modules." />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                    <StatCard label="Team Members" value={dashboard.summary.activeMembers} helper="People available in the delivery roster." />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 2.4 }}>
                    <StatCard label="Upcoming Releases" value={dashboard.summary.upcomingReleases} helper="Release plans still in motion." />
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <SectionHeader
                        eyebrow="Spotlight"
                        title="Portfolio spotlight"
                        description="Recent project activity, health, and progress across the delivery portfolio."
                    />
                    <Grid container spacing={2.5}>
                        {dashboard.spotlightProjects.map((project) => (
                            <Grid key={project.id} size={{ xs: 12, md: 6 }}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Stack spacing={1.5}>
                                            <Stack direction="row" justifyContent="space-between" spacing={1}>
                                                <Typography variant="h6">{project.title}</Typography>
                                                <StatusChip label={project.status} />
                                            </Stack>
                                            <Typography color="text.secondary">{project.summary}</Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                <StatusChip label={project.priority} />
                                                <StatusChip label={project.health} />
                                                <Chip label={`${formatPercent(project.progress)} complete`} size="small" />
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">
                                                Owner: {memberMap[project.ownerId]?.name || 'Unassigned'}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, lg: 5 }}>
                    <SectionHeader
                        eyebrow="Action Queue"
                        title="Critical tasks"
                        description="High-priority work items surfaced from the shared task module."
                    />
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {dashboard.criticalTasks.map((task, index) => (
                                    <Box key={task.id}>
                                        <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                                            <Box>
                                                <Typography variant="subtitle1">{task.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {task.summary}
                                                </Typography>
                                            </Box>
                                            <Stack spacing={0.75} alignItems="flex-end">
                                                <StatusChip label={task.priority} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Due {formatDate(task.dueDate)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        {index < dashboard.criticalTasks.length - 1 ? <Divider sx={{ mt: 2 }} /> : null}
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 5 }}>
                    <SectionHeader
                        eyebrow="Release Radar"
                        title="Upcoming releases"
                        description="Release plans that are still being prepared or validated."
                    />
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {dashboard.upcomingReleases.map((release, index) => (
                                    <Box key={release.id}>
                                        <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                                            <Box>
                                                <Typography variant="subtitle1">{release.version} · {release.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Release date {formatDate(release.releaseDate)}
                                                </Typography>
                                            </Box>
                                            <StatusChip label={release.status} />
                                        </Stack>
                                        {index < dashboard.upcomingReleases.length - 1 ? <Divider sx={{ mt: 2 }} /> : null}
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <SectionHeader
                        eyebrow="Activity"
                        title="Recent activity feed"
                        description="Changes emitted across projects, tasks, releases, team updates, and settings."
                    />
                    <ActivityFeed activities={dashboard.recentActivities} memberMap={memberMap} />
                </Grid>
            </Grid>
        </Stack>
    );
}

export default DashboardPage;
