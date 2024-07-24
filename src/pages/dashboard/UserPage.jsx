import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// @mui
import { Tab, Tabs, Container, Box } from '@mui/material'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// components
import Iconify from '../../components/iconify'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../components/settings'
// sections
import { OrderList } from '../../sections/order'
import { FormUserChangePwd, UserProfile } from '../../sections/user'
import { getUser } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

export default function UserPage() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { themeStretch } = useSettingsContext()

  const { user } = useAuthContext()
  const { id } = useParams()

  const [data, setData] = useState(false)
  const [currentTab, setCurrentTab] = useState('general')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(id) {
      async function fetchData() {
        const response = await getUser(id, { headers: { authorization: `Bearer ${TOKEN}` } })
        const { data, status } = response.data
        if(status) {
          setData(data)
        }
        setLoading(true)
      }
      fetchData()
    } else {
      setData(user)
      setLoading(true)
    }
  }, [TOKEN, id, user])

  const TABS = []
  if(loading) {
    TABS.push({
      value: 'general',
      label: 'Profil',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <UserProfile user={data} />
    })
    if(!id) {
      TABS.push({
        value: 'change-password',
        label: 'Ubah Password',
        icon: <Iconify icon="ic:twotone-verified-user" />,
        component: <FormUserChangePwd user={data} />
      })
    }

    if(!['admin', 'staff'].includes(data?.role) || id) {
      TABS.push({
        value: 'list-of-loans',
        label: 'Peminjaman',
        icon: <Iconify icon="eva:calendar-fill" />,
        component: <OrderList userId={data?._id} />
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>Pengguna | Ruang Baca TI UHO</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Profil"
          links={[
            { name: 'Dashboard' },
            { name: 'Pengguna', href: PATH_DASHBOARD.user.list },
            { name: data?.name },
          ]}
        />
        {loading && (
          <>
          <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>

          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value} sx={{ mt: 5 }}>
                  {tab.component}
                </Box>
              )
          )}
          </>
        )}
      </Container>
    </>
  )
}