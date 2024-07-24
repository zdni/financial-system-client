import { Fragment, useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import { Helmet } from 'react-helmet-async'
import { m, useScroll, useSpring } from 'framer-motion' 
// icons
import filterIcon from '@iconify/icons-carbon/filter'
// @mui
import { 
  Box, 
  Button, 
  Container, 
  Drawer, 
  InputAdornment, 
  MenuItem, 
  Pagination, 
  Paper, 
  Stack, 
  TextField, 
  Typography 
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
// components
import { DocumentItem } from '../components/document-item'
import Iconify from '../components/iconify'
// helpers
import { 
  getDocuments, 
  getDocumentCategories, 
  getDocumentTypes, 
  getSpecializations, 
  getLocations 
} from '../helpers/backend_helper'
// ----------------------------------------------------------------------

export default function CatalogPage(){
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()

  const isLoading = true
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [catalog, setCatalog] = useState([])
  const [totalCatalog, setTotalCatalog] = useState(0)
  const [sort, setSort] = useState('title')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    typeId: '', 
    categoryId: searchParams.get('categoryId') || '', 
    specializationId: '',
    locationId: '',
    search: '',
    filterYear: 'equal',
    currentYear: '',
    startYear: '',
    endYear: '',
    lang: '',
  })

  const handleChangeSort = (sort) => { setSort(sort) }

  const handleChangeFilter = (event) => {
    if(event.target.value === 'equal') {
      setFilter({
        ...filter,
        [event.target.name]: event.target.value,
        startYear: '',
        endYear: '',
      })
    } else if(event.target.value === 'between') {
      setFilter({
        ...filter,
        [event.target.name]: event.target.value,
        currentYear: '',
      })
    } else {
      setFilter({
        ...filter,
        [event.target.name]: event.target.value
      })
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getDocuments({ params: { limit: 10, page: page, sort: sort, ...filter } })
      setCatalog(response.data.data)
      setTotalCatalog(response.data.total)
    }
    fetchData()
  }, [filter, page, sort])  

  const handleMobileOpen = () => { setMobileOpen(true) }
  const handleMobileClose = () => { setMobileOpen(false) }

  const handleChangePagination = (event, value) => { setPage(value) }

  const { scrollYProgress } = useScroll()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const progress = (
    <m.div
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 1999,
        position: 'fixed',
        transformOrigin: '0%',
        backgroundColor: theme.palette.primary.main,
        scaleX,
      }}
    />
  )

  return (
    <>
      <Helmet>
        <title> Koleksi Pustaka | Ruang Baca TI UHO</title>
      </Helmet>

      {progress}

      <Container
        sx={{
          pt: 15,
          pb: 10,
          minHeight: 1,
        }}
      >

        <Typography variant="h3" align="center" paragraph>
          Koleksi Pustaka Ruang Baca TI UHO
        </Typography>

        <Typography align="center" sx={{ color: 'text.secondary' }}>
          Gunakan fasilitas pencarian untuk mempercepat penemuan data pada koleksi pustaka
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            my: 5,
            mb: { md: 8 },
          }}
        >
          <Typography variant="h5">Koleksi Pustaka</Typography>

          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon={filterIcon} sx={{ width: 18, height: 18 }} />}
            onClick={handleMobileOpen}
            sx={{
              display: { md: 'none' },
            }}
          >
            Filters
          </Button>
        </Stack>

        
        <Stack direction={{ xs: 'column', md: 'row' }}>
            <CatalogFilters 
              mobileOpen={mobileOpen} 
              onMobileClose={handleMobileClose} 
              filter={filter} 
              handleChangeFilter={handleChangeFilter} 
              sort={sort}
              handleChangeSort={handleChangeSort}
            />

            <Box
              sx={{
                flexGrow: 1,
                pl: { md: 8 },
                width: { md: `calc(100% - 280px)` },
              }}
            >
              <CatalogList 
                catalog={catalog} 
                loading={isLoading} 
                total={totalCatalog}
                handleChangePagination={handleChangePagination}
              />
            </Box>
          </Stack>
      </Container>

    </>
  )
}

function CatalogFilters({ mobileOpen, onMobileClose, filter, handleChangeFilter, sort, handleChangeSort }) {
  const SORT_OPTIONS = [
    {'label': 'A-Z', 'value': 'title'},
    {'label': 'Z-A', 'value': '-title'},
    {'label': 'Terbaru', 'value': '-year'},
    {'label': 'Terlama', 'value': 'year'},
    {'label': 'Terpopuler', 'value': 'accessed'},
  ]
  const FILTER_YEAR = [
    {'label': 'Sama Dengan', 'value': 'equal'}, 
    {'label': 'Rentang', 'value': 'between'}, 
  ]
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [specializations, setSpecializations] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    async function fetchData() {
      // categories
      const resCategories = await getDocumentCategories()
      setCategories(resCategories.data.data)
      // types
      const resTypes = await getDocumentTypes()
      setTypes(resTypes.data.data)
      // specializations
      const resSpecializations = await getSpecializations()
      setSpecializations(resSpecializations.data.data)
      // locations
      const resLocations = await getLocations()
      setLocations(resLocations.data.data)
    }
    fetchData()
  }, [])

  const renderFilters = (
    <Stack spacing={1}>
      <section style={{ marginBottom: '30px' }}>
        <TextField
          variant={'outlined'}
          fullWidth
          label="Pencarian"
          value={filter.search}
          name={'search'}
          onChange={ (event) => handleChangeFilter(event) }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-outline" width={24} />
              </InputAdornment>
            ),
          }}
        />
      </section>

      <section>
        <TextField
          variant={'outlined'}
          select
          fullWidth
          label="Tipe Dokumen"
          value={filter.typeId}
          name={'typeId'}
          onChange={ (event) => handleChangeFilter(event) }
        >
          <MenuItem key='type-id-0' value=''>
            '--- Pilih Tipe Dokumen ---'
          </MenuItem>
          {types.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </section>
      <section>
        <TextField
          variant={'outlined'}
          select
          fullWidth
          label="Kategori Dokumen"
          value={filter.categoryId}
          name={'categoryId'}
          onChange={ (event) => handleChangeFilter(event) }
        >
          <MenuItem key='category-id-0' value=''>
            '--- Pilih Kategori Dokumen ---'
          </MenuItem>
          {categories.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </section>
      <section>
        <TextField
          variant={'outlined'}
          select
          fullWidth
          label="Peminatan"
          value={filter.specializationId}
          name={'specializationId'}
          onChange={ (event) => handleChangeFilter(event) }
        >
          <MenuItem key='specialization-id-0' value=''>
            '--- Pilih Peminatan ---'
          </MenuItem>
          {specializations.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </section>
      <section>
        <TextField
          variant={'outlined'}
          select
          fullWidth
          label="Lokasi Penyimpanan"
          value={filter.locationId}
          name={'locationId'}
          onChange={ (event) => handleChangeFilter(event) }
        >
          <MenuItem key='location-id-0' value=''>
            '--- Pilih Lokasi Penyimpanan ---'
          </MenuItem>
          {locations.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </section>
      <Fragment>
        <section style={{ marginTop: '30px' }}>
          <TextField
            variant={'outlined'}
            select
            fullWidth
            label="Filter Tahun"
            value={filter.filterYear}
            name={'filterYear'}
            onChange={ (event) => handleChangeFilter(event) }
          >
            {FILTER_YEAR.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </section>
        {
          filter.filterYear === 'equal' && 
          <section>
            <TextField
              variant={'outlined'}
              fullWidth
              type="number"
              label="Tahun"
              defaultValue={filter.currentYear}
              name={'currentYear'}
              InputLabelProps={{ shrink: true }}
              onChange={ (event) => handleChangeFilter(event) }
            />
          </section>
        }
        {
          filter.filterYear === 'between' &&
          <>
            <section>
              <TextField
                variant={'outlined'}
                fullWidth
                type="number"
                label="Tahun Awal"
                defaultValue={filter.startYear}
                name={'startYear'}
                InputLabelProps={{ shrink: true }}
                onChange={ (event) => handleChangeFilter(event) }
              />
            </section>
            <section>
              <TextField
                variant={'outlined'}
                fullWidth
                type="number"
                label="Tahun Akhir"
                defaultValue={filter.endYear}
                name={'endYear'}
                InputLabelProps={{ shrink: true }}
                onChange={ (event) => handleChangeFilter(event) }
              />
            </section>
          </> 
        }
      </Fragment>
      <section style={{ marginTop: '30px' }}>
        <TextField
          variant={'outlined'}
          select
          fullWidth
          label="Urut Berdasarkan Tahun"
          value={sort}
          name={'sort'}
          onChange={ (event) => handleChangeSort(event.target.value) }
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </section>
    </Stack>
  )

  return (
    <>
      {/* -- Desktop -- */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: {
            xs: 'none',
            md: 'block',
          },
          top: { md: 96 },
          position: { md: 'sticky' },
        }}
      >
        {renderFilters}
      </Box>

      {/* -- Mobile -- */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            pt: 5,
            px: 3,
            width: 280,
          },
        }}
      >
        {renderFilters}
      </Drawer>
    </>
  )
}

function CatalogList({ catalog, loading, total, handleChangePagination }) {
  return (
    <>
      <Stack spacing={2}>
        {catalog.length === 0 && (
          <Paper sx={{ textAlign: 'center' }}>
            <Typography variant="h6" paragraph>
              Dokumen Kosong!
            </Typography>
      
            <Typography variant="body2">
              Dokumen yang Anda cari tidak ditemukan.
              <br /> Silahkan cek kembali kata kunci yang Anda masukkan.
            </Typography>
          </Paper>
        )}
        {catalog.length > 0 && (
          <>
            <Box
              sx={{
                display: 'grid',
                rowGap: { xs: 1, md: 2 },
                columnGap: 0.5,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
              }}
            >
              {catalog.map((item) => (
                <DocumentItem key={item._id} document={item} index={3} />
              ))}
            </Box> 
            <Pagination
              count={Math.ceil(total/10)}
              color="primary"
              size="large"
              sx={{
                pt: 10,
                pb: { xs: 10, md: 15 },
                '& .MuiPagination-ul': { justifyContent: 'center' },
              }}
              onChange={(event, value) => handleChangePagination(event, value)}
            />
          </>
        )}
      </Stack>

    </>
  )
}
