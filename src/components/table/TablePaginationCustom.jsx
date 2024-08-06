// @mui
import {
  Box,
  TablePagination,
} from '@mui/material'
//

// ----------------------------------------------------------------------

export default function TablePaginationCustom({
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination rowsPerPageOptions={rowsPerPageOptions} component="div" {...other} />
    </Box>
  )
}
