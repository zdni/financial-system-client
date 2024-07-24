// @mui
import { MenuItem, Checkbox, FormControl, Typography } from '@mui/material'
import Select from '@mui/material/Select'

// ----------------------------------------------------------------------

const OPTIONS = ['0 - 1 Hour', '1 - 3 Hours', '3 - 6 Hours', '6 - 18 Hours', '18+ Hours']

const inputStyle = {
  '& .MuiFilledInput-input': { py: 2 },
}

const ITEM_HEIGHT = 40

const MenuProps = {
  PaperProps: {
    sx: {
      px: 1,
      maxHeight: ITEM_HEIGHT * 5,
      '& .MuiList-root': {
        py: 0.5,
      },
    },
  },
}

// ----------------------------------------------------------------------

export default function FilterSelect({ filterSelect, onChangeSelect, placeholder = 'Placeholder' }) {
  return (
    <FormControl fullWidth variant="filled" sx={{ ...inputStyle }}>
      <Select
        multiple
        displayEmpty
        value={filterSelect}
        onChange={onChangeSelect}
        MenuProps={MenuProps}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {placeholder}
            </Typography>
          }
          return (
            <Typography variant="subtitle2" component="span">
              {selected.join(', ')}
            </Typography>
          )
        }}
      >
        {OPTIONS.map((option) => (
          <MenuItem key={option} value={option} sx={{ p: 0, my: 0.5 }}>
            <Checkbox size="small" checked={filterSelect.includes(option)} />
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
