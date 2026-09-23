import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Alert, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import ActionSnackbar from '@/components/common/ActionSnackbar';
import EmptyState from '@/components/common/EmptyState';
import SectionHeader from '@/components/common/SectionHeader';
import TaskCard from '@/components/tasks/TaskCard';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';

function TasksPage() {
    const {
        activeMutationKey,
        errorMessage,
        isLoading,
        isSaving,
        memberOptions,
        members,
        projectOptions,
        projects,
        releaseOptions,
        releases,
        removeTask,
        saveTask,
        tasks,
    } = useWorkspaceContext();

    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        projectId: 'All',
        assigneeId: 'All',
    });
    const [activeTask, setActiveTask] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const memberMap = useMemo(() => Object.fromEntries(members.map((member) => [member.id, member])), [members]);
    const projectMap = useMemo(() => Object.fromEntries(projects.map((project) => [project.id, project])), [projects]);
    const taskReleaseOptions = useMemo(() => releases.map((release) => ({ label: `${release.version} · ${release.name}`, value: release.id })), [releases]);

    const filteredTasks = useMemo(() => {
        const searchValue = filters.search.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !searchValue ||
                task.title.toLowerCase().includes(searchValue) ||
                task.summary.toLowerCase().includes(searchValue);

            return (
                matchesSearch &&
                (filters.status === 'All' || task.status === filters.status) &&
                (filters.projectId === 'All' || task.projectId === filters.projectId) &&
                (filters.assigneeId === 'All' || task.assigneeId === filters.assigneeId)
            );
        });
    }, [filters, tasks]);

    function handleFilterChange(fieldName, value) {
        setFilters((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    async function handleSubmit(payload, taskId) {
        const result = await saveTask(payload, taskId);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });

        if (result.success) {
            setDialogOpen(false);
            setActiveTask(null);
        }
    }

    async function handleDelete(task) {
        const result = await removeTask(task.id);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });
    }

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Tasks"
                title="Delivery board"
                description="Track execution, ownership, release linkage, and project alignment across the entire workspace."
                action={
                    <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
                        New task
                    </Button>
                }
            />

            <Card>
                <CardContent>
                    <Stack spacing={2.5}>
                        <TaskFilters
                            assigneeOptions={memberOptions}
                            projectOptions={projectOptions}
                            filters={filters}
                            onChange={handleFilterChange}
                        />
                        {errorMessage ? <Alert severity="warning">{errorMessage}</Alert> : null}
                        {isLoading ? <Alert severity="info">Loading tasks from the delivery board...</Alert> : null}
                        {!isLoading && filteredTasks.length === 0 ? (
                            <EmptyState
                                title="No tasks match the current view"
                                description="Adjust the filters or create a new task linked to an existing project."
                            />
                        ) : (
                            <Grid container spacing={2.5}>
                                {filteredTasks.map((task) => (
                                    <Grid key={task.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                        <TaskCard
                                            task={task}
                                            assignee={memberMap[task.assigneeId]}
                                            project={projectMap[task.projectId]}
                                            isDeleting={activeMutationKey === task.id}
                                            onDelete={handleDelete}
                                            onEdit={(selectedTask) => {
                                                setActiveTask(selectedTask);
                                                setDialogOpen(true);
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <TaskFormDialog
                open={dialogOpen}
                task={activeTask}
                assigneeOptions={memberOptions}
                projectOptions={projectOptions}
                releaseOptions={taskReleaseOptions.length ? taskReleaseOptions : releaseOptions}
                isSaving={isSaving}
                onClose={() => {
                    setDialogOpen(false);
                    setActiveTask(null);
                }}
                onSubmit={handleSubmit}
            />

            <ActionSnackbar
                snackbar={snackbar}
                onClose={() => setSnackbar((currentState) => ({ ...currentState, open: false }))}
            />
        </Stack>
    );
}

export default TasksPage;
