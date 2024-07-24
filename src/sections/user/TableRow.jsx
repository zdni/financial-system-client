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
import Iconify from '../../components/iconify'
import Label from '../../components/label/Label'
import { CustomAvatar } from '../../components/custom-avatar'
import MenuPopover from '../../components/menu-popover'
import ConfirmDialog from '../../components/confirm-dialog'

// ----------------------------------------------------------------------
const LABEL_OF_ROLE = {
  superadmin: 'Administrator',
  admin: 'Administrator',
  lecture: 'Dosen',
}
const LABEL_OF_STATUS = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
}

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  onResetPwd,
}) {
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openResetPwd, setOpenResetPwd] = useState(false)

  const [openPopover, setOpenPopover] = useState(null)

  const handleOpenConfirm = () => setOpenConfirm(true)
  const handleCloseConfirm = () => setOpenConfirm(false)

  const handleOpenResetPwd = () => setOpenResetPwd(true)
  const handleCloseResetPwd = () => setOpenResetPwd(false)

  const handleOpenPopover = (event) => setOpenPopover(event.currentTarget)
  const handleClosePopover = () => setOpenPopover(null)

  const handleSubmitResetPwd = () => {
    onResetPwd()
    handleCloseResetPwd()
  }

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

        <TableCell align="left">{LABEL_OF_ROLE[row.role]}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'inactive' && 'warning')
            }
          >
            {LABEL_OF_STATUS[row.status]}
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
            onViewRow()
            handleClosePopover()
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Lihat
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow()
            handleClosePopover()
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Ubah
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenResetPwd()
            handleClosePopover()
          }}
        >
          <Iconify icon="eva:refresh-outline" />
          Reset Pwd
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
        content="Apakah Anda yakin ingin menghapus Pengguna?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Hapus
          </Button>
        }
      />

      <ConfirmDialog
        open={openResetPwd}
        onClose={handleCloseResetPwd}
        title="Reset Password"
        content="Apakah Anda yakin ingin me-reset password Pengguna?"
        action={
          <Button variant="contained" color="error" onClick={handleSubmitResetPwd}>
            Reset
          </Button>
        }
      />
    </>
  )
}
