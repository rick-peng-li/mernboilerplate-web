import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
    initialProjectValues,
    mapProjectToFormValues,
    normalizeProjectPayload,
} from '@/utils/form-models';
import {
    projectHealthOptions,
    projectPriorityOptions,
    projectStatusOptions,
} from '@/utils/workspace-options';

function ProjectFormDialog({ project, memberOptions, open, isSaving, onClose, onSubmit }) {
    const [formValues, setFormValues] = useState(initialProjectValues);
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
                        <TextField
                            select
                            label="Priority"
                            value={formValues.priority}
                            onChange={(event) => handleFieldChange('priority', event.target.value)}
                            fullWidth
                        >
                            {projectPriorityOptions.map((priority) => (
                                <MenuItem key={priority} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField
                            select
                            label="Health"
                            value={formValues.health}
                            onChange={(event) => handleFieldChange('health', event.target.value)}
                            fullWidth
                        >
                            {projectHealthOptions.map((health) => (
                                <MenuItem key={health} value={health}>
                                    {health}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Progress"
                            type="number"
                            value={formValues.progress}
                            onChange={(event) => handleFieldChange('progress', event.target.value)}
                            inputProps={{ min: 0, max: 100 }}
                            fullWidth
                        />
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
                            select
                            label="Owner"
                            value={formValues.ownerId}
                            onChange={(event) => handleFieldChange('ownerId', event.target.value)}
                            fullWidth
                        >
                            {memberOptions.map((member) => (
                                <MenuItem key={member.value} value={member.value}>
                                    {member.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Due date"
                            type="date"
                            value={formValues.dueDate}
                            onChange={(event) => handleFieldChange('dueDate', event.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Stack>
                    <TextField
                        select
                        label="Project members"
                        value={formValues.memberIds}
                        onChange={(event) => handleFieldChange('memberIds', event.target.value)}
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {selected.map((memberId) => {
                                        const member = memberOptions.find((item) => item.value === memberId);
                                        return <Chip key={memberId} label={member?.label || memberId} size="small" />;
                                    })}
                                </Box>
                            ),
                        }}
                        fullWidth
                    >
                        {memberOptions.map((member) => (
                            <MenuItem key={member.value} value={member.value}>
                                {member.label}
                            </MenuItem>
                        ))}
                    </TextField>
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
