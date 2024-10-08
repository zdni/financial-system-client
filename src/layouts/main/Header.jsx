import { useRef } from 'react'
// @mui
import { useTheme } from '@mui/material/styles'
import { Box, Button, AppBar, Toolbar, Container, Link } from '@mui/material'
// hooks
import useOffSetTop from '../../hooks/useOffSetTop'
import useResponsive from '../../hooks/useResponsive'
// utils
import { bgBlur } from '../../utils/cssStyles'
// config
import { HEADER } from '../../config'
// components
import Logo from '../../components/logo'
//
import { useAuthContext } from '../../auth/useAuthContext'
import navConfig from './nav/config'
import NavMobile from './nav/mobile'
import NavDesktop from './nav/desktop'

// ----------------------------------------------------------------------

export default function Header() {
  const { isAuthenticated, isInitialized } = useAuthContext()
  const carouselRef = useRef(null)

  const theme = useTheme()

  const isDesktop = useResponsive('up', 'md')

  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP)

  return (
    <AppBar ref={carouselRef} color="transparent" sx={{ boxShadow: 0 }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }), 
          backgroundColor: '#F4F6F8',
          ...(isOffset && {
            ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16,
            },
            backgroundColor: '#F4F6F8',
          }),
        }}
      >
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />

          <Link
            href='/'
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{ ml: 1 }}
          >
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && <NavDesktop isOffset={isOffset} data={navConfig} />}

          {
            isInitialized && !isAuthenticated &&
            <Button variant="contained" rel="noopener" href='/auth/login'>
              Masuk
            </Button>
          }
          {
            isInitialized && isAuthenticated &&
            <Button variant="contained" rel="noopener" href='/beranda/peminjaman/daftar'>
              Beranda
            </Button>
          }

          {!isDesktop && <NavMobile isOffset={isOffset} data={navConfig} />}
        </Container>
      </Toolbar>

      {isOffset && <Shadow />}
    </AppBar>
  )
}

// ----------------------------------------------------------------------

function Shadow({ sx, ...other }) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  )
}
