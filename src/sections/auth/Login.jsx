import React from 'react'
// @mui
import { Stack, Typography } from '@mui/material'
// hooks
// import { useAuthContext } from '../../auth/useAuthContext'
// layouts
import LoginLayout from '../../layouts/login'
//
import AuthLoginForm from './AuthLoginForm'

// ----------------------------------------------------------------------

export default function Login() {
    // const { method } = useAuthContext();
  
    return (
      <LoginLayout>
        <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
          <Typography variant="h4">Ruang Baca TI UHO</Typography>
        </Stack>
  
        <AuthLoginForm />
  
      </LoginLayout>
    );
  }
  