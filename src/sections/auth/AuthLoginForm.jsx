import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { Stack, Alert, Link, IconButton, InputAdornment } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// components
import Iconify from '../../components/iconify'
import FormProvider, { RHFTextField } from '../../components/hook-form'
import { PATH_DASHBOARD } from '../../routes/paths'

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { login } = useAuthContext()

  const [showPassword, setShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Silahkan Masukkan Email!'),
    password: Yup.string().required('Silahkan Masukkan Password!'),
  })

  const defaultValues = {
    email: '',
    password: '',
  }

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods

  const onSubmit = async (data) => {
    console.log(data)
    const response = await login(data.email, data.password)
    const { message, status } = response

    if(status) {
      reset()
      window.location.href = PATH_DASHBOARD.root
    } else {
      setError('afterSubmit', { message })
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
          my: 2
        }}
      >
        Masuk
      </LoadingButton>
      <Link
        to={'/'}
        component={RouterLink}
        color="inherit"
        variant="body2"
        sx={{
          textAlign: 'center',
          width: '100%',
          display: 'block'
        }}
      >
        Kembali ke Halaman Utama
      </Link>
    </FormProvider>
  )
}
