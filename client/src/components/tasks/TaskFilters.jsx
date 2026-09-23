import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { taskStatusOptions } from '@/utils/workspace-options';

function TaskFilters({ assigneeOptions, filters, onChange, projectOptions }) {
    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
                label="Search tasks"
                value={filters.search}
                onChange={(event) => onChange('search', event.target.value)}
                placeholder="Search by title or summary"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                fullWidth
            />
            <TextField select label="Status" value={filters.status} onChange={(event) => onChange('status', event.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="All">All statuses</MenuItem>
                {taskStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                        {status}
                    </MenuItem>
                ))}
            </TextField>
            <TextField select label="Project" value={filters.projectId} onChange={(event) => onChange('projectId', event.target.value)} sx={{ minWidth: 220 }}>
                <MenuItem value="All">All projects</MenuItem>
                {projectOptions.map((project) => (
                    <MenuItem key={project.value} value={project.value}>
                        {project.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField select label="Assignee" value={filters.assigneeId} onChange={(event) => onChange('assigneeId', event.target.value)} sx={{ minWidth: 220 }}>
                <MenuItem value="All">All assignees</MenuItem>
                {assigneeOptions.map((member) => (
                    <MenuItem key={member.value} value={member.value}>
                        {member.label}
                    </MenuItem>
                ))}
            </TextField>
        </Stack>
    );
}

export default TaskFilters;
