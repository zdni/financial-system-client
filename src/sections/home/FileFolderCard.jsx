import { useState } from 'react'
// @mui
import {
  Box,
  Card,
  Stack,
  IconButton,
} from '@mui/material'
// components
import Iconify from '../../components/iconify'
import TextMaxLine from '../../components/text-max-line'

// ----------------------------------------------------------------------

export default function FileFolderCard({
  folder,
  selected,
  onSelect,
  onDelete,
  sx,
  ...other
}) {
  const [showCheckbox, setShowCheckbox] = useState(false)

  const handleShowCheckbox = () => {
    setShowCheckbox(true)
  }

  const handleHideCheckbox = () => {
    setShowCheckbox(false)
  }

  return (
    <>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.default',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...((showCheckbox || selected) && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          <IconButton color={'default'} onClick={() => {}}>
            <Iconify icon="eva:diagonal-arrow-right-up-fill" />
          </IconButton>
        </Stack>

        <Box
          component="img"
          src="/assets/icons/files/ic_folder.svg"
          sx={{ width: 24, height: 24 }}
        />

        <TextMaxLine variant="h6" onClick={() => console.log(1)} sx={{ mt: 1, mb: 0.5, cursor: 'pointer' }} line={1} gutterBottom>
          {folder.name}
        </TextMaxLine>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Box> {folder.totalFiles} Dokumen </Box>
        </Stack>
      </Card>
    </>
  )
}
