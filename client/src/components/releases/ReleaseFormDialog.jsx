import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { initialReleaseValues, mapReleaseToFormValues, normalizeReleasePayload } from '@/utils/form-models';
import { releaseStatusOptions } from '@/utils/workspace-options';

function ReleaseFormDialog({ memberOptions, open, projectOptions, release, taskOptions, isSaving, onClose, onSubmit }) {
    const [formValues, setFormValues] = useState(initialReleaseValues);
    const dialogTitle = useMemo(() => (release ? 'Edit release' : 'Create release'), [release]);

    useEffect(() => {
        if (open) {
            setFormValues(mapReleaseToFormValues(release));
        }
    }, [open, release]);

    function handleFieldChange(fieldName, value) {
        setFormValues((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await onSubmit(normalizeReleasePayload(formValues), release?.id);
    }

    function renderMultiValue(selected, options) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {selected.map((value) => (
                    <Chip key={value} label={options.find((item) => item.value === value)?.label || value} size="small" />
                ))}
            </Box>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent dividers>
                <Stack component="form" spacing={2.25} sx={{ mt: 0.5 }} onSubmit={handleSubmit}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField label="Version" value={formValues.version} onChange={(event) => handleFieldChange('version', event.target.value)} required fullWidth />
                        <TextField label="Release name" value={formValues.name} onChange={(event) => handleFieldChange('name', event.target.value)} required fullWidth />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField select label="Status" value={formValues.status} onChange={(event) => handleFieldChange('status', event.target.value)} fullWidth>
                            {releaseStatusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField select label="Release owner" value={formValues.ownerId} onChange={(event) => handleFieldChange('ownerId', event.target.value)} fullWidth>
                            {memberOptions.map((member) => (
                                <MenuItem key={member.value} value={member.value}>
                                    {member.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <TextField label="Summary" value={formValues.summary} onChange={(event) => handleFieldChange('summary', event.target.value)} required multiline minRows={4} fullWidth />
                    <TextField label="Release date" type="date" value={formValues.releaseDate} onChange={(event) => handleFieldChange('releaseDate', event.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                    <TextField
                        select
                        label="Linked projects"
                        value={formValues.projectIds}
                        onChange={(event) => handleFieldChange('projectIds', event.target.value)}
                        SelectProps={{ multiple: true, renderValue: (selected) => renderMultiValue(selected, projectOptions) }}
                        fullWidth
                    >
                        {projectOptions.map((project) => (
                            <MenuItem key={project.value} value={project.value}>
                                {project.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Linked tasks"
                        value={formValues.taskIds}
                        onChange={(event) => handleFieldChange('taskIds', event.target.value)}
                        SelectProps={{ multiple: true, renderValue: (selected) => renderMultiValue(selected, taskOptions) }}
                        fullWidth
                    >
                        {taskOptions.map((task) => (
                            <MenuItem key={task.value} value={task.value}>
                                {task.label}
                            </MenuItem>
                        ))}
                    </TextField>
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

export default ReleaseFormDialog;
