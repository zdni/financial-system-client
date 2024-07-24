import { useEffect, useMemo, useState } from 'react'
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
import FormProvider, { RHFTextField } from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
import { createPenalty, getPenalties, updatePenalty } from '../../helpers/backend_helper'
import FormDonePenaltyDialog from './FormDonePenaltyDialog'
import FormCancelPenaltyDialog from './FormCancelPenaltyDialog'
import Label from '../../components/label/Label'

// ----------------------------------------------------------------------

const LABEL_OF_STATUS = {
  process: 'Sanksi Diberikan',
  done: 'Sanksi Dibatalkan',
}

export default function FormPenaltyDialog({
  open,
  onClose,
  //
  orderId,
  user,
  data,
  ...other
}) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()

  const [openFormDonePenaltyDialog, setOpenFormDonePenaltyDialog] = useState(false)
  const [openFormCancelPenaltyDialog, setOpenFormCancelPenaltyDialog] = useState(false)
  const [edit, setEdit] = useState(false)

  const handleOpenFormDonePenaltyDialog = () => {
    onClose()
    setOpenFormDonePenaltyDialog(true)
  }
  const handleCloseFormDonePenaltyDialog = () => setOpenFormDonePenaltyDialog(false)
  
  const handleOpenFormCancelPenaltyDialog = () => {
    onClose()
    setOpenFormCancelPenaltyDialog(true)
  }
  const handleCloseFormCancelPenaltyDialog = () => setOpenFormCancelPenaltyDialog(false)
  
  const FormSchema = Yup.object().shape({
    initDate: Yup.string().required('Tanggal Awal Wajib di Isi!'),
    description: Yup.string().required('Sanksi Wajib di Isi!'),
  })
  
  const defaultValues = useMemo(
    () => ({
      _id: null,
      orderId: orderId || null,
      description: '',
      initDate: new Date(),
      doneDate: '',
      status: 'process'
    }), 
    [orderId]
  )
  
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    control,
    reset,
    watch,
  } = methods

  const values = watch()

  const onSubmit = async (data) => {
    const form = {
      orderId: data.orderId,
      description: data.description,
      date: {
        init: data.initDate,
        done: data.doneDate,
      },
      status: data.status,
    }
    
    const response = edit 
      ? await updatePenalty(data._id, form, { headers: { authorization: `Bearer ${TOKEN}` } }) 
      : await createPenalty(form, { headers: { authorization: `Bearer ${TOKEN}` } })
    
    const { message, status } = response.data
    
    if(status) {
      reset()
      onClose()
      window.location.reload(false)
    } else {
      reset()
      onClose()
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  useEffect(() => {
    if(orderId) {
      async function fetchData() {
        const response = await getPenalties({ params: { orderId }, headers: { authorization: `Bearer ${TOKEN}` } })
        const data = response.data.data[0]
        
        reset({
          _id: data?._id,
          orderId: data?.orderId._id || orderId,
          description: data?.description,
          initDate: data?.date.init || new Date(),
          doneDate: data?.date.done,
          status: data?.status
        })

        if(data) setEdit(true)
      }
      fetchData()
    } else {
      reset(defaultValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Sanksi Keterlambatan </DialogTitle>

          <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
            <Stack spacing={3}>
              <Controller
                name="initDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Tanggal Awal Sanksi"
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
              {values.doneDate && (
                <Controller
                  name="doneDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Tanggal Penyelesaian Sanksi"
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
              )}
              <RHFTextField label="Sanksi" name="description" rows={3} multiline />
            </Stack>
            {values.status && (
              <Label variant="soft" color="info" sx={{ mt: 3 }}>
                {LABEL_OF_STATUS[values.status]}
              </Label>
            )}
          </DialogContent>

          <DialogActions>
            {['admin', 'staff'].includes(user?.role) && values._id && values.status !== 'done' && (
              <>
                <Button variant="outlined" color="inherit" onClick={handleOpenFormCancelPenaltyDialog}>
                  Batalkan Sanksi
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleOpenFormDonePenaltyDialog}>
                  Selesaikan Sanksi
                </Button>
              </>
            )}

            <Button variant="outlined" color="inherit" onClick={onClose}>
              Batal
            </Button>
            {['admin', 'staff'].includes(user?.role) && values.status !== 'done' && (
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
            )}
          </DialogActions>
        </FormProvider>
      </Dialog>

      <FormDonePenaltyDialog 
        open={openFormDonePenaltyDialog} 
        onClose={handleCloseFormDonePenaltyDialog}
        penaltyId={values._id}
      />

      <FormCancelPenaltyDialog 
        open={openFormCancelPenaltyDialog} 
        onClose={handleCloseFormCancelPenaltyDialog}
        penaltyId={values._id}
        order={data}
      />
    </>
  )
}
