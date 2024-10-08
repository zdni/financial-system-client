import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// @mui
import { Box, Stack, Drawer } from '@mui/material'
// auth
import { useAuthContext } from '../../../auth/useAuthContext'
// hooks
import useResponsive from '../../../hooks/useResponsive'
// config
import { NAV } from '../../../config'
// components
import Logo from '../../../components/logo'
import Scrollbar from '../../../components/scrollbar'
import { NavSectionVertical } from '../../../components/nav-section'
//
import navConfig from './config'
import NavAccount from './NavAccount'

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useAuthContext()
  const { pathname } = useLocation()

  const isDesktop = useResponsive('up', 'lg')

  useEffect(() => {
    if (openNav) {
      onCloseNav()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        backgroundColor: '#F4F6F8',
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Logo />

        <NavAccount />
      </Stack>

      <NavSectionVertical data={navConfig} user={user} />

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  )

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
              bgcolor: 'transparent',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  )
}
