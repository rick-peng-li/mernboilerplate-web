import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Link,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/useAuth';

const roleOptions = ['Admin', 'Manager', 'Member'];

function getErrorMessage(error) {
    return error.response?.data?.message || error.message || 'Unable to create the account.';
}

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Member',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await register(formData);
            navigate('/', { replace: true });
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
                    'radial-gradient(circle at top left, rgba(139,92,246,0.24), transparent 32%), radial-gradient(circle at bottom, rgba(34,211,238,0.16), transparent 28%)',
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 560 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack spacing={3}>
                        <Stack spacing={1.25}>
                            <Chip label="Registration" color="secondary" sx={{ width: 'fit-content' }} />
                            <Typography variant="h3">Create a workspace account</Typography>
                            <Typography color="text.secondary">
                                Register a new operator to enter the protected console and start working with the shared modules.
                            </Typography>
                        </Stack>

                        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                            <TextField
                                label="Name"
                                value={formData.name}
                                onChange={handleChange('name')}
                                required
                                fullWidth
                            />
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
                                helperText="Use at least 8 characters with uppercase, lowercase, and a number."
                                value={formData.password}
                                onChange={handleChange('password')}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Role"
                                select
                                value={formData.role}
                                onChange={handleChange('role')}
                                fullWidth
                            >
                                {roleOptions.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<PersonAddAltRoundedIcon />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating account...' : 'Create account'}
                            </Button>
                        </Stack>

                        <Typography color="text.secondary">
                            Already registered?{' '}
                            <Link component={RouterLink} to="/login" underline="hover">
                                Sign in
                            </Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default RegisterPage;
