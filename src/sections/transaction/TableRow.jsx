import { useNavigate } from 'react-router-dom'
// @mui
import {
  Stack,
  Checkbox,
  TableRow,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material'
// utils
// components
import Iconify from '../../components/iconify'
// utils
import { fDate } from '../../utils/formatTime';
import Label from '../../components/label/Label'
import { PATH_DASHBOARD } from '../../routes/paths'

// ----------------------------------------------------------------------

const OPTION_STATE = {
  'draft': 'Draft',
  'posted': 'Post',
  'cancel': 'Batal'
}

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
}) {
  const navigate = useNavigate()

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Typography variant="subtitle2" noWrap>
                {fDate(row.date)}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          <Label 
            variant="soft"
            color={
              (row.state === 'draft' && 'success') ||
              (row.state === 'posted' && 'info') ||
              (row.state === 'expense' && 'warning')  ||
              ('default')
            }
          >
            {OPTION_STATE[row.state]}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color='info' onClick={() => navigate(`${PATH_DASHBOARD.transaction.root}/${row._id}`)}>
            <Iconify icon="eva:eye-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}
