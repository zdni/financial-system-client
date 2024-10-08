import { useState } from 'react'
// @mui
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material'
// utils
// components
import ConfirmDialog from '../../components/confirm-dialog'
import Iconify from '../../components/iconify'
import Label from '../../components/label/Label'
import { CustomAvatar } from '../../components/custom-avatar'
import MenuPopover from '../../components/menu-popover'

// ----------------------------------------------------------------------
const LABEL_OF_TYPE = {
  income: 'Income',
  expense: 'Expense',
}

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}) {
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
            <CustomAvatar name={row.name} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>

            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (row.account_type === 'income' && 'success') ||
              (row.account_type === 'expense' && 'primary')
            }
          >
            {LABEL_OF_TYPE[row.account_type]}
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
        <MenuItem
          onClick={() => {
            onEditRow()
            handleClosePopover()
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Ubah
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm()
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
        content="Apakah Anda yakin ingin menghapus Akun?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Hapus
          </Button>
        }
      />
    </>
  )
}
