import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom'
// @mui
import { Box, Button, Card, Container, Divider, Grid, Link, MenuItem, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
// components
import Image from '../components/image/Image'
import Markdown from '../components/markdown'
// sections

// utils
import { getDocument } from '../helpers/backend_helper'
import DocumentDetailSummary from '../sections/document/DocumentDetailSummary'
import Iconify from '../components/iconify/Iconify'

// ----------------------------------------------------------------------

const LANGUAGE = {
  id: 'Indonesia',
  en: 'English',
}

const OPTIONS_OF_CITATION = [
  {value: 'acm', label: 'ACM'},
  {value: 'acs', label: 'ACS'},
  {value: 'apa', label: 'APA'},
  {value: 'chicago', label: 'Chicago'},
  {value: 'harvard', label: 'Harvard'},
  {value: 'ieee', label: 'IEEE'},
  {value: 'vancounver', label: 'Vancounver'},
]

export default function DocumentPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [data, setData] = useState(false)
  // const [available, setAvailable] = useState(false)
  const [citations, setCitations] = useState({})
  const [citationType, setCitationType] = useState('acm')

  const handleChangeCitation = (value) => {
    setCitationType(value)
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getDocument(id)
      const { data, status } = response
      if(status === 200) {
        setData(data.data)
        setCitations(data.citations)
        // setAvailable(data.available)
      }
    }
    fetchData()
  }, [id])
  
  return (
    <>
      <Helmet>
        <title>Detail Dokumen | Ruang Baca TI UHO</title>
      </Helmet>

      <Container sx={{ pt: 15, pb: 10, minHeight: 1 }}>
        {data && (
          <>
            <Button
              color="success"
              startIcon={<Iconify icon="ic:round-arrow-back-ios-new" />}
              onClick={() => { navigate(-1) }}
            >
              Kembali
            </Button>
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} md={6} lg={7}>
                <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                  <Image
                    key={data?._id}
                    alt="Dokumen"
                    src={`http://139.59.108.29:4901/uploads/documents/${data?.cover}`}
                    ratio="1/1"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6} lg={5}>
                <DocumentDetailSummary data={data} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={5}>
                <Card>
                  <Tabs value='detail' sx={{ px: 3, bgcolor: 'background.neutral' }}>
                    <Tab key='detail' value={'detail'} label={'Detail'} />
                  </Tabs>
                  <Divider />
                  <Box sx={{ p: 3 }} key='detail'>
                    <Stack spacing={2}>
                      {data?.code && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Kode Dokumen
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.code}
                          </Typography>
                        </Stack>
                      )}
                      {data?.lectures && (
                        <>
                          <Divider />
                          <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Typography variant="body2" fontWeight={700}>
                              Pembimbing 1
                            </Typography>
                            <Typography variant="body2" textAlign="right">
                              {data?.lectures.mentor.main}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Typography variant="body2" fontWeight={700}>
                              Pembimbing 2
                            </Typography>
                            <Typography variant="body2" textAlign="right">
                              {data?.lectures.mentor.second}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Typography variant="body2" fontWeight={700}>
                              Penguji 1
                            </Typography>
                            <Typography variant="body2" textAlign="right">
                              {data?.lectures.examiner.main}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Typography variant="body2" fontWeight={700}>
                              Penguji 2
                            </Typography>
                            <Typography variant="body2" textAlign="right">
                              {data?.lectures.examiner.second}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Typography variant="body2" fontWeight={700}>
                              Penguji 3
                            </Typography>
                            <Typography variant="body2" textAlign="right">
                              {data?.lectures.examiner.third}
                            </Typography>
                          </Stack>
                          <Divider />
                        </>
                      )}
                      {data?.studentIdNumber && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            NIM
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.studentIdNumber}
                          </Typography>
                        </Stack>
                      )}
                      {data?.publisher && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Penerbit
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.publisher}
                          </Typography>
                        </Stack>
                      )}
                      {data?.place_of_publication && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Tempat Terbit
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.place_of_publication}
                          </Typography>
                        </Stack>
                      )}
                      {data?.categoryId?.name && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Kategori
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.categoryId.name}
                          </Typography>
                        </Stack>
                      )}
                      {data?.specializationId?.name && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Peminatan
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.specializationId.name}
                          </Typography>
                        </Stack>
                      )}
                      {data?.locationId?.name && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Lokasi
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.locationId.name}
                          </Typography>
                        </Stack>
                      )}
                      {data?.volume && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Volume
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.volume}
                          </Typography>
                        </Stack>
                      )}
                      {data?.identifier && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Identifier
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.identifier}
                          </Typography>
                        </Stack>
                      )}
                      {data?.classification && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Klasifikasi
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.classification}
                          </Typography>
                        </Stack>
                      )}
                      <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Typography variant="body2" fontWeight={700}>
                          Bahasa
                        </Typography>
                        <Typography variant="body2" textAlign="right">
                          {LANGUAGE[data?.language || 'id']}
                        </Typography>
                      </Stack>
                      {data?.physicalDescription && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            Deskripsi Fisik
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.physicalDescription}
                          </Typography>
                        </Stack>
                      )}
                      {data?.doi && (
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700}>
                            DOI
                          </Typography>
                          <Typography variant="body2" textAlign="right">
                            {data?.doi}
                          </Typography>
                        </Stack>
                      )}
                      <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Typography variant="body2" fontWeight={700}>
                          Stok
                        </Typography>
                        <Typography variant="body2" textAlign="right">
                          {data?.currentQty} Buah
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={4} justifyContent="space-between">
                        <Typography variant="body2" fontWeight={700}>
                          Sitasi
                        </Typography>
                        <section>
                          <Typography variant="body2">
                            {citations[citationType]}
                          </Typography>
                          <TextField
                            sx={{ mt: 1 }}
                            variant={'outlined'}
                            select
                            fullWidth
                            label="Format Citasi"
                            value={citationType}
                            onChange={ (event) => handleChangeCitation(event.target.value) }
                          >
                            {OPTIONS_OF_CITATION.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </section>
                      </Stack>
                      <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Typography variant="body2" fontWeight={700}>
                          Download Citation
                        </Typography>
                        <Link component={RouterLink} variant="body2" textAlign="right" to='https://www.mendeley.com/download-reference-manager/windows' target='_blank'>
                          Mendeley
                        </Link>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={7}>
                <Card>
                  <Tabs value='abstract' sx={{ px: 3, bgcolor: 'background.neutral' }}>
                    <Tab key='abstract' value='abstract' label='Abstrak' />
                  </Tabs>
                  <Divider />
                  <Box sx={{ p: 3 }}>
                    <Markdown children={data?.content} />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  )
}