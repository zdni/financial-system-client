import { useEffect, useRef, useState } from 'react'
// import { sub } from 'date-fns'
// @mui
import { styled, useTheme } from '@mui/material/styles'
import { Stack, Container, Grid, Box, CardHeader } from '@mui/material'
// components
import Carousel, { CarouselArrows } from '../../components/carousel'
import { DocumentItem } from '../../components/document-item'
import { getDocuments } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}))

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
export default function HomePopularDocuments() {
  const theme = useTheme()
  const carouselRef = useRef(null)

  const carouselSettings = {
    dots: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const handlePrev = () => {
    carouselRef.current?.slickPrev()
  }

  const handleNext = () => {
    carouselRef.current?.slickNext()
  }

  const [documents, setDocuments] = useState([])
  
  useEffect(() => {
    async function fetchData() {
      const response = await getDocuments({ params: { limit: 10, sort: 'accessed' } })
      setDocuments(response.data.data)
    }
    fetchData()
  }, [])

  return (
    <RootStyle>
      <Container>
        <Grid container spacing={{ xs: 8, lg: 3 }} justifyContent={{ lg: 'space-between' }}>
          <Grid item xs={12}>
            <Box sx={{ py: 2 }}>
              <CardHeader
                title="Dokumen Terpopular"
                subheader="10 Dokumen Terpopular"
                action={<CarouselArrows onNext={handleNext} onPrevious={handlePrev} />}
                sx={{
                  p: 0,
                  mb: 3,
                  '& .MuiCardHeader-action': { alignSelf: 'center' },
                }}
              />

              <Carousel ref={carouselRef} {...carouselSettings}>
                {documents && documents.map((document) => (
                  <DocumentItem document={document} index={3} key={document._id} />
                ))}
              </Carousel>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}