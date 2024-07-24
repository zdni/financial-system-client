import { Helmet } from 'react-helmet-async'
// mui
import { Container } from '@mui/material'
// sections
import { OrderList } from '../../sections/order'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../components/settings'

// ----------------------------------------------------------------------

export default function OrdersPage() {
  const { themeStretch } = useSettingsContext()
  return (
    <>
      <Helmet>
        <title> Daftar Peminjaman | Ruang Baca TI UHO</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Daftar Peminjaman"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Peminjaman',
              href: PATH_DASHBOARD.order.root,
            },
            {
              name: 'Daftar',
            },
          ]}
        />

        <OrderList />
      </Container>
    </>
  )
}