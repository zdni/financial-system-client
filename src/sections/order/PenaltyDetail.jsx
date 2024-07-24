import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// mui
import { Button, Card, Grid, Stack, Typography } from '@mui/material'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// routes
import Label from '../../components/label/Label'
import { useSnackbar } from '../../components/snackbar'
// section

// utils
import { getPenalties, updatePenalty, deletePenalty } from '../../helpers/backend_helper'


// ----------------------------------------------------------------------

const LABEL_OF_STATUS = {
  process: {label: 'Sanksi Diberikan', color: 'warning'},
  done: {label: 'Sanksi Selesai', color: 'success'},
  cancel: {label: 'Sanksi Dibatalkan', color: 'error'},
}

export default function OrdersPage() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { id } = useParams()

  const [reload, setReload] = useState(true)
  const [data, setData] = useState({})

  useEffect(() => {
    async function fetchData() {
      const response = await getPenalties({ params: { orderId: id }, headers: { authorization: `Bearer ${TOKEN}` } })
      if(response.status === 200) {
        setData(response.data.data[0])
      }
    }
    if(reload) {
      fetchData()
      setReload(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Button>
            Sanksi
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">
                Sanksi Keterlambatan
              </Typography>
              {data && (
                <Stack>
                  <Typography variant="subtitle1">
                    {/* {data?.description} */}
                  </Typography>
                  {/* <Label  variant="soft" color={LABEL_OF_STATUS[data?.status].color}>
                    {LABEL_OF_STATUS[data?.status].label}
                  </Label> */}
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}