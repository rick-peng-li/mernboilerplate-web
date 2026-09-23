import { cloneElement, isValidElement } from 'react';
import { Box, Stack, Typography } from '@mui/material';

function SectionHeader({ eyebrow, title, description, action }) {
    const resolvedAction = isValidElement(action)
        ? cloneElement(action, {
              size: action.props.size || 'medium',
              sx: [
                  {
                      px: 1.5,
                      py: 0.625,
                      minHeight: 36,
                      height: 36,
                      fontSize: '0.875rem',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      borderRadius: 14,
                      '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                          margin: 0,
                      },
                      '& .MuiButton-startIcon': {
                          marginRight: 6,
                      },
                      '& .MuiButton-endIcon': {
                          marginLeft: 6,
                      },
                      '& .MuiButton-startIcon > *, & .MuiButton-endIcon > *': {
                          fontSize: '1rem',
                      },
                  },
                  ...(Array.isArray(action.props.sx) ? action.props.sx : action.props.sx ? [action.props.sx] : []),
              ],
          })
        : action;

    return (
        <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 3, width: '100%' }}>
            <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
                {eyebrow ? (
                    <Typography variant="caption" sx={{ color: 'secondary.main', letterSpacing: 2, textTransform: 'uppercase' }}>
                        {eyebrow}
                    </Typography>
                ) : null}
                <Typography variant="h4">{title}</Typography>
                {description ? (
                    <Typography variant="body1" color="text.secondary" maxWidth={720}>
                        {description}
                    </Typography>
                ) : null}
            </Stack>
            {resolvedAction ? (
                <Box
                    sx={{
                        ml: 'auto',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        flexShrink: 0,
                        pt: 0.25,
                    }}
                >
                    {resolvedAction}
                </Box>
            ) : null}
        </Stack>
    );
}

export default SectionHeader;
