import { useState } from "react"
import { 
    Button, 
    Checkbox, 
    Divider, 
    IconButton, 
    MenuItem, 
    TableCell, 
    TableRow, 
    Typography 
} from "@mui/material"
// component
import ConfirmDialog from "../../components/confirm-dialog"
import Iconify from "../../components/iconify"
import MenuPopover from "../../components/menu-popover"
import { useSnackbar } from '../../components/snackbar'

export default function CustomTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  setReload,
  onDeleteRow,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const { name } = row

  const [openConfirm, setOpenConfirm] = useState(false)
  const [openPopover, setOpenPopover] = useState(null)

  const handleOpenConfirm = () => setOpenConfirm(true)
  const handleCloseConfirm = () => setOpenConfirm(false)

  const handleOpenPopover = (event) => setOpenPopover(event.currentTarget)
  const handleClosePopover = () => setOpenPopover(null)

  const handleDeleteRow = async () => {
    const response = await onDeleteRow()
    const { message, status } = response
    
    if(status) {
      enqueueSnackbar(message)
      handleCloseConfirm()
      setReload(true)
    } else {
      handleCloseConfirm()
      enqueueSnackbar(message)
    }
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>{name}</Typography>
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
        title="Hapus Data"
        content="Apakah Anda yakin ingin Menghapus Data?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Hapus
          </Button>
        }
      />
    </>
  )
}