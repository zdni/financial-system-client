// @mui
import { Skeleton, Stack, Paper, Box } from '@mui/material'

const  DocumentItemSkeleton = ({ ...other }) => {
  return (
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Skeleton variant="text" sx={{ height: 20, width: 100, bgcolor: 'background.paper', mb: 2 }} />
            <Skeleton variant="text" sx={{ height: 20, width: 100, bgcolor: 'background.paper', mt: 0.5 }} />
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3} sx={{ color: 'text.secondary' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" sx={{ height: 20, width: 20, bgcolor: 'background.paper' }} />
            <Skeleton variant="text" sx={{ height: 20, width: 80, bgcolor: 'background.paper' }} />
          </Stack>
        </Stack>
      </Stack>

      <Box sx={{ p: 1, position: 'relative' }}>
        <Skeleton variant="rectangular" sx={{ width: 1, bgcolor: 'background.paper', borderRadius: 1.5}} />
      </Box>
    </Paper>
  )
}

export default DocumentItemSkeleton