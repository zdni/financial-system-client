import {  useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// form
import { useForm, useFieldArray } from 'react-hook-form'
// @mui
import {
  Card,
  Button,
  Stack,
  TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// component
import FormProvider from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
// api
import { 
  createTransaction,
} from '../../helpers/backend_helper'
import { PATH_DASHBOARD } from '../../routes/paths'
import TransactionFormLine from './TransactionFormLine'

// eslint-disable-next-line no-extend-native
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

// ----------------------------------------------------------------------

export default function TransactionForm() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuthContext()
  
  const navigate = useNavigate()
  
  const [transactionDate, setTransactionDate] = useState(null)
  const [transactions, setTransactions] = useState({})
  const [complete, setComplete] = useState(false)

  const defaultValues = { 
    date: null,
  }
  
  const methods = useForm({
    // resolver: yupResolver(FormSchema),
    defaultValues,
  })
  
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = methods

  const { fields, remove, append } = useFieldArray({
    name: "transactions",
    control,
  })

  const onSubmit = async (data) => {
    if(!complete) {
      enqueueSnackbar("Simpan Baris Transaksi terlebih dahulu!", { variant: 'error' })
      return
    }

    for(const index in transactions) {
      const transaction = {
        date: transactions[index].date,
        label: transactions[index].label,
        vendorId: transactions[index].vendorId === "" ? null : transactions[index].vendorId,
        accountId: transactions[index].accountId,
        userId: transactions[index].userId,
        debit: transactions[index].type === 'income' ? parseInt(transactions[index].debit) : 0,
        credit: transactions[index].type === 'expense' ? parseInt(transactions[index].credit) : 0,
        state: 'posted',
      }

      const response = await createTransaction(transaction, { headers: { authorization: `Bearer ${TOKEN}` } })
      const { message, status } = response
      if(status) {
        enqueueSnackbar(message)
      } else {
        enqueueSnackbar(message, { variant: 'error' })
      }
    }

    reset()
    navigate(`${PATH_DASHBOARD.transaction.root}`)
  }

  const transaction = {
    date: transactionDate,
    label: "",
    vendorId: null,
    accountId: null,
    userId: user?._id,
    debit: 0,
    credit: 0,
    state: 'posted',
    type: '',
  };

  useEffect(() => {
    const currentDate = new Date();
    const offset = new Date().getTimezoneOffset()/-60;
    currentDate.setHours(offset,0,0);
    
    setTransactionDate(Date.parse(currentDate.toJSON().slice(0, 10)));
  }, [])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <DatePicker
            label="Tanggal Transaksi"
            value={transactionDate}
            onChange={(value) => { console.log(value); setTransactionDate(value) }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
              />
            )}
          />
          <Stack spacing={1}>
            {fields.map((field, index) => {
              return (
                <TransactionFormLine 
                  key={index} 
                  data={field} 
                  remove={() => remove(index)} 
                  setTransactions={setTransactions} 
                  // transactions={transactions}
                  setComplete={setComplete}
                />
              )
            })}
          </Stack>
          <Button
            variant="outlined"
            onClick={() => {
              if(transactionDate === null) {
                enqueueSnackbar('Pilih Tanggal terlebih dahulu!', { variant: 'warning' })
              } else {
                append(transaction)
              }
            }}
          >
            Tambah Transaksi
          </Button>
        </Stack>
        <Stack spacing={1.5} sx={{ mt: 3 }} direction='row'>
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            sx={{width: '200px'}}
          >
            Simpan
          </LoadingButton>
          <Button
            variant="outlined"
            onClick={() => navigate(`${PATH_DASHBOARD.transaction.root}`)}
          >
            Batal
          </Button>
        </Stack>
      </Card>
    </FormProvider>
  )
}
