import { m } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
// @mui
import { Typography } from '@mui/material'
// components
import { MotionContainer, varBounce } from '../components/animate'
// assets
import { SeverErrorIllustration } from '../assets/illustrations'

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      <Helmet>
        <title> 500 Internal Server Error | Minimal UI</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            500 Internal Server Error
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Terdapat Kesalahan pada Server. Silahkan coba lagi beberapa saat kemudian!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

      </MotionContainer>
    </>
  )
}
