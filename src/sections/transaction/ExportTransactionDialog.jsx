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
import FormProvider, { RHFSelect, RHFDatePicker } from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
// helpers
import { exportExcelTransaction } from '../../helpers/backend_helper'
// utils
import { isValidToken } from '../../auth/utils'

// ----------------------------------------------------------------------

export default function FormDataDialog({
  open,
  onClose,
  //
  onSubmitForm,
  setReload,
  //
  ...other
}) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  const TYPE_EXPORT = [
    {label: 'Excel', value: 'excel'},
    {label: 'PDF', value: 'pdf'},
  ]
  
  const FormSchema = Yup.object().shape({
    start_date: Yup.date().required('Tanggal Awal Wajib Diisi!'),
    end_date: Yup.date().required('Tanggal Akhir Wajib Diisi!'),
    export_type: Yup.string().required('Tipe Export Wajib Dipilih!'),
  })
  
  const defaultValues = { 
    start_date: null,
    end_date: null,
    export_type: 'excel',
  }
  
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    reset,
  } = methods

  const onSubmit = async (data) => {
    const url = 'http://localhost:4000/01 Jul 2024-28 Jul 2024.xlsx';
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    // if(TOKEN && isValidToken(TOKEN)) {
    //   if(data.export_type === 'pdf') {
    //     // toPDF();
    //   } else if(data.export_type === 'excel') {
    //     const response = await exportExcelTransaction({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: Date.parse(data.start_date), endDate: Date.parse(data.end_date), sort: 'date' }})
    //     enqueueSnackbar(response.data.message)
    //   } else {
    //     enqueueSnackbar("Aksi tidak tersedia!", { variant: "error" });
    //   }
    //   return { status: true }
    // } else {
    //   enqueueSnackbar("TOKEN_REQUIRED", { variant: "error" });
    // }
    // reset()
    // onClose()
    // setReload(true)
    // const response = await onSubmitForm(data)
    // const { status } = response

    // if(status) {
    //   reset()
    //   onClose()
    //   setReload(true)
    // } else {
    //   reset()
    //   onClose()
    // }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Export Transaksi </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <DialogContentText sx={{ mb: '20px' }}>
            Export 
          </DialogContentText>
          <Stack spacing={1}>
            <RHFDatePicker name="start_date" label="Tanggal Awal" />
            <RHFDatePicker name="end_date" label="Tanggal Akhir" />

            <RHFSelect name="export_type" label="Tipe">
              {TYPE_EXPORT.map((option) => (
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
            Export
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}
