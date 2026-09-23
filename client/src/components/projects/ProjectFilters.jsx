import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import { projectStatusOptions } from '@/utils/project-status';

function ProjectFilters({ filters, onChange }) {
    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
                label="Search projects"
                value={filters.search}
                onChange={(event) => onChange('search', event.target.value)}
                placeholder="Search by title, category, or stack"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                label="Status"
                value={filters.status}
                onChange={(event) => onChange('status', event.target.value)}
                select
                sx={{ minWidth: { xs: '100%', md: 220 } }}
            >
                <MenuItem value="All">All statuses</MenuItem>
                {projectStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                        {status}
                    </MenuItem>
                ))}
            </TextField>
        </Stack>
    );
}

export default ProjectFilters;
