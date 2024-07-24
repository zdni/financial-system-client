import React, { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Box, Link } from '@mui/material'

// ----------------------------------------------------------------------

const Logo = forwardRef(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const logo = (
      <Box
        component="img"
        src="/logo/logo_full.svg"
        sx={{ width: 120, height: 120, cursor: 'pointer', ...sx }}
      />
    )

    if (disabledLink) {
      return <>{logo}</>
    }

    return (
      <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
        {logo}
      </Link>
    )
  }
)

Logo.displayName = 'Logo'
export default Logo
