import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import ActionSnackbar from '@/components/common/ActionSnackbar';
import SectionHeader from '@/components/common/SectionHeader';
import SettingsForm from '@/components/settings/SettingsForm';

function SettingsPage() {
    const { isSaving, saveSettings, settings } = useWorkspaceContext();
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    async function handleSubmit(payload) {
        const result = await saveSettings(payload);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });
    }

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Settings"
                title="Workspace settings"
                description="Control default view, timezone, digest cadence, release windows, and notification preferences."
            />

            <SettingsForm settings={settings} isSaving={isSaving} onSubmit={handleSubmit} />

            <Card>
                <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="h6">How this module connects to the rest of the workspace</Typography>
                        <Typography color="text.secondary">
                            Settings influence dashboard defaults, release review timing, daily operational notifications, and the presentation of shared workspace metadata across other modules.
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>

            <ActionSnackbar
                snackbar={snackbar}
                onClose={() => setSnackbar((currentState) => ({ ...currentState, open: false }))}
            />
        </Stack>
    );
}

export default SettingsPage;
