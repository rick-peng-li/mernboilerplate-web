import { Card, CardContent, MenuItem, Stack, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import ActivityFeed from '@/components/activity/ActivityFeed';
import EmptyState from '@/components/common/EmptyState';
import SectionHeader from '@/components/common/SectionHeader';

function ActivityPage() {
    const { activities, members, projectOptions } = useWorkspaceContext();
    const [filters, setFilters] = useState({
        type: 'All',
        projectId: 'All',
    });

    const memberMap = useMemo(() => Object.fromEntries(members.map((member) => [member.id, member])), [members]);

    const filteredActivities = useMemo(
        () =>
            activities.filter((activity) => {
                return (
                    (filters.type === 'All' || activity.type === filters.type) &&
                    (filters.projectId === 'All' || activity.projectId === filters.projectId)
                );
            }),
        [activities, filters]
    );

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Activity"
                title="Activity center"
                description="Follow recent changes emitted by projects, tasks, releases, team updates, and workspace configuration."
            />

            <Card>
                <CardContent>
                    <Stack spacing={2.5}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField select label="Activity type" value={filters.type} onChange={(event) => setFilters((currentState) => ({ ...currentState, type: event.target.value }))} sx={{ minWidth: 220 }}>
                                <MenuItem value="All">All activity types</MenuItem>
                                <MenuItem value="project">Project</MenuItem>
                                <MenuItem value="task">Task</MenuItem>
                                <MenuItem value="release">Release</MenuItem>
                                <MenuItem value="team">Team</MenuItem>
                                <MenuItem value="settings">Settings</MenuItem>
                            </TextField>
                            <TextField select label="Project" value={filters.projectId} onChange={(event) => setFilters((currentState) => ({ ...currentState, projectId: event.target.value }))} sx={{ minWidth: 240 }}>
                                <MenuItem value="All">All projects</MenuItem>
                                {projectOptions.map((project) => (
                                    <MenuItem key={project.value} value={project.value}>
                                        {project.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        {filteredActivities.length === 0 ? (
                            <EmptyState title="No activity found" description="The current filter combination did not match any recorded workspace activity." />
                        ) : (
                            <ActivityFeed activities={filteredActivities} memberMap={memberMap} />
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}

export default ActivityPage;
