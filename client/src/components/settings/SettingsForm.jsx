import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { Button, Card, CardContent, FormControlLabel, Grid, Stack, Switch, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { normalizeSettingsPayload } from '@/utils/form-models';

function SettingsForm({ isSaving, settings, onSubmit }) {
    const [formValues, setFormValues] = useState(settings);

    useEffect(() => {
        setFormValues(settings);
    }, [settings]);

    if (!formValues) {
        return null;
    }

    function handleFieldChange(fieldName, value) {
        setFormValues((currentState) => ({
            ...currentState,
            [fieldName]: value,
        }));
    }

    function handleNotificationChange(fieldName, checked) {
        setFormValues((currentState) => ({
            ...currentState,
            notifications: {
                ...currentState.notifications,
                [fieldName]: checked,
            },
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await onSubmit(normalizeSettingsPayload(formValues));
    }

    return (
        <Card>
            <CardContent>
                <Stack component="form" spacing={3} onSubmit={handleSubmit}>
                    <Typography variant="h5">Workspace preferences</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Workspace name" value={formValues.workspaceName} onChange={(event) => handleFieldChange('workspaceName', event.target.value)} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Default view" value={formValues.defaultView} onChange={(event) => handleFieldChange('defaultView', event.target.value)} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Timezone" value={formValues.timezone} onChange={(event) => handleFieldChange('timezone', event.target.value)} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Daily digest time" value={formValues.dailyDigestTime} onChange={(event) => handleFieldChange('dailyDigestTime', event.target.value)} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField label="Release window" value={formValues.releaseWindow} onChange={(event) => handleFieldChange('releaseWindow', event.target.value)} fullWidth />
                        </Grid>
                    </Grid>

                    <Stack spacing={1}>
                        <Typography variant="h6">Notifications</Typography>
                        <FormControlLabel control={<Switch checked={formValues.notifications.email} onChange={(event) => handleNotificationChange('email', event.target.checked)} />} label="Email digests" />
                        <FormControlLabel control={<Switch checked={formValues.notifications.slack} onChange={(event) => handleNotificationChange('slack', event.target.checked)} />} label="Slack channel updates" />
                        <FormControlLabel control={<Switch checked={formValues.notifications.browser} onChange={(event) => handleNotificationChange('browser', event.target.checked)} />} label="Browser reminders" />
                    </Stack>

                    <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} disabled={isSaving} sx={{ alignSelf: 'flex-start' }}>
                        {isSaving ? 'Saving...' : 'Save settings'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default SettingsForm;
