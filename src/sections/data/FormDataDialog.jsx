import { useEffect, useMemo } from 'react'
import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material'
// component
import FormProvider, { RHFTextField } from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'

// ----------------------------------------------------------------------

export default function FormDataDialog({
  title = 'Tambah',
  label = 'Label',
  open,
  onClose,
  //
  onSubmitForm,
  setReload,
  //
  data,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar()
  
  const FormSchema = Yup.object().shape({
    name: Yup.string().required('Inputan Wajib Diisi!'),
  })
  
  const defaultValues = useMemo(
    () => ({
      _id: data?._id || null,
      name: data?.name || '',
    }), 
    [data]
  )
  
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    reset,
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
          <Stack spacing={3}>
            <RHFTextField name="name" label={label} />
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
