// @mui
import { Checkbox, Typography, Stack } from '@mui/material'

// ----------------------------------------------------------------------

export default function TableSelectedAction({
  action,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  ...other
}) {
  if (!numSelected) {
    return null
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 38,
        position: 'absolute',
        bgcolor: 'primary.lighter',
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSelectAllRows(event.target.checked)
        }
      />

      <Typography
        variant="subtitle1"
        sx={{
          ml: 3,
          flexGrow: 1,
          color: 'primary.main',
        }}
      >
        {numSelected} selected
      </Typography>

      {action && action}
    </Stack>
  )
}
