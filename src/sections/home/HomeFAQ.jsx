// @mui
import { styled } from '@mui/material/styles'
import { Accordion, Typography, AccordionSummary, AccordionDetails, Stack, Container, Grid } from '@mui/material'
// components
import Image from '../../components/image'
import Iconify from '../../components/iconify'

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}))

// ----------------------------------------------------------------------

export default function HomeFAQ() {
  return (
    <RootStyle>
      <Container>

        <Grid
          container
          spacing={3}
          justifyContent={{ md: 'space-between' }}
        >
          <Grid item xs={12} md={6} lg={5} display={{ xs: 'none', md: 'block' }}>
            <Image
              alt="about"
              src="/assets/images/image_faq.jpg"
              ratio="4/6"
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Typography variant="h3" sx={{ mb: 5 }}>
              Frequently Asked Questions
            </Typography>
            
            <FaqList />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}


function FaqList() {
  const faqs = [
    {
      id: 1,
      value: 'visiting-time',
      heading: 'Waktu Kunjungan?',
      detail: 'Hari Senin sampai Hari Jum\'at. Pukul 08:00 WITA sampai 16:00 WITA.'
    },
    {
      id: 2,
      value: 'loan-limit',
      heading: 'Berapa Banyak Koleksi yang Dapat Dipinjam?',
      detail: '2 eksemplar/judul di Perpustakan Pusat UHO, sedangkan di perpustakaan Fakultas/Program menyesuaikan kebijakan masing-masing.'
    },
    {
      id: 3,
      value: 'length-of-loan',
      heading: 'Berapa Lama Waktu Peminjaman Koleksi?',
      detail: '10 hari kerja/pinjaman untuk di perpustakaan Pusat UHO, sedangkan di perpustakaan Fakultas/Program menyesuaikan masing-masing.'
    },
    {
      id: 4,
      value: 'loan-extension',
      heading: 'Berapa Kali dapat Dilakukan Perpanjangan Peminjaman Koleksi?',
      detail: 'Perpanjangan koleksi hanya dapat dilakukan sebanyak satu kali, selanjutnya harus menghubungi petugas untuk memperpanjang kembali.'
    },
    {
      id: 5,
      value: 'late-charge',
      heading: 'Berapa Besar Denda Keterlambatan Pengembalian Koleksi?',
      detail: '2000 rupiah / hari / eksemplar di Perpustakaan Pusat, sedangkan di Perpustakaan Fakultas/Sekolah sesuai kebijakan masing-masing.'
    },
    {
      id: 6,
      value: 'freedom-of-use',
      heading: 'Apakah Sivitas Akademika Bebas Menggunakan Wi-Fi atau Fasilitas Hotspot di Perpustakaan?',
      detail: 'YA. Sivitas akademika UHO dapat memanfaatkan wifi/hotspot di perpustakaan dengan menggunakan akun yang tersedia.'
    },
  ]

  return (
    <div>
      {faqs.map((accordion) => (
        <Accordion key={accordion.id}>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">{accordion.heading}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>{accordion.detail}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}