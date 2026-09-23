import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Link,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/useAuth';

function getErrorMessage(error) {
    return error.response?.data?.message || error.message || 'Unable to sign in.';
}

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: 'admin@mernconsole.dev',
        password: 'Admin@123456',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await login(formData);
            navigate(location.state?.from?.pathname || '/', { replace: true });
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleChange(fieldName) {
        return (event) => {
            setFormData((currentState) => ({
                ...currentState,
                [fieldName]: event.target.value,
            }));
        };
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                px: 2,
                py: 4,
                background:
                    'radial-gradient(circle at top, rgba(34,211,238,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(139,92,246,0.2), transparent 34%)',
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 520 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack spacing={3}>
                        <Stack spacing={1.25}>
                            <Chip label="Authentication" color="secondary" sx={{ width: 'fit-content' }} />
                            <Typography variant="h3">Sign in to the workspace</Typography>
                            <Typography color="text.secondary">
                                Access projects, tasks, releases, analytics, and settings through the protected console.
                            </Typography>
                        </Stack>

                        <Alert severity="info" variant="outlined">
                            Demo account: <strong>admin@mernconsole.dev</strong> / <strong>Admin@123456</strong>
                        </Alert>

                        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange('password')}
                                required
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<LoginRoundedIcon />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </Stack>

                        <Typography color="text.secondary">
                            Need an account?{' '}
                            <Link component={RouterLink} to="/register" underline="hover">
                                Create one
                            </Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default LoginPage;
