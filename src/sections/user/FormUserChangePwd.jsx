import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { Box, Card, Grid, Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// components
import FormProvider, {
  RHFTextField,
} from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
import { changePasswordUser } from '../../helpers/backend_helper'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// routes
import { PATH_AUTH } from '../../routes/paths'

// ----------------------------------------------------------------------

export default function FormUserChangePwd({ user }) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  const [disabledFormEdit, setDisabledFormEdit] = useState(true)
  
  const navigate = useNavigate()
  const { logout } = useAuthContext()
  
  const UpdateUserSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Silahkan isi Password lama Anda'),
    newPassword: Yup.string().required('Silahkan isi Password baru Anda'),
    confirmPassword: Yup.string().required('Silahkan isi Konfirmasi Password baru Anda'),
  })

  const defaultValues = {
    id: user._id,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    const response = await changePasswordUser(data.id, data,  { headers: { authorization: `Bearer ${TOKEN}` } })
    enqueueSnackbar(response.data.message)
    if(response.data.status) {
      reset(defaultValues)
      setDisabledFormEdit(true)
      logout()
      navigate(PATH_AUTH.login, { replace: true })
    }
  }

  const changeDisabledFormEdit = () => { setDisabledFormEdit(false) }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="oldPassword" label="Password Lama" inputProps={{ readOnly: disabledFormEdit, }} />
              <RHFTextField name="newPassword" label="Password Baru" inputProps={{ readOnly: disabledFormEdit, }} />
              <RHFTextField name="confirmPassword" label="Konfirmasi Password Baru" inputProps={{ readOnly: disabledFormEdit, }} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {
                disabledFormEdit &&
                <LoadingButton type="submit" variant="contained" onClick={changeDisabledFormEdit}>
                  Ubah Password
                </LoadingButton>
              }
              {
                !disabledFormEdit &&
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Simpan Perubahan
                </LoadingButton>
              }
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
