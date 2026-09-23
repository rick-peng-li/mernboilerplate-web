import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { initialTaskValues, mapTaskToFormValues, normalizeTaskPayload } from '@/utils/form-models';
import { projectPriorityOptions, taskStatusOptions } from '@/utils/workspace-options';

function TaskFormDialog({ assigneeOptions, open, projectOptions, releaseOptions, task, isSaving, onClose, onSubmit }) {
    const [formValues, setFormValues] = useState(initialTaskValues);
    const dialogTitle = useMemo(() => (task ? 'Edit task' : 'Create task'), [task]);

    useEffect(() => {
        if (open) {
            setFormValues(mapTaskToFormValues(task));
        }
    }, [open, task]);

    function handleFieldChange(fieldName, value) {
        setFormValues((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await onSubmit(normalizeTaskPayload(formValues), task?.id);
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent dividers>
                <Stack component="form" spacing={2.25} sx={{ mt: 0.5 }} onSubmit={handleSubmit}>
                    <TextField label="Task title" value={formValues.title} onChange={(event) => handleFieldChange('title', event.target.value)} required fullWidth />
                    <TextField label="Summary" value={formValues.summary} onChange={(event) => handleFieldChange('summary', event.target.value)} required multiline minRows={4} fullWidth />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField select label="Status" value={formValues.status} onChange={(event) => handleFieldChange('status', event.target.value)} fullWidth>
                            {taskStatusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField select label="Priority" value={formValues.priority} onChange={(event) => handleFieldChange('priority', event.target.value)} fullWidth>
                            {projectPriorityOptions.map((priority) => (
                                <MenuItem key={priority} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField select label="Project" value={formValues.projectId} onChange={(event) => handleFieldChange('projectId', event.target.value)} fullWidth>
                            {projectOptions.map((project) => (
                                <MenuItem key={project.value} value={project.value}>
                                    {project.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField select label="Assignee" value={formValues.assigneeId} onChange={(event) => handleFieldChange('assigneeId', event.target.value)} fullWidth>
                            {assigneeOptions.map((member) => (
                                <MenuItem key={member.value} value={member.value}>
                                    {member.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField select label="Release" value={formValues.releaseId} onChange={(event) => handleFieldChange('releaseId', event.target.value)} fullWidth>
                            <MenuItem value="">No release</MenuItem>
                            {releaseOptions.map((release) => (
                                <MenuItem key={release.value} value={release.value}>
                                    {release.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Estimate" type="number" value={formValues.estimate} onChange={(event) => handleFieldChange('estimate', event.target.value)} inputProps={{ min: 0 }} fullWidth />
                        <TextField label="Due date" type="date" value={formValues.dueDate} onChange={(event) => handleFieldChange('dueDate', event.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
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

export default TaskFormDialog;
