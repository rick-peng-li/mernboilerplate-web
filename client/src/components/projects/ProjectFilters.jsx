import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import { projectPriorityOptions, projectStatusOptions } from '@/utils/workspace-options';

function ProjectFilters({ filters, onChange, categories }) {
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
            <TextField
                label="Priority"
                value={filters.priority}
                onChange={(event) => onChange('priority', event.target.value)}
                select
                sx={{ minWidth: { xs: '100%', md: 180 } }}
            >
                <MenuItem value="All">All priorities</MenuItem>
                {projectPriorityOptions.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                        {priority}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Category"
                value={filters.category}
                onChange={(event) => onChange('category', event.target.value)}
                select
                sx={{ minWidth: { xs: '100%', md: 220 } }}
            >
                <MenuItem value="All">All categories</MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                        {category}
                    </MenuItem>
                ))}
            </TextField>
        </Stack>
    );
}

export default ProjectFilters;
