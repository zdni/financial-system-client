import { Helmet } from 'react-helmet-async'
// @mui
import { Container } from '@mui/material'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// components
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
// sections
import { DocumentForm } from '../../sections/document'

// ----------------------------------------------------------------------

export default function DocumentFormPage() {
  const { themeStretch } = useSettingsContext()
  return (
    <>
      <Helmet>
        <title>Form Dokumen | Ruang Baca TI UHO</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Form Dokumen"
          links={[
            {
              name: 'Beranda',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dokumen',
              href: PATH_DASHBOARD.document.form,
            },
            {
              name: 'Form',
            },
          ]}
        />

        <DocumentForm />
      </Container>
    </>
  )
}