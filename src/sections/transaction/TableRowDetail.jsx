import { useState } from 'react';

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
import MenuPopover from '../../components/menu-popover'
// utils
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function TableRowDetail({
  onDeleteRow,
  onEditRow,
  onSelectRow,
  row,
  selected,
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
            <div>
              <Typography variant="subtitle2" noWrap>
                {row.label}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Typography variant="subtitle2" noWrap>
                {row.accountId?.name}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Typography variant="subtitle2" noWrap>
                {row.vendorId?.name}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="right">
          {
            row.accountId.account_type === 'income' &&
            <Label 
              variant="soft"
              color='primary'
            >
              {fCurrency(row.debit)}
            </Label>
          }
        </TableCell>

        <TableCell align="right">
          {
            row.accountId.account_type === 'expense' &&
            <Label 
              variant="soft"
              color='warning'
            >
              {fCurrency(row.credit)}
            </Label>
          }
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
