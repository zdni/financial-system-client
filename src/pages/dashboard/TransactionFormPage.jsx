import { Helmet } from 'react-helmet-async'
// mui
import { Container } from '@mui/material'
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../components/settings'
import { PATH_DASHBOARD } from '../../routes/paths'
// sections
import { TransactionForm } from '../../sections/transaction'

// ----------------------------------------------------------------------

export default function TransactionFormPage() {
  const { themeStretch } = useSettingsContext()

  return (
    <>
      <Helmet>
        <title> Form Transaksi | Cash Draw Simple Recording System</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Form Transaksi"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Transaksi',
              href: PATH_DASHBOARD.transaction.root
            },
            {
              name: 'Form',
            },
          ]}
        />

        <TransactionForm />
      </Container>
    </>
  )
}