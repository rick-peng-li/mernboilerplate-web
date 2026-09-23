import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { initialMemberValues, mapMemberToFormValues, normalizeMemberPayload } from '@/utils/form-models';
import { memberStatusOptions } from '@/utils/workspace-options';

function MemberFormDialog({ member, open, isSaving, onClose, onSubmit }) {
    const [formValues, setFormValues] = useState(initialMemberValues);
    const dialogTitle = useMemo(() => (member ? 'Edit member' : 'Add member'), [member]);

    useEffect(() => {
        if (open) {
            setFormValues(mapMemberToFormValues(member));
        }
    }, [member, open]);

    function handleFieldChange(fieldName, value) {
        setFormValues((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await onSubmit(normalizeMemberPayload(formValues), member?.id);
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent dividers>
                <Stack component="form" spacing={2.25} sx={{ mt: 0.5 }} onSubmit={handleSubmit}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField label="Name" value={formValues.name} onChange={(event) => handleFieldChange('name', event.target.value)} required fullWidth />
                        <TextField label="Role" value={formValues.role} onChange={(event) => handleFieldChange('role', event.target.value)} required fullWidth />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField label="Email" value={formValues.email} onChange={(event) => handleFieldChange('email', event.target.value)} required fullWidth />
                        <TextField label="Location" value={formValues.location} onChange={(event) => handleFieldChange('location', event.target.value)} required fullWidth />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField label="Timezone" value={formValues.timezone} onChange={(event) => handleFieldChange('timezone', event.target.value)} required fullWidth />
                        <TextField select label="Status" value={formValues.status} onChange={(event) => handleFieldChange('status', event.target.value)} fullWidth>
                            {memberStatusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField label="Allocation" type="number" value={formValues.allocation} onChange={(event) => handleFieldChange('allocation', event.target.value)} inputProps={{ min: 0, max: 100 }} fullWidth />
                        <TextField label="Capacity" type="number" value={formValues.capacity} onChange={(event) => handleFieldChange('capacity', event.target.value)} inputProps={{ min: 0, max: 100 }} fullWidth />
                    </Stack>
                    <TextField label="Skills" value={formValues.skills} onChange={(event) => handleFieldChange('skills', event.target.value)} placeholder="React, Express, MongoDB" fullWidth />
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

export default MemberFormDialog;
