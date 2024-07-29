import { m } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Button, Typography } from '@mui/material'
// components
import { MotionContainer, varBounce } from '../components/animate'
// assets
import { PageNotFoundIllustration } from '../assets/illustrations'

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | Cash Draw Simple Recording System</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Maaf, Halaman Tidak Ditemukan!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Maaf, Halaman yang Anda Tuju Tidak Ditemukan. Silahkan Cek Kembali URL Halaman yang Anda Tuju!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button to="/" component={RouterLink} size="large" variant="contained">
          Kembali ke Halaman Utama
        </Button>
      </MotionContainer>
    </>
  )
}
