import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
    AppBar,
    Box,
    Button,
    Chip,
    Container,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useProjectDashboard } from '@/hooks/useProjectDashboard';

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
];

function AppLayout() {
    const dashboard = useProjectDashboard();
    const location = useLocation();

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
                            <Chip
                                label={`${dashboard.health.mode} mode`}
                                color={dashboard.health.mode === 'mongodb' ? 'success' : 'warning'}
                                variant="outlined"
                            />
                            <IconButton color="inherit" onClick={dashboard.loadDashboard} disabled={dashboard.isLoading}>
                                <RefreshRoundedIcon />
                            </IconButton>
                        </Stack>
                    </Container>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ pt: 5 }}>
                <Outlet context={dashboard} />
            </Container>
        </Box>
    );
}

export default AppLayout;
