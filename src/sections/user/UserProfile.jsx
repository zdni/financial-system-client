import { useState } from 'react'
import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { Box, Grid, Card, Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// components
import FormProvider, { RHFTextField } from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
import { updateUser } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

export default function UserProfile({ user }) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  const [disabledFormEdit, setDisabledFormEdit] = useState(true)

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  })

  const defaultValues = {
    id: user?._id || null,
    name: user?.name || '',
  }

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    try {
      const response = await updateUser(data.id, data,  { headers: { authorization: `Bearer ${TOKEN}` } })
      if(response.data.status) {
        enqueueSnackbar('Berhasil Mengubah Pengguna!')
      }
      setDisabledFormEdit(true)
    } catch (error) {
      console.error(error)
    }
  }

  const changeDisabledFormEdit = () => { setDisabledFormEdit(false) }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
              <RHFTextField name="name" label="Nama" inputProps={{ readOnly: disabledFormEdit, }} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {
                disabledFormEdit &&
                <LoadingButton type="submit" variant="contained" onClick={changeDisabledFormEdit}>
                  Ubah Profil
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
        </FormProvider>
      </Grid>
    </Grid>
  )
}
