import { Chip } from '@mui/material';
import { statusColorMap } from '@/utils/workspace-options';

function StatusChip({ label, variant = 'filled' }) {
    return <Chip label={label} color={statusColorMap[label] || 'default'} size="small" variant={variant} />;
}

export default StatusChip;
