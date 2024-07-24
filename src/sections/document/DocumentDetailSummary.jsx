import { useEffect, useState } from 'react'
import { sentenceCase } from 'change-case'
import { DatePicker } from '@mui/x-date-pickers'
import { useNavigate } from 'react-router-dom'
// form
import { Controller, useForm } from 'react-hook-form'
// @mui
import { Stack, Button, Divider, Typography, TextField } from '@mui/material'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// utils
import { fShortenNumber } from '../../utils/formatNumber'
import { createOrder, deleteDocument } from '../../helpers/backend_helper'
import { PATH_DASHBOARD } from '../../routes/paths'
// components
import Label from '../../components/label/Label'
import Iconify from '../../components/iconify'
import FormProvider from '../../components/hook-form'
import ConfirmDialog from '../../components/confirm-dialog/ConfirmDialog'
import { useSnackbar } from '../../components/snackbar'

// ----------------------------------------------------------------------

export default function DocumentDetailSummary({ data, ...other }) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''

  const { user } = useAuthContext()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  
  const [disableOrder, setDisableOrder] = useState(false)
  const [openDeleteDocument, setOpenDeleteDocument] = useState(false)
  
  const { _id, accessed, author, title, year, currentQty } = data

  const defaultValues = {
    documentId: _id,
    userId: user?._id,
    startDate: new Date(),
    qty: 1,
    status: 'draft',
  }
  
  const methods = useForm({
    defaultValues,
  })

  const { reset, control, handleSubmit } = methods
  
  const handleChangeDisableOrder = (value) => setDisableOrder(value)
  
  useEffect(() => {
    if (data) {
      reset(defaultValues)
    }
    if(!user || user?.role === 'admin' || data.currentQty < 1) {
      handleChangeDisableOrder(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onSubmit = async (data) => {
    const endDate = new Date()
    endDate.setDate(data.startDate.getDate() + 5)

    data['date'] = {
      start: data.startDate,
      end: endDate,
    }
    delete data.startDate
    
    const response = await createOrder(data, { headers: { authorization: `Bearer ${TOKEN}` } })
    if(response.status === 200) {
      enqueueSnackbar(response.data.message)
      navigate(PATH_DASHBOARD.order.list)
    }
  }

  const handleCloseDeleteDocument = () => setOpenDeleteDocument(false)
  const handleOpenDeleteDocument = () => setOpenDeleteDocument(true)

  const handleSubmitDeleteDocument = async () => {
    const response = await deleteDocument(_id, { headers: { authorization: `Bearer ${TOKEN}` } })
    if(response.status === 200) {
      handleCloseDeleteDocument()
      enqueueSnackbar(response.data.message)
      navigate('/koleksi-pustaka')
    } else {
      enqueueSnackbar(response.data.message)
    }
  }
  
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={3}
          sx={{
            p: (theme) => ({
              md: theme.spacing(5, 5, 0, 2),
            }),
          }}
          {...other}
        >
          <Stack spacing={2}>
            <Label
              variant="soft"
              // color={inventoryType === 'in_stock' ? 'success' : 'error'}
              color={ currentQty < 1 ? 'error' : 'success'}
              sx={{ textTransform: 'uppercase', mr: 'auto' }}
            >
              { currentQty < 1 ? sentenceCase('Tidak Tersedia') : sentenceCase('Tersedia')}
            </Label>

            <Typography variant="h5">{title}</Typography>

            <Stack direction="column" alignItems="start">
              <Typography variant="body2">
                {author}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Tahun Terbit: {year}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  ({fShortenNumber(accessed) || 0} kali dilihat)
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Controller
              name="startDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Tanggal Peminjaman"
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

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={2}>
            <Button
              fullWidth
              disabled={disableOrder}
              size="large"
              color="success"
              variant="contained"
              startIcon={<Iconify icon="ic:round-add-shopping-cart" />}
              sx={{ whiteSpace: 'nowrap' }}
              type="submit"
            >
              Ajukan Peminjaman
            </Button>
            {user?.role === 'admin' && (
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  size="large"
                  color="info"
                  variant="contained"
                  startIcon={<Iconify icon="ic:outline-mode-edit-outline" />}
                  rel="noopener"
                  sx={{ whiteSpace: 'nowrap' }}
                  href={`/beranda/dokumen/form/${data._id}`}
                >
                  Ubah
                </Button>
                <Button
                  fullWidth
                  size="large"
                  color="error"
                  variant="contained"
                  startIcon={<Iconify icon="ic:round-delete-outline" />}
                  sx={{ whiteSpace: 'nowrap' }}
                  onClick={handleOpenDeleteDocument}
                >
                  Hapus
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </FormProvider>

      <ConfirmDialog
        open={openDeleteDocument}
        onClose={handleCloseDeleteDocument}
        title="Hapus Dokumen"
        content="Apakah Anda yakin ingin menghapus Dokumen?"
        action={
          <Button variant="contained" color="error" onClick={handleSubmitDeleteDocument}>
            Hapus
          </Button>
        }
      />
    </>
  )
}
