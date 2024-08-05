// form
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
// @mui
import {
  Card,
  Stack,
  TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers';
// component
import FormProvider from '../../components/hook-form'
import { useSnackbar } from '../../components/snackbar'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab';
import { updateTransaction } from '../../helpers/backend_helper';

// ----------------------------------------------------------------------

export default function TransactionFormUpdate({ data }) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()

  const { id } = useParams()

  const [transactionDate, setTransactionDate] = useState(null);
  const [transaction, setTransaction] = useState({});

  const defaultValues = { 
    _id: data?._id || null, 
    date: data?.date || null,
  }
  
  const methods = useForm({
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    console.log({
      ...transaction,
      date: transactionDate
    })
    const response = await updateTransaction(id, {
      ...transaction,
      date: transactionDate
    }, { headers: { authorization: `Bearer ${TOKEN}` } })
    const { message, status } = response.data
    let options = {}

    if(!status) {
      options = { variant: 'error' }
    }
    enqueueSnackbar(message, options)
  }

  useEffect(() => {
    if(data) {
      setTransactionDate(data?.date)
      setTransaction(data)
    }
  }, [data])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <DatePicker
            label="Tanggal Transaksi"
            value={transactionDate}
            onChange={(value) => { setTransactionDate(value) }}
            disabled={data?.state !== 'draft'}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
              />
            )}
          />
        </Stack>
        <Stack spacing={1.5} sx={{ mt: 3 }} direction='row'>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={data?.state !== 'draft'}
          >
            Ubah Tanggal
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  )
}
