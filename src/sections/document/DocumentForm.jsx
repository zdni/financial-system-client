import * as Yup from 'yup'
import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import { Grid, Card, Link, Stack, Typography } from '@mui/material'
//components
import { useSnackbar } from '../../components/snackbar'
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
} from '../../components/hook-form'
// api
import { 
  getDocumentTypes,
  getDocumentCategories,
  getLocations,
  getSpecializations,
  getDocument,
  createDocument,
  updateDocument, 
} from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const OPTIONS_OF_LANGUAGE = [
  { value: 'id', label: 'Indonesia' },
  { value: 'en', label: 'English' },
]

export default function DocumentForm() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const [report, setReport] = useState(null)
  
  const [reload, setReload] = useState(true)
  const [types, setTypes] = useState([])
  const [thesis, setThesis] = useState(null)
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [specializations, setSpecializations] = useState([])

  const FormDocumentSchema = Yup.object().shape({
    code: Yup.string().required('Silahkan isi Kode Dokumen'),
    title: Yup.string().required('Silahkan isi Judul Dokumen'),
    author: Yup.string().required('Silahkan isi Penulis'),
    year: Yup.string().required('Silahkan isi Tahun Terbit'),
    publisher: Yup.string().required('Silahkan isi Penerbit'),
    place_of_publication: Yup.string().required('Silahkan isi Tempat Penerbit'),
  })

  const defaultValues = {
    code: '',
    title: '',
    author: '',
    cover: '',
    coverUrl: '',
    studentIdNumber: '',
    year: '',
    mainMentor: '',
    secondMentor: '',
    mainExaminer: '',
    secondExaminer: '',
    thirdExaminer: '',
    publisher: '',
    place_of_publication: '',
    qty: 1,
    categoryId: '',
    typeId: '',
    specializationId: '',
    locationId: '',
    volume: '',
    identifier: '',
    classification: '',
    language: 'id',
    content: '',
    physicalDescription: '',
    doi: '',
  }

  const methods = useForm({
    resolver: yupResolver(FormDocumentSchema),
    defaultValues,
  })

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods
  const values = watch()

  const onSubmit = async (data) => {
    if([thesis, report].includes(data.typeId)) {
      data['lectures'] = {
        mentor: {
          main: data.mainMentor,
          second: data.secondMentor,
        },
        examiner: {
          main: data.mainExaminer,
          second: data.secondExaminer,
          third: data.thirdExaminer
        }
      }
    } 

    delete data.studentIdNumber
    delete data.mainMentor
    delete data.secondMentor
    delete data.mainExaminer
    delete data.secondExaminer
    delete data.thirdExaminer
    delete data.coverUrl

    if(!data.categoryId) delete data.categoryId
    if(!data.typeId) delete data.typeId
    if(!data.specializationId) delete data.specializationId
    if(!data.locationId) delete data.locationId
    
    if(id) {
      const response = await updateDocument(id, data, { headers: { authorization: `Bearer ${TOKEN}`, "Content-type": "multipart/form-data" } })
      if(response.status === 200) {
        setReload(true)
      }
      enqueueSnackbar(response.data.message)
    } else {
      const response = await createDocument(data, { headers: { authorization: `Bearer ${TOKEN}`, "Content-type": "multipart/form-data" } })
      if(response.status === 200) {
        reset()
      }
      enqueueSnackbar(response.data.message)
    }
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })

      if (file) setValue('cover', newFile)
      if (file) setValue('coverUrl', newFile)
    },
    [setValue]
  )

  const handleRemoveFile = () => {
      setValue('cover', null)
      setValue('coverUrl', null)
  }

  useEffect(() => {
    if(reload) {
      async function fetchData() {
        const resTypes = await getDocumentTypes({})
        if(resTypes.status === 200) {
          setTypes(resTypes.data.data)
          setValue('typeId', resTypes.data.data[0]._id)
          resTypes.data.data.map((option) => {
            if(option.name === 'Tugas Akhir') setThesis(option._id)
            if(option.name === 'Laporan KP') setReport(option._id)
            return true
          })
        }
  
        const resCategories = await getDocumentCategories({})
        if(resCategories.status === 200) {
          setCategories(resCategories.data.data)
        }
  
        const resLocations = await getLocations({})
        if(resLocations.status === 200) {
          setLocations(resLocations.data.data)
          setValue('locationId', resLocations.data.data[0]._id)
        }
  
        const resSpecializations = await getSpecializations({})
        if(resSpecializations.status === 200) {
          setSpecializations(resSpecializations.data.data)
        }
      }
      fetchData()
  
      if(id) {
        async function fetchDocument() {
          const response = await getDocument(id)
          if(response.status === 200) {
            const { data } = response.data
            reset({
              code: data?.code,
              title: data?.title,
              author: data?.author,
              cover: data?.cover,
              coverUrl: data?.coverUrl,
              studentIdNumber: data?.studentIdNumber,
              year: data?.year,
              mainMentor: data?.mainMentor,
              secondMentor: data?.secondMentor,
              mainExaminer: data?.mainExaminer,
              secondExaminer: data?.secondExaminer,
              thirdExaminer: data?.thirdExaminer,
              publisher: data?.publisher,
              place_of_publication: data?.place_of_publication,
              qty: data?.qty,
              categoryId: data?.categoryId?._id,
              typeId: data?.typeId?._id,
              specializationId: data?.specializationId?._id,
              locationId: data?.locationId?._id,
              volume: data?.volume,
              identifier: data?.identifier,
              classification: data?.classification,
              language: data?.language,
              content: data?.content,
              physicalDescription: data?.physicalDescription,
              doi: data?.doi,
            })
          }
        }
        fetchDocument()
      }
      setReload(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, setValue])

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="code" label="Kode Dokumen" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="year" label="Tahun" />
                  </Grid>
                </Grid>
                <RHFTextField name="title" label="Judul" />
                <RHFTextField name="author" label="Penulis" />
                
                {values.typeId === thesis && (
                  <>
                    <RHFTextField name="studentIdNumber" label="NIM" />
                    <RHFTextField name="mainMentor" label="Pembimbing 1" />
                    <RHFTextField name="secondMentor" label="Pembimbing 2" />
                    <RHFTextField name="mainExaminer" label="Penguji 1" />
                    <RHFTextField name="secondExaminer" label="Penguji 2" />
                    <RHFTextField name="thirdExaminer" label="Penguji 3" />
                  </>
                )}

                <RHFTextField name="publisher" label="Penerbit" />
                <RHFTextField name="place_of_publication" label="Tempat Terbit" />
                <RHFTextField type="number" name="qty" label="Jumlah" />
                <RHFTextField name="volume" label="Volume" />
                <RHFTextField name="identifier" label="Identifier" />
                <RHFTextField name="classification" label="Klasifikasi" />
                <RHFTextField name="doi" label="DOI" />
                <RHFTextField name="physicalDescription" label="Deskripsi Fisik" />


                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Abstrak
                  </Typography>

                  <RHFEditor simple name="content" />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Cover
                  </Typography>

                  <RHFUpload
                    name="coverUrl"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  />
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {OPTIONS_OF_LANGUAGE && (
                  <RHFSelect name="language" label="Bahasa">
                    {OPTIONS_OF_LANGUAGE.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                )}

                {types && (
                  <RHFSelect name="typeId" label="Tipe Dokumen">
                    {types.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                  </RHFSelect>
                )}

                <RHFSelect name="categoryId" label="Kategori Dokumen">
                  <option key='' value=''></option>
                  {categories.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>

                <RHFSelect name="specializationId" label="Peminatan">
                  <option key='' value=''></option>
                  {specializations.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>

                <RHFSelect name="locationId" label="Lokasi Penyimpanan">
                  {locations.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                Simpan Dokumen
              </LoadingButton>
              <Link
                to={'/koleksi-pustaka'}
                component={RouterLink}
                color="inherit"
                variant="body2"
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  display: 'block'
                }}
              >
                Batal
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}