import { alpha, createTheme } from '@mui/material/styles';

const theme = createTheme({
    cssVariables: true,
    palette: {
        mode: 'dark',
        primary: {
            main: '#8b5cf6',
        },
        secondary: {
            main: '#22d3ee',
        },
        background: {
            default: '#050816',
            paper: '#10172b',
        },
        success: {
            main: '#34d399',
        },
        warning: {
            main: '#fbbf24',
        },
    },
    shape: {
        borderRadius: 20,
    },
    typography: {
        fontFamily: '"Inter", "SF Pro Display", "Segoe UI", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 700,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#ffffff', 0.08)}`,
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    textTransform: 'none',
                    fontWeight: 700,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;
