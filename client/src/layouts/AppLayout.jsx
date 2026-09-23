import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TaskRoundedIcon from '@mui/icons-material/TaskRounded';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/useAuth';
import { useWorkspaceData } from '@/hooks/useWorkspaceData';

const navigationItems = [
    {
        label: 'Overview',
        to: '/',
        icon: <DashboardRoundedIcon fontSize="small" />,
    },
    {
        label: 'Projects',
        to: '/projects',
        icon: <FolderOpenRoundedIcon fontSize="small" />,
    },
    {
        label: 'Tasks',
        to: '/tasks',
        icon: <TaskRoundedIcon fontSize="small" />,
    },
    {
        label: 'Team',
        to: '/team',
        icon: <GroupsRoundedIcon fontSize="small" />,
    },
    {
        label: 'Releases',
        to: '/releases',
        icon: <RocketLaunchRoundedIcon fontSize="small" />,
    },
    {
        label: 'Activity',
        to: '/activity',
        icon: <HistoryRoundedIcon fontSize="small" />,
    },
    {
        label: 'Analytics',
        to: '/analytics',
        icon: <BarChartRoundedIcon fontSize="small" />,
    },
    {
        label: 'Settings',
        to: '/settings',
        icon: <SettingsRoundedIcon fontSize="small" />,
    },
];

function AppLayout() {
    const workspace = useWorkspaceData();
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isSigningOut, setIsSigningOut] = useState(false);

    async function handleLogout() {
        setIsSigningOut(true);

        try {
            await logout();
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', pb: 8 }}>
            <AppBar
                position="sticky"
                color="transparent"
                elevation={0}
                sx={{
                    backdropFilter: 'blur(22px)',
                    backgroundColor: 'rgba(5, 8, 22, 0.72)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Toolbar sx={{ minHeight: 80 }}>
                    <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 3,
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: 'linear-gradient(135deg, rgba(139,92,246,0.95), rgba(34,211,238,0.9))',
                                }}
                            >
                                <AutoAwesomeRoundedIcon />
                            </Box>
                            <Box>
                                <Typography variant="h6">MERN Project Console</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Full-stack workspace built with current generation tooling
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {navigationItems.map((item) => (
                                <Button
                                    key={item.to}
                                    component={NavLink}
                                    to={item.to}
                                    startIcon={item.icon}
                                    variant={location.pathname === item.to ? 'contained' : 'text'}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main' }}>
                                    {user?.name?.charAt(0) || 'U'}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={700} noWrap>
                                        {user?.name || 'Workspace User'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {user?.role || 'Member'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Chip
                                label={`${workspace.health.mode} mode`}
                                color={workspace.health.mode === 'mongodb' ? 'success' : 'warning'}
                                variant="outlined"
                            />
                            <IconButton color="inherit" onClick={workspace.loadWorkspace} disabled={workspace.isLoading}>
                                <RefreshRoundedIcon />
                            </IconButton>
                            <Button variant="outlined" onClick={handleLogout} disabled={isSigningOut}>
                                {isSigningOut ? 'Signing out...' : 'Sign out'}
                            </Button>
                        </Stack>
                    </Container>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ pt: 5 }}>
                <Outlet context={workspace} />
            </Container>
        </Box>
    );
}

export default AppLayout;
