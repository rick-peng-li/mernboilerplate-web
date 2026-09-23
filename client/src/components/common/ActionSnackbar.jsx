import { Alert, Snackbar } from '@mui/material';

function ActionSnackbar({ snackbar, onClose }) {
    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={3200}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert severity={snackbar.severity} variant="filled" onClose={onClose}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
}

export default ActionSnackbar;
