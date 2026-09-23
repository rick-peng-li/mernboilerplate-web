import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Alert, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import ActionSnackbar from '@/components/common/ActionSnackbar';
import EmptyState from '@/components/common/EmptyState';
import SectionHeader from '@/components/common/SectionHeader';
import ReleaseCard from '@/components/releases/ReleaseCard';
import ReleaseFormDialog from '@/components/releases/ReleaseFormDialog';

function ReleasesPage() {
    const {
        activeMutationKey,
        errorMessage,
        isLoading,
        isSaving,
        memberOptions,
        members,
        projectOptions,
        projects,
        releases,
        removeRelease,
        saveRelease,
        tasks,
    } = useWorkspaceContext();

    const [activeRelease, setActiveRelease] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const memberMap = useMemo(() => Object.fromEntries(members.map((member) => [member.id, member])), [members]);
    const projectMap = useMemo(() => Object.fromEntries(projects.map((project) => [project.id, project])), [projects]);
    const taskOptions = useMemo(() => tasks.map((task) => ({ value: task.id, label: task.title })), [tasks]);

    async function handleSubmit(payload, releaseId) {
        const result = await saveRelease(payload, releaseId);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });

        if (result.success) {
            setDialogOpen(false);
            setActiveRelease(null);
        }
    }

    async function handleDelete(release) {
        const result = await removeRelease(release.id);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });
    }

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Releases"
                title="Release planning"
                description="Coordinate release packages, linked tasks, ownership, and delivery windows across multiple projects."
                action={
                    <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
                        New release
                    </Button>
                }
            />

            <Card>
                <CardContent>
                    <Stack spacing={2.5}>
                        {errorMessage ? <Alert severity="warning">{errorMessage}</Alert> : null}
                        {isLoading ? <Alert severity="info">Loading release plans...</Alert> : null}
                        {!isLoading && releases.length === 0 ? (
                            <EmptyState title="No releases available" description="Create the first release plan to connect projects and tasks." />
                        ) : (
                            <Grid container spacing={2.5}>
                                {releases.map((release) => (
                                    <Grid key={release.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                        <ReleaseCard
                                            release={release}
                                            owner={memberMap[release.ownerId]}
                                            projectNames={release.projectIds.map((projectId) => projectMap[projectId]?.title || projectId)}
                                            isDeleting={activeMutationKey === release.id}
                                            onDelete={handleDelete}
                                            onEdit={(selectedRelease) => {
                                                setActiveRelease(selectedRelease);
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

            <ReleaseFormDialog
                open={dialogOpen}
                release={activeRelease}
                memberOptions={memberOptions}
                projectOptions={projectOptions}
                taskOptions={taskOptions}
                isSaving={isSaving}
                onClose={() => {
                    setDialogOpen(false);
                    setActiveRelease(null);
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

export default ReleasesPage;
