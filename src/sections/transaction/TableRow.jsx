import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
// @mui
import {
  Stack,
  Checkbox,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Button,
  MenuItem,
  Divider,
} from '@mui/material'
// utils
// components
import Iconify from '../../components/iconify'
import Label from '../../components/label/Label'
import ConfirmDialog from '../../components/confirm-dialog';
import MenuPopover from '../../components/menu-popover';
import { useSnackbar } from '../../components/snackbar'
// utils
import { fDate } from '../../utils/formatTime';
import { PATH_DASHBOARD } from '../../routes/paths'

// ----------------------------------------------------------------------

const OPTION_STATE = {
  'draft': 'Draft',
  'posted': 'Post',
  'cancel': 'Batal'
}

export default function UserTableRow({
  onDeleteRow,
  onSelectRow,
  row,
  selected,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [openConfirm, setOpenConfirm] = useState(false)

  const [openPopover, setOpenPopover] = useState(null)

  const handleOpenConfirm = () => setOpenConfirm(true)
  const handleCloseConfirm = () => setOpenConfirm(false)

  const handleOpenPopover = (event) => setOpenPopover(event.currentTarget)
    const handleClosePopover = () => setOpenPopover(null)
  
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
              (row.state === 'cancel' && 'error')  ||
              ('default')
            }
          >
            {OPTION_STATE[row.state]}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={() => {
          navigate(`${PATH_DASHBOARD.transaction.root}/${row._id}`)
          handleClosePopover()
        }} >
          <Iconify icon="eva:eye-fill" />
          Lihat
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            if(row.state === 'posted') {
              enqueueSnackbar("Transaksi harus dalam status Draft atau Batal untuk menghapus!", { variant: 'error' });
            } else {
              handleOpenConfirm()
            }
            handleClosePopover()
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Hapus
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Apakah Anda yakin ingin menghapus baris Transaksi?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Hapus
          </Button>
        }
      />
    </>
  )
}
