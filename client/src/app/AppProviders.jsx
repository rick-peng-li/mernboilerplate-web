import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '@/app/AuthContext';
import theme from '@/styles/theme';

function AppProviders({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
    );
}

export default AppProviders;
