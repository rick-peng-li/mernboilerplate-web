import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useProjectWorkspace } from '@/hooks/useProjectWorkspace';
import ActivityFeed from '@/components/activity/ActivityFeed';
import SectionHeader from '@/components/common/SectionHeader';
import StatusChip from '@/components/common/StatusChip';
import { formatDate, formatPercent, getInitials } from '@/utils/formatters';

function ProjectWorkspacePage() {
    const { projectId } = useParams();
    const { errorMessage, isLoading, workspace } = useProjectWorkspace(projectId);

    if (isLoading) {
        return <Alert severity="info">Loading project workspace...</Alert>;
    }

    if (errorMessage || !workspace) {
        return <Alert severity="error">{errorMessage || 'Project workspace not found.'}</Alert>;
    }

    const memberMap = Object.fromEntries(workspace.members.map((member) => [member.id, member]));

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Project Workspace"
                title={workspace.title}
                description={workspace.summary}
                action={
                    <Button component={RouterLink} to="/projects" variant="outlined" startIcon={<ArrowBackRoundedIcon />}>
                        Back to projects
                    </Button>
                }
            />

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack spacing={2.5}>
                                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                                    <Stack spacing={1.25}>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <StatusChip label={workspace.status} />
                                            <StatusChip label={workspace.priority} />
                                            <StatusChip label={workspace.health} />
                                            <Chip label={`${formatPercent(workspace.progress)} complete`} />
                                        </Stack>
                                        <Typography color="text.secondary">
                                            Due {formatDate(workspace.dueDate)} · Category {workspace.category}
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={0.6} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                                        <Typography variant="overline" color="text.secondary">
                                            Project owner
                                        </Typography>
                                        <Stack direction="row" spacing={1.2} alignItems="center">
                                            <Avatar>{getInitials(workspace.owner?.name)}</Avatar>
                                            <Box>
                                                <Typography>{workspace.owner?.name || 'Unassigned'}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {workspace.owner?.role || 'Owner'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <Divider />

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="overline" color="text.secondary">
                                                    Linked tasks
                                                </Typography>
                                                <Typography variant="h4">{workspace.tasks.length}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="overline" color="text.secondary">
                                                    Team members
                                                </Typography>
                                                <Typography variant="h4">{workspace.members.length}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="overline" color="text.secondary">
                                                    Releases
                                                </Typography>
                                                <Typography variant="h4">{workspace.releases.length}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5">Assigned team</Typography>
                                {workspace.members.map((member) => (
                                    <Stack key={member.id} direction="row" spacing={1.5} alignItems="center">
                                        <Avatar>{getInitials(member.name)}</Avatar>
                                        <Box>
                                            <Typography>{member.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {member.role} · {member.allocation}% allocation
                                            </Typography>
                                        </Box>
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <SectionHeader eyebrow="Tasks" title="Project tasks" description="Execution items currently linked to this project workspace." />
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {workspace.tasks.map((task, index) => (
                                    <Box key={task.id}>
                                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle1">{task.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {task.summary}
                                                </Typography>
                                            </Box>
                                            <Stack spacing={0.75} alignItems="flex-end">
                                                <StatusChip label={task.status} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {memberMap[task.assigneeId]?.name || 'Unassigned'}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        {index < workspace.tasks.length - 1 ? <Divider sx={{ mt: 2 }} /> : null}
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <SectionHeader eyebrow="Releases" title="Release plans" description="Release packages currently carrying this project's scope." />
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {workspace.releases.map((release, index) => (
                                    <Box key={release.id}>
                                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle1">{release.version} · {release.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {release.summary}
                                                </Typography>
                                            </Box>
                                            <Stack spacing={0.75} alignItems="flex-end">
                                                <StatusChip label={release.status} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(release.releaseDate)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        {index < workspace.releases.length - 1 ? <Divider sx={{ mt: 2 }} /> : null}
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <SectionHeader eyebrow="Activity" title="Project activity" description="Recent events and signals emitted from this project workspace." />
            <ActivityFeed activities={workspace.activities} memberMap={memberMap} />
        </Stack>
    );
}

export default ProjectWorkspacePage;
