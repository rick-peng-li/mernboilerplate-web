import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
    Alert,
    Button,
    Card,
    CardContent,
    Grid,
    Snackbar,
    Stack,
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectFormDialog from '@/components/projects/ProjectFormDialog';
import { useDashboardContext } from '@/app/useDashboardContext';

function ProjectsPage() {
    const {
        deletingId,
        errorMessage,
        health,
        isLoading,
        isSaving,
        projects,
        removeProject,
        saveProject,
    } = useDashboardContext();

    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
    });
    const [activeProject, setActiveProject] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const filteredProjects = useMemo(() => {
        const searchValue = filters.search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesStatus = filters.status === 'All' || project.status === filters.status;
            const matchesSearch =
                !searchValue ||
                project.title.toLowerCase().includes(searchValue) ||
                project.category.toLowerCase().includes(searchValue) ||
                project.summary.toLowerCase().includes(searchValue) ||
                project.stack.some((item) => item.toLowerCase().includes(searchValue));

            return matchesStatus && matchesSearch;
        });
    }, [filters, projects]);

    function handleFilterChange(fieldName, value) {
        setFilters((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    function openCreateDialog() {
        setActiveProject(null);
        setDialogOpen(true);
    }

    function openEditDialog(project) {
        setActiveProject(project);
        setDialogOpen(true);
    }

    function closeDialog() {
        setDialogOpen(false);
        setActiveProject(null);
    }

    async function handleSubmit(formValues, projectId) {
        const result = await saveProject(formValues, projectId);

        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });

        if (result.success) {
            closeDialog();
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
                title="Project management workspace"
                description="Create, update, filter, and remove project records through a modern Vite client connected to the upgraded Express API."
                action={
                    <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateDialog}>
                        New project
                    </Button>
                }
            />

            <Card>
                <CardContent>
                    <Stack spacing={2.5}>
                        <Stack
                            direction={{ xs: 'column', lg: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', lg: 'center' }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <InfoOutlinedIcon color="secondary" />
                                <Typography color="text.secondary">
                                    {errorMessage || `Data source: ${health.mode}. ${projects.length} project records currently loaded.`}
                                </Typography>
                            </Stack>
                            <ProjectFilters filters={filters} onChange={handleFilterChange} />
                        </Stack>

                        {isLoading ? (
                            <Alert severity="info">Loading the latest projects from the API...</Alert>
                        ) : null}

                        {!isLoading && filteredProjects.length === 0 ? (
                            <Alert severity="warning">
                                No projects match the current filters. Try clearing the search field or adding a new project.
                            </Alert>
                        ) : null}

                        <Grid container spacing={2.5}>
                            {filteredProjects.map((project) => (
                                <Grid key={project.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                    <ProjectCard
                                        project={project}
                                        isDeleting={deletingId === project.id}
                                        onEdit={openEditDialog}
                                        onDelete={handleDelete}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>

            <ProjectFormDialog
                open={dialogOpen}
                project={activeProject}
                isSaving={isSaving}
                onClose={closeDialog}
                onSubmit={handleSubmit}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3200}
                onClose={() => setSnackbar((currentState) => ({ ...currentState, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default ProjectsPage;
