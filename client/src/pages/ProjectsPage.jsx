import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Alert, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import ActionSnackbar from '@/components/common/ActionSnackbar';
import EmptyState from '@/components/common/EmptyState';
import SectionHeader from '@/components/common/SectionHeader';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectFormDialog from '@/components/projects/ProjectFormDialog';

function ProjectsPage() {
    const {
        activeMutationKey,
        errorMessage,
        isLoading,
        isSaving,
        memberOptions,
        members,
        projects,
        removeProject,
        saveProject,
    } = useWorkspaceContext();

    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        priority: 'All',
        category: 'All',
    });
    const [activeProject, setActiveProject] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const memberMap = useMemo(() => Object.fromEntries(members.map((member) => [member.id, member])), [members]);
    const categories = useMemo(() => [...new Set(projects.map((project) => project.category))], [projects]);

    const filteredProjects = useMemo(() => {
        const searchValue = filters.search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesSearch =
                !searchValue ||
                project.title.toLowerCase().includes(searchValue) ||
                project.summary.toLowerCase().includes(searchValue) ||
                project.category.toLowerCase().includes(searchValue) ||
                project.stack.some((item) => item.toLowerCase().includes(searchValue));

            return (
                matchesSearch &&
                (filters.status === 'All' || project.status === filters.status) &&
                (filters.priority === 'All' || project.priority === filters.priority) &&
                (filters.category === 'All' || project.category === filters.category)
            );
        });
    }, [filters, projects]);

    function handleFilterChange(fieldName, value) {
        setFilters((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    function handleCreate() {
        setActiveProject(null);
        setDialogOpen(true);
    }

    function handleEdit(project) {
        setActiveProject(project);
        setDialogOpen(true);
    }

    function handleCloseDialog() {
        setDialogOpen(false);
        setActiveProject(null);
    }

    async function handleSubmit(payload, projectId) {
        const result = await saveProject(payload, projectId);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });

        if (result.success) {
            handleCloseDialog();
        }
    }

    async function handleDelete(project) {
        const result = await removeProject(project.id);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });
    }

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Projects"
                title="Project portfolio"
                description="Manage project scope, owners, members, delivery health, priorities, and linked workspace metadata from one page."
                action={
                    <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleCreate}>
                        New project
                    </Button>
                }
            />

            <Card>
                <CardContent>
                    <Stack spacing={2.5}>
                        <ProjectFilters filters={filters} onChange={handleFilterChange} categories={categories} />
                        {errorMessage ? <Alert severity="warning">{errorMessage}</Alert> : null}
                        {isLoading ? <Alert severity="info">Loading project portfolio...</Alert> : null}
                        {!isLoading && filteredProjects.length === 0 ? (
                            <EmptyState
                                title="No projects match the current filters"
                                description="Try changing the filter set or create a new project to expand the portfolio."
                            />
                        ) : (
                            <Grid container spacing={2.5}>
                                {filteredProjects.map((project) => (
                                    <Grid key={project.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                        <ProjectCard
                                            project={project}
                                            owner={memberMap[project.ownerId]}
                                            isDeleting={activeMutationKey === project.id}
                                            onDelete={handleDelete}
                                            onEdit={handleEdit}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <ProjectFormDialog
                open={dialogOpen}
                project={activeProject}
                memberOptions={memberOptions}
                isSaving={isSaving}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />

            <ActionSnackbar
                snackbar={snackbar}
                onClose={() => setSnackbar((currentState) => ({ ...currentState, open: false }))}
            />
        </Stack>
    );
}

export default ProjectsPage;
