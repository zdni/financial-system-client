import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material'
// component
import FormProvider, { RHFSelect, RHFTextField } from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
import { useEffect } from 'react'

// ----------------------------------------------------------------------

export default function FormDataDialog({
  title = 'Tambah',
  open,
  onClose,
  //
  onSubmitForm,
  setReload,
  //
  data = false,
  ...other
}) {
  const ROLE_OPTIONS = [
    {label: 'Admin', value: 'admin'},
    {label: 'Staf', value: 'staff'},
  ]
  const { enqueueSnackbar } = useSnackbar()
  
  const FormSchema = Yup.object().shape({
    name: Yup.string().required('Nama Lengkap Wajib Diisi!'),
    email: Yup.string().required('Email Wajib Diisi!'),
  })
  
  const defaultValues = { 
    _id: data?._id || null, 
    name: data?.name || '',
    email: data?.email || '',
    role: data?.role || 'admin',
    status: data?.status || 'active',
  }
  
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    reset,
    // watch,
  } = methods

  const onSubmit = async (data) => {
    const response = await onSubmitForm(data)
    const { message, status } = response

    if(status) {
      reset()
      onClose()
      enqueueSnackbar(message)
      setReload(true)
    } else {
      reset()
      onClose()
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  // const values = watch()

  useEffect(() => {
    if(data) {
      reset(defaultValues)
    } else {
      reset(defaultValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <DialogContentText sx={{ mb: '20px' }}>
            {title} 
            <br/><span style={{ fontSize: '10px' }} >*Default Password adalah email yang didaftarkan (sebelum @)</span>
          </DialogContentText>
          <Stack spacing={1}>
            <RHFTextField name="name" label="Nama Lengkap" />
            <RHFTextField name="email" label="Email" />
            <RHFSelect name="role" label="Role">
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Batal
          </Button>

          <Button 
            variant="contained" 
            color="inherit" 
            type='submit'
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
            Simpan
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}
