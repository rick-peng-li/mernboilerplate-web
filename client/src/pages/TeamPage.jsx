import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import { Alert, Button, Card, CardContent, Grid, Stack, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useWorkspaceContext } from '@/app/useWorkspaceContext';
import ActionSnackbar from '@/components/common/ActionSnackbar';
import EmptyState from '@/components/common/EmptyState';
import SectionHeader from '@/components/common/SectionHeader';
import MemberCard from '@/components/team/MemberCard';
import MemberFormDialog from '@/components/team/MemberFormDialog';

function TeamPage() {
    const {
        activeMutationKey,
        errorMessage,
        isLoading,
        isSaving,
        members,
        removeMember,
        saveMember,
    } = useWorkspaceContext();

    const [search, setSearch] = useState('');
    const [activeMember, setActiveMember] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const filteredMembers = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return members.filter((member) => {
            if (!searchValue) {
                return true;
            }

            return (
                member.name.toLowerCase().includes(searchValue) ||
                member.role.toLowerCase().includes(searchValue) ||
                member.skills.some((skill) => skill.toLowerCase().includes(searchValue))
            );
        });
    }, [members, search]);

    async function handleSubmit(payload, memberId) {
        const result = await saveMember(payload, memberId);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });

        if (result.success) {
            setDialogOpen(false);
            setActiveMember(null);
        }
    }

    async function handleDelete(member) {
        const result = await removeMember(member.id);
        setSnackbar({
            open: true,
            severity: result.success ? 'success' : 'error',
            message: result.message,
        });
    }

    return (
        <Stack spacing={4}>
            <SectionHeader
                eyebrow="Team"
                title="Team directory"
                description="Manage people, capacity, skill coverage, and workspace ownership across projects and releases."
                action={
                    <Button variant="contained" startIcon={<GroupAddRoundedIcon />} onClick={() => setDialogOpen(true)}>
                        Add member
                    </Button>
                }
            />

            <Card>
                <CardContent>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Search team members"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name, role, or skill"
                        />
                        {errorMessage ? <Alert severity="warning">{errorMessage}</Alert> : null}
                        {isLoading ? <Alert severity="info">Loading team directory...</Alert> : null}
                        {!isLoading && filteredMembers.length === 0 ? (
                            <EmptyState title="No members found" description="Try a different keyword or add a new member to the workspace team." />
                        ) : (
                            <Grid container spacing={2.5}>
                                {filteredMembers.map((member) => (
                                    <Grid key={member.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                        <MemberCard
                                            member={member}
                                            isDeleting={activeMutationKey === member.id}
                                            onDelete={handleDelete}
                                            onEdit={(selectedMember) => {
                                                setActiveMember(selectedMember);
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

            <MemberFormDialog
                open={dialogOpen}
                member={activeMember}
                isSaving={isSaving}
                onClose={() => {
                    setDialogOpen(false);
                    setActiveMember(null);
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

export default TeamPage;
