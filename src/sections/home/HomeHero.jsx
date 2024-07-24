import { m, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
// @mui
import { styled, alpha } from '@mui/material/styles'
import { Button, Box, Container, Divider, Typography, Stack, Grid } from '@mui/material'
// hooks
import useResponsive from '../../hooks/useResponsive'
// utils
import { textGradient, bgGradient } from '../../utils/cssStyles'
import { fShortenNumber } from '../../utils/formatNumber'
// config
import { HEADER } from '../../config'
// components
import Iconify from '../../components/iconify'
import { MotionContainer, varFade } from '../../components/animate'
// asset
import { ElearningHeroIllustration } from '../../assets/illustrations'
// 
import { useAuthContext } from '../../auth/useAuthContext'

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_2.jpg',
  }),
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    position: 'fixed',
  },
}))

const StyledDescription = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(15, 0),
  height: '100%',
}))

const StyledGradientText = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontFamily: "'Barlow', sans-serif",
  fontSize: `${64 / 32}rem`,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 32}rem`,
  },
}))

// ----------------------------------------------------------------------

export default function HomeHero() {
  const isDesktop = useResponsive('up', 'md')

  const { scrollYProgress } = useScroll()

  const [hide, setHide] = useState(false)

  useEffect(
    () =>
      scrollYProgress.onChange((scrollHeight) => {
        if (scrollHeight > 0.8) {
          setHide(true)
        } else {
          setHide(false)
        }
      }),
    [scrollYProgress]
  )

  if (hide) {
    return null
  }

  return (
    <>
      <StyledRoot>
        <Container component={MotionContainer} sx={{ height: 1 }}>
          <Grid container spacing={10} sx={{ height: 1 }}>
            <Grid item xs={12} md={6} sx={{ height: 1 }}>
              <Description />
            </Grid>

            {isDesktop && (
              <Grid item xs={12} md={6} sx={{ mt: `${HEADER.H_MAIN_DESKTOP}px` }}>
                <ElearningHeroIllustration />
              </Grid>
            )}
          </Grid>
        </Container>
      </StyledRoot>

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  )
}

// ----------------------------------------------------------------------

function Description() {
  const { isInitialized, isAuthenticated, user } = useAuthContext()
  return (
    <StyledDescription>
      <m.div variants={varFade().in}>
        <Typography variant="h4" sx={{ mb: 0 }}>
          {
            (isInitialized && isAuthenticated && user) &&
            `Hai ${user.name} 👋, Selamat Datang Kembali`
          }
          {
            (isInitialized && !isAuthenticated && !user) &&
            `Hai 👋, Selamat Datang di Website`
          }
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <StyledGradientText
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          Ruang Baca TI UHO
        </StyledGradientText>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography variant="body2">
          “Buku-buku terbaik… adalah yang memberi tahu kamu apa yang sudah kamu ketahui.” – George Orwell, 1984
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ my: 5 }}>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="eva:external-link-fill" width={24} />}
            rel="noopener"
            href='/koleksi-pustaka'
            sx={{ borderColor: 'text.primary' }}
          >
            Koleksi Pustaka
          </Button>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed', mt: 8, mb: 6 }} />
        <SummarySection />
      </m.div>
    </StyledDescription>
  )
}

// ----------------------------------------------------------------------

function SummarySection() {
  const [summary, setSummary] = useState([])
  const color = ['primary', 'secondary', 'info', 'success', 'warning', 'error']

  useEffect(() => {
    // async function fetchData() {
    //   const response = await getDocumentGroup({ params: {group: 'type'} })
    //   setSummary(response.data.data)
    // }
    // fetchData()
  }, [])
  return (
    <Stack
      spacing={{ xs: 3, sm: 10 }}
      direction="row"
      justifyContent={{ xs: 'center', md: 'unset' }}
    >
      {
        summary ? summary.map((item, index) => {
          return SummaryItem(item.total, item._id[0].name, color[index%color.length], index)
        }) : null
      }
    </Stack>
  );
}

function SummaryItem(total, label, color, index) {
  return (
    <Stack spacing={0.5} sx={{ position: 'relative' }} key={index}>
      <Box
        sx={{
          top: 8,
          left: -4,
          width: 24,
          height: 24,
          zIndex: -1,
          opacity: 0.24,
          borderRadius: '50%',
          position: 'absolute',
          bgcolor: (theme) => theme.palette[color].main,
        }}
      />
      <Typography variant="h3">{fShortenNumber(total)}+</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Stack>
  );
}