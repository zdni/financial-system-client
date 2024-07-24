import { Link as RouterLink } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'
// @mui
import { styled } from '@mui/material/styles'
import { Typography, Stack, Container, Grid, Card, Box, IconButton, Link } from '@mui/material'
// components
import Iconify from '../../components/iconify'
import TextMaxLine from '../../components/text-max-line'
import { getDocumentGroup } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}))

// ----------------------------------------------------------------------
export default function HomeDocumentCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await getDocumentGroup({ params: { group: 'category' } })
      setCategories(response.data.data)
    }
    fetchData()
  }, [])

  return (
    <RootStyle>
      <Container>
        <Grid container spacing={{ xs: 8, lg: 3 }} justifyContent={{ lg: 'space-between' }}>
          <Grid
            item
            xs={12}
            lg={4}
            sx={{
              textAlign: { xs: 'center', lg: 'unset' },
            }}
          >
            <Typography variant="h2">Kategori Dokumen</Typography>

            <Typography sx={{ color: 'text.secondary', mt: 2, mb: 5 }}>
              Kami mengelompokkan dokumen berdasarkan kategori. Pengetahuan Umum, Informasi Khusus, dan sebagainya. Semuanya telah disediakan!
            </Typography>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {categories && categories.map((category) => {
                if (category._id.length > 0) return (
                  <FileFolderCard 
                    key={category._id[0]._id} 
                    folder={category} 
                  />
                )
                return null
              })}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}

// ----------------------------------------------------------------------

function FileFolderCard({
  folder,
  selected,
  onSelect,
  sx,
  ...other
}) {
  const [showCheckbox, setShowCheckbox] = useState(false)

  const handleShowCheckbox = () => {
    setShowCheckbox(true)
  }

  const handleHideCheckbox = () => {
    setShowCheckbox(false)
  }

  return (
    <>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        sx={{
          p: 2.5,
          width: 1,
          boxShadow: 0,
          bgcolor: 'background.default',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...((showCheckbox || selected) && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          <Link color="inherit" to={`koleksi-pustaka?categoryId=${folder._id[0]._id}`} component={RouterLink}>
            <IconButton color={'default'}>
              <Iconify icon="eva:diagonal-arrow-right-up-fill" />
            </IconButton>
          </Link>
        </Stack>

        <Box
          component="img"
          src="/assets/icons/files/ic_folder.svg"
          sx={{ width: 24, height: 24 }}
        />

        <Link color="inherit" to={`koleksi-pustaka?categoryId=${folder._id[0]._id}`} component={RouterLink}>
          <TextMaxLine variant="h6" sx={{ mt: 1, mb: 0.5, cursor: 'pointer' }} line={1} gutterBottom>
            {folder._id[0].name}
          </TextMaxLine>
        </Link>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Box> {folder.total} Dokumen </Box>
        </Stack>
      </Card>
    </>
  )
}
