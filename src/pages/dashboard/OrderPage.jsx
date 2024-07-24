import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
// mui
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
} from '@mui/lab'
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// components
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { CustomAvatar } from '../../components/custom-avatar'
import Label from '../../components/label/Label'
import { useSnackbar } from '../../components/snackbar'
// section
import { 
  FormPenaltyDialog,
  FormReturnOrderDialog, 
} from '../../sections/order'
// utils
import { fDate } from '../../utils/formatTime'
import { getOrder, updateOrder } from '../../helpers/backend_helper'


// ----------------------------------------------------------------------

const LABEL_OF_STATUS = {
  draft: 'Diajukan',
  process: 'Dipinjam',
  done: 'Selesai',
  cancel: 'Dibatalkan',
}

const ROLES = {
  admin: 'Admin',
  staff: 'Staf',
  lecture: 'Dosen',
  student: 'Mahasiswa'
}

export default function OrdersPage() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { user } = useAuthContext()
  const { id } = useParams()
  const { themeStretch } = useSettingsContext()
  const { enqueueSnackbar } = useSnackbar()

  const [reload, setReload] = useState(true)
  const [data, setData] = useState({})

  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [openFormPenaltyDialog, setOpenFormPenaltyDialog] = useState(false)

  const handleOpenFormDialog = () => setOpenFormDialog(true)
  const handleCloseFormDialog = () => setOpenFormDialog(false)

  const handleOpenFormPenaltyDialog = () => setOpenFormPenaltyDialog(true)
  const handleCloseFormPenaltyDialog = () => setOpenFormPenaltyDialog(false)

  const handleDraftOrder = async () => {
    const response = await updateOrder(data._id, { status: 'draft' }, { headers: { authorization: `Bearer ${TOKEN}` } })
    if(response.status === 200) {
      enqueueSnackbar(response.data.message)
    }
    setReload(true)
  }

  const handleApproveOrder = async () => {
    const response = await updateOrder(data._id, { status: 'process' }, { headers: { authorization: `Bearer ${TOKEN}` } })
    console.log(response)
    if(response.status === 200) {
      enqueueSnackbar(response.data.message)
    }
    setReload(true)
  }

  const handleCancelOrder = async () => {
    const response = await updateOrder(data._id, { status: 'cancel' }, { headers: { authorization: `Bearer ${TOKEN}` } })
    if(response.status === 200) {
      enqueueSnackbar(response.data.message)
    }
    setReload(true)
  }

  const handleDoneOrder = async (data) => {
    const response = await updateOrder(data._id, { $set: { status: 'done', "date.return": data.date } }, { headers: { authorization: `Bearer ${TOKEN}` } })
    return { ...response.data, code: response.status }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getOrder(id, { headers: { authorization: `Bearer ${TOKEN}` } })
      if(response.status === 200) {
        setData(response.data.data)
      }
    }
    if(reload) {
      fetchData()
      setReload(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  const dueDate = data?.date?.return || new Date()

  return (
    <>
      <Helmet>
        <title> Detail Peminjaman | Ruang Baca TI UHO</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>

        <CustomBreadcrumbs
          heading="Detail Peminjaman"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Peminjaman',
              href: PATH_DASHBOARD.order.list,
            },
            {
              name: 'Detail',
            },
          ]}
        />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={4} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                {data.status === 'cancel' && (
                  <Button onClick={handleDraftOrder}>
                    Ajukan Lagi
                  </Button>
                )}
                {user?.role === 'admin' && (
                  <>
                    {data.status === 'draft' && (
                      <Button onClick={handleApproveOrder}>
                        Setujui
                      </Button>
                    )}
                    {['draft', 'process'].includes(data.status) && (
                      <Button onClick={handleCancelOrder}>
                        Batalkan
                      </Button>
                    )}
                    {data.status === 'process' && (
                      <Button onClick={handleOpenFormDialog}>
                        Setujui Pengembalian
                      </Button>
                    )}
                  </>
                )}
                {data.status === 'done' && (data.date.end < dueDate) && (
                  <Button onClick={handleOpenFormPenaltyDialog}>
                    Sanksi
                  </Button>
                )}
              </Stack>
              <Box>
                <Label 
                variant="soft"
                  color={
                    (data.status === 'draft' && 'secondary') ||
                    (data.status === 'done' && (data.date.end > dueDate) && 'success') ||
                    (data.status === 'done' && (data.date.end < dueDate) && 'warning') ||
                    (data.status === 'cancel' && 'error') ||
                    'info'
                  }
                >
                  {LABEL_OF_STATUS[data.status]} {(data?.date?.end < dueDate) ? ' | Terlambat' : ''}
                </Label>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} lg={7}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Dokumen
                </Typography>
                <Stack direction="row" spacing={2}>
                  <CustomAvatar 
                    variant="rounded" 
                    src={`http://139.59.108.29:4901/uploads/documents/${data?.documentId?.cover}`}
                  />
                  <Stack>
                    <Typography variant="subtitle1">
                      {data?.documentId?.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {data?.documentId?.author}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
            <Card sx={{ p: 3, mt: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Riwayat
                </Typography>
                <Timeline>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" color="success" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">{fDate(data?.date?.start)}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Tanggal Awal Peminjaman
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">{fDate(data?.date?.end)}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Tanggal Akhir Peminjaman
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                  {data?.date?.return && (
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot variant="outlined" />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle2">{fDate(data?.date?.return)}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Tanggal Pengembalian
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  )}
                </Timeline>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Peminjam
                </Typography>
                <Stack>
                  <Typography variant="subtitle1">
                    {data?.userId?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {ROLES[data?.userId?.role]} {data?.userId?.classYear ? `( ${data?.userId?.classYear} )` : ''}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {data?.userId?.idNumber}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        
        <FormReturnOrderDialog 
          open={openFormDialog} 
          onClose={handleCloseFormDialog}
          onSubmitForm={handleDoneOrder}
          data={data}
          setReload={setReload}
        />

        <FormPenaltyDialog 
          user={user}
          open={openFormPenaltyDialog} 
          onClose={handleCloseFormPenaltyDialog}
          orderId={data._id}
          data={data}
        />

      </Container>
    </>
  )
}