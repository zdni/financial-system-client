import { Button, InputAdornment, Stack, TextField } from "@mui/material"
import Iconify from "../../components/iconify/Iconify"

export default function TableToolbar({
    filterName,
    isFiltered,
    onFilterName,
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
          value={filterName}
          onChange={onFilterName}
          placeholder="Pencarian"
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
            Reset
          </Button>
        )}
      </Stack>
    )
  }