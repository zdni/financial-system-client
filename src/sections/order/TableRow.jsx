// @mui
import {
  TableRow,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material'
// utils
import { fDate } from '../../utils/formatTime'
// components
import Label from '../../components/label/Label'
import Iconify from '../../components/iconify'

// ----------------------------------------------------------------------

const LABEL_OF_STATUS = {
  draft: 'Diajukan',
  process: 'Dipinjam',
  done: 'Selesai',
  cancel: 'Dibatalkan',
}

export default function OrderTableRow({
  row,
  onViewRow,
}) {
  const { date, documentId, qty, status, userId } = row
  const dueDate = date?.return || new Date()

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {userId.name}
          </Typography>
        </TableCell>

        <TableCell align="left">{documentId.title}</TableCell>
        <TableCell align="left">{fDate(date.start)}</TableCell>

        <TableCell align="center">{qty}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === 'draft' && 'secondary') ||
              (status === 'done' && (date.end > dueDate) && 'success') ||
              (status === 'done' && (date.end < dueDate) && 'warning') ||
              (status === 'cancel' && 'error') ||
              'info'
            }
          >
            {LABEL_OF_STATUS[status]} {(date.end < dueDate) ? ' | Terlambat' : ''}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={onViewRow}>
            <Iconify icon="eva:eye-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}
