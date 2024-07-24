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
import { deletePenalty, updateOrder } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

export default function FormCancelPenaltyDialog({
  open,
  onClose,
  //
  order,
  penaltyId,
  ...other
}) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  
  const FormSchema = Yup.object().shape({
    date: Yup.string().required('Tanggal Pengembalian Wajib di Isi!'),
  })
  
  const defaultValues = useMemo(
    () => ({
      _id: penaltyId || null,
      date: order?.date?.return || new  Date(), 
      orderId: order?._id || null
    }),
    [penaltyId, order]
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
    console.log(data)
    const response = await deletePenalty(data._id, { headers: { authorization: `Bearer ${TOKEN}` } })
    const { message, status } = response.data
    
    if(status) {
      console.log(status)
      console.log(data)
      const resp = await updateOrder(data.orderId, { "date.return": data.date }, { headers: { authorization: `Bearer ${TOKEN}` } })
      console.log(resp)
      console.log(resp.data.status)
      if(resp.data.status) {
        reset()
        onClose()
        enqueueSnackbar(resp.data.message)
        window.location.reload(false)
      } else {
        reset()
        onClose()
        enqueueSnackbar(resp.data.message, { variant: 'error' })  
      }
    } else {
      reset()
      onClose()
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  useEffect(() => {
    if(penaltyId || order) {
      reset(defaultValues)
    } else {
      reset(defaultValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [penaltyId])

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Batalkan Sanksi </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Ubah Tanggal Pengembalian"
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
