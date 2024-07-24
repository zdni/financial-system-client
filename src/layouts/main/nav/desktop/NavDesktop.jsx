// @mui
import { Stack } from '@mui/material'
//
import NavList from './NavList'

// ----------------------------------------------------------------------

export default function NavDesktop({ isOffset, data }) {
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ mr: 5 }}>
      {data.map((link) => (
        <NavList key={link.title} item={link} isOffset={isOffset} />
      ))}
    </Stack>
  )
}
