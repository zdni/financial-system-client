import { useEffect, useMemo } from 'react'
import * as Yup from 'yup'
import { DatePicker } from '@mui/x-date-pickers'
// form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
} from '@mui/material'
// component
import FormProvider from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'

// ----------------------------------------------------------------------

export default function FormReturnOrderDialog({
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
    date: Yup.string().required('Tanggal Pengembalian Wajib di Isi!'),
  })
  
  const defaultValues = useMemo(
    () => ({
      _id: data?._id || null,
      date: new Date(),
    }), 
    [data]
  )
  
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    control,
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
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Pengembalian Peminjaman </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Tanggal Pengembalian"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField   {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />
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
