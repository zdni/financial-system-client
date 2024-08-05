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
  DialogTitle,
  Stack,
} from '@mui/material'
// component
import FormProvider, { RHFSelect, RHFSelectDepend, RHFTextField } from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
import { useEffect, useState } from 'react'
import { isValidToken } from '../../auth/utils'
import { getAccount, getAccounts, getVendors } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

export default function FormDataDialog({
  open,
  onClose,
  //
  onSubmitForm,
  setReload,
  //
  data = false,
  ...other
}) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()

  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [accountType, setAccountType] = useState('');
  
  const FormSchema = Yup.object().shape({
    date: Yup.date().required('Tanggal Wajib Diisi!'),
  })
  
  const defaultValues = { 
    _id: data?._id || null, 
    date: data?.date || null,
    vendorId: data?.vendorId?._id || '',
    accountId: data?.accountId?._id || '',
    userId: data?.userId?._id || '',
    label: data?.label || '',
    debit: data?.debit || 0,
    credit: data?.credit || 0,
    transactionId: data?.transactionId?._id || '',
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

  const onChangeAccount = (value) => {
    async function fetchData() {
      if(TOKEN && isValidToken(TOKEN)) {
        const response = await getAccount(value, {headers: { authorization: `Bearer ${TOKEN}` } })
        setAccountType(response.data.data.account_type)
      }
    }
    fetchData();
  }

  useEffect(() => {
    async function fetchData() {
      if(TOKEN && isValidToken(TOKEN)) {
        const vendors = await getVendors({ headers: { authorization: `Bearer ${TOKEN}` } })
        setVendors(vendors.data.data)

        const accounts = await getAccounts({ headers: { authorization: `Bearer ${TOKEN}` } })
        setAccounts(accounts.data.data)
      }
    }
    fetchData();

    if(data) {
      reset(defaultValues)
      setAccountType(data?.accountId?.account_type || '')
    } else {
      reset(defaultValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Ubah Transaksi </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={1}>
            <RHFTextField name="label" label="Label" />
            <RHFSelectDepend name="accountId" label="Akun" depend={(value) => onChangeAccount(value)}>
              {accounts.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </RHFSelectDepend>
            <RHFSelect name="vendorId" label="Vendor">
              <option key='' value=''></option>
              {vendors.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </RHFSelect>
            <RHFTextField name="debit" label="Income" disabled={ accountType === 'expense' } />
            <RHFTextField name="credit" label="Expense" disabled={ accountType === 'income' } />
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
