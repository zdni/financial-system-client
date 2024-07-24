import searchIcon from '@iconify/icons-carbon/search'
// @mui
import { InputAdornment, FilledInput } from '@mui/material'
//
import Iconify from '../iconify'

// ----------------------------------------------------------------------

export default function SearchInput({ sx, ...other }) {
  return (
    <FilledInput
      fullWidth
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon={searchIcon} sx={{ width: 24, height: 24 }} />
        </InputAdornment>
      }
      placeholder="Cari..."
      sx={{
        '& .MuiFilledInput-input': { py: '18px' },
        ...sx,
      }}
      {...other}
    />
  )
}
