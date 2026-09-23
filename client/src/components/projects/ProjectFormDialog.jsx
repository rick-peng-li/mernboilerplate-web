import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { initialProjectFormValues, mapProjectToFormValues, normalizeProjectPayload } from '@/utils/project-form';
import { projectStatusOptions } from '@/utils/project-status';

function ProjectFormDialog({ project, open, isSaving, onClose, onSubmit }) {
    const [formValues, setFormValues] = useState(initialProjectFormValues);
    const dialogTitle = useMemo(() => (project ? 'Edit project' : 'Create project'), [project]);

    useEffect(() => {
        if (open) {
            setFormValues(mapProjectToFormValues(project));
        }
    }, [open, project]);

    function handleFieldChange(fieldName, value) {
        setFormValues((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await onSubmit(normalizeProjectPayload(formValues), project?.id);
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent dividers>
                <Stack component="form" spacing={2.25} onSubmit={handleSubmit} sx={{ mt: 0.5 }}>
                    <TextField
                        label="Title"
                        value={formValues.title}
                        onChange={(event) => handleFieldChange('title', event.target.value)}
                        required
                        fullWidth
                    />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField
                            label="Category"
                            value={formValues.category}
                            onChange={(event) => handleFieldChange('category', event.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            select
                            label="Status"
                            value={formValues.status}
                            onChange={(event) => handleFieldChange('status', event.target.value)}
                            fullWidth
                        >
                            {projectStatusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <TextField
                        label="Summary"
                        value={formValues.summary}
                        onChange={(event) => handleFieldChange('summary', event.target.value)}
                        required
                        fullWidth
                        multiline
                        minRows={4}
                    />
                    <TextField
                        label="Stack"
                        value={formValues.stack}
                        onChange={(event) => handleFieldChange('stack', event.target.value)}
                        placeholder="React 19, Vite 8, Express 5"
                        fullWidth
                    />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField
                            label="Repository URL"
                            value={formValues.repoUrl}
                            onChange={(event) => handleFieldChange('repoUrl', event.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Demo URL"
                            value={formValues.demoUrl}
                            onChange={(event) => handleFieldChange('demoUrl', event.target.value)}
                            fullWidth
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="text" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? 'Saving...' : dialogTitle}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProjectFormDialog;
