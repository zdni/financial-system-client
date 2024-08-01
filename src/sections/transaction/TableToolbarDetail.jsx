// @mui
import { Stack, InputAdornment, TextField, Button } from '@mui/material'
// components
import Iconify from '../../components/iconify'

// ----------------------------------------------------------------------

export default function TableToolbarDetail({
  isFiltered,
  filterAccount,
  onFilterAccount,
  filterVendor,
  onFilterVendor,
  onResetFilter,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >

      <TextField
        fullWidth
        value={filterAccount}
        onChange={onFilterAccount}
        placeholder="Cari Akun..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        value={filterVendor}
        onChange={onFilterVendor}
        placeholder="Cari Vendor..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  )
}
