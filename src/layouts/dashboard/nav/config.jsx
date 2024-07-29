// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// components
import SvgColor from '../../../components/svg-color'

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
  user: icon('ic_user'),
  master: icon('ic_dashboard'),
  transaction: icon('ic_calendar'),
  account: icon('ic_invoice'),
  vendor: icon('ic_label'),
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.root, icon: ICONS.master, roles: ['superadmin', 'admin', 'staff'] },
      { title: 'Transaksi', path: PATH_DASHBOARD.transaction.root, icon: ICONS.transaction, roles: ['superadmin', 'admin'] },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'pengaturan',
    items: [
      { title: 'Akun', path: PATH_DASHBOARD.management.account, icon: ICONS.account, roles: ['superadmin', 'admin', 'staff'] },
      { title: 'Vendor', path: PATH_DASHBOARD.management.vendor, icon: ICONS.vendor, roles: ['superadmin', 'admin', 'staff'] },
      { title: 'Pengguna', path: PATH_DASHBOARD.management.user, icon: ICONS.user, roles: ['superadmin', 'admin'] },
    ],
  },
]

export default navConfig
