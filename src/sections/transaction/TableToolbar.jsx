// @mui
import { Stack, InputAdornment, TextField, Button } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../components/iconify'

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

export default function InvoiceTableToolbar({
  isFiltered,
  filterEndDate,
  filterAccount,
  filterStartDate,
  filterVendor,
  onFilterAccount,
  onFilterEndDate,
  onFilterStartDate,
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

      <DatePicker
        label="Tanggal Awal"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label="Tanggal Akhir"
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />
      
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
