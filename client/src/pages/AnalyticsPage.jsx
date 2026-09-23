import { Card, CardContent, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';

function AnalyticsPage() {
    const { analytics } = useWorkspaceContext();

    if (!analytics) {
        return null;
    }

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Analytics"
                title="Workspace analytics"
                description="Delivery health, utilization, and release planning metrics derived from the shared portfolio datasets."
            />

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard label="Average Progress" value={`${analytics.portfolio.averageProgress}%`} helper="Average completion rate across all projects." />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard label="On-track Projects" value={analytics.portfolio.onTrackProjects} helper="Projects currently marked healthy." />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard label="At-risk Projects" value={analytics.portfolio.atRiskProjects} helper="Projects that require delivery attention." />
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5">Member utilization</Typography>
                                {analytics.memberUtilization.map((member) => (
                                    <Stack key={member.id} spacing={0.75}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography>{member.name}</Typography>
                                            <Typography color="text.secondary">{member.allocation}% / {member.capacity}%</Typography>
                                        </Stack>
                                        <LinearProgress value={member.allocation} variant="determinate" />
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5">Project health matrix</Typography>
                                {analytics.projectHealthMatrix.map((project) => (
                                    <Stack key={project.id} direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                                        <Stack spacing={0.25}>
                                            <Typography>{project.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {project.progress}% complete
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <StatusChip label={project.health} />
                                            <StatusChip label={project.priority} />
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5">Task priority breakdown</Typography>
                                {Object.entries(analytics.taskPriorityBreakdown).map(([priority, count]) => (
                                    <Stack key={priority} direction="row" justifyContent="space-between" alignItems="center">
                                        <StatusChip label={priority} />
                                        <Typography>{count}</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5">Release calendar</Typography>
                                {analytics.releaseCalendar.map((release) => (
                                    <Stack key={release.id} direction="row" justifyContent="space-between" spacing={1.5}>
                                        <Stack spacing={0.25}>
                                            <Typography>{release.version} · {release.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {release.releaseDate}
                                            </Typography>
                                        </Stack>
                                        <StatusChip label={release.status} />
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default AnalyticsPage;
