import { useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
// @mui
import { Box } from '@mui/material'
//
import Footer from './Footer'
import Header from './Header'
import { checkServer } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation()

  const isHome = pathname === '/'

  useEffect(() => {
    async function connectionCheck() {
      const response = await checkServer()
      if(response === 'ERR_NETWORK') return window.location.href = '/500'
    }
    connectionCheck()
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 11 },
          }),
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}
