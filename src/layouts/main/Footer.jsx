import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Box, Grid, Link, Stack, Divider, Container, Typography } from '@mui/material'
// components
import Logo from '../../components/logo'

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Link Terkait',
    children: [
      { name: 'Website Resmi Universitas Halu Oleo', href: 'https://www.uho.ac.id/' },
      { name: 'Jurnal Proquest', href: 'https://www.proquest.com/' },
      { name: 'Perpustakaan Nasional', href: 'https://www.perpusnas.go.id/' },
      { name: 'OJS', href: 'http://ojs.uho.ac.id/' },
    ],
  },
  {
    headline: 'Kontak Kami',
    children: [
      { name: 'Telp: 0401-3190105 | Fax: 0401', href: '#' },
      { name: 'elibraryuho@gmail.com', href: '#' },
      { name: 'Gedung UPT Perpustakaan Universitas Halu Oleo Kampus Hijau Bumi Tridharma Anduonou Kendari, 93132', href: '#' },
    ],
  },
]

// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        backgroundColor: '#F4F6F8',
      }}
    >
      <Divider />

      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
          sx={{
            textAlign: {
              xs: 'center',
              md: 'left',
            },
          }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>

          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              UPT Perpustakaan Universitas Halu Oleo Menjadikan UPT perpustakaan uho sebagai unit pendukung akademik yang tanggap terhadap kebutuhan pusat informasi bagi pemustaka dalam upaya mewujudkan uho menjadi 250 perguruan tinggi terdepan di dunia untuk benua maritime dalam iptek, harmonisasi dan kesejahtraan yang berkelanjutan.
            </Typography>

          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              justifyContent="space-between"
              direction={{ xs: 'column', md: 'row' }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      component={RouterLink}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 10,
            pb: 5,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © Cash Draw Simple Recording System.
        </Typography>
      </Container>
    </Box>
  )
}
