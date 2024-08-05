import { useState } from 'react';

// @mui
import {
  Stack,
  Button,
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

// ----------------------------------------------------------------------

const TYPE = {
  'pdf': 'PDF',
  'excel': 'Excel'
}
const SERVER_URL = process.env.REACT_APP_SERVER_URL

export default function TableRowDetail({
  onDeleteRow,
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
                <a href={`${SERVER_URL}/exports/${row.name}`} download>{row.name}</a>
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          <Label 
            variant="soft"
            color={ row.document_type === 'pdf' ? 'error' : 'success' }
          >
            {TYPE[row.document_type]}
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
        content="Apakah Anda yakin ingin menghapus File Export?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Hapus
          </Button>
        }
      />
    </>
  )
}
