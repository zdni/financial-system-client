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
import { updatePenalty } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

export default function FormDonePenaltyDialog({
  open,
  onClose,
  //
  penaltyId,
  ...other
}) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  
  const FormSchema = Yup.object().shape({
    doneDate: Yup.string().required('Tanggal Penyelesaian Wajib di Isi!'),
  })
  
  const defaultValues = useMemo(
    () => ({
      _id: penaltyId || null,
      doneDate: new Date(),
    }), 
    [penaltyId]
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
    const form = { "date.done": data.doneDate, "status": 'done' }
    const response = await updatePenalty(data._id, form, { headers: { authorization: `Bearer ${TOKEN}` } }) 
    const { message, status } = response.data

    if(status) {
      reset()
      onClose()
      enqueueSnackbar(message)
      window.location.reload(false)
    } else {
      reset()
      onClose()
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  useEffect(() => {
    if(penaltyId) {
      reset(defaultValues)
    } else {
      reset(defaultValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [penaltyId])

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Penyelesaian Sanksi </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <Controller
              name="doneDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Tanggal Penyelesaian"
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
