import { m } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Button, Typography } from '@mui/material'
// components
import { MotionContainer, varBounce } from '../components/animate'
// assets
import { ForbiddenIllustration } from '../assets/illustrations'

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <>
      <Helmet>
        <title> 403 Forbidden | Minimal UI</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Akses Tidak Diizinkan
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Anda tidak memiliki Izin untuk mengakses Halaman yang Anda Tuju.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button to="/" component={RouterLink} size="large" variant="contained">
          Kembali ke Halaman Utama
        </Button>
      </MotionContainer>
    </>
  )
}
