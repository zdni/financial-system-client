import { Suspense, lazy } from 'react'
// components
import LoadingScreen from '../components/loading-screen'

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  )

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')))

// TEST RENDER PAGE BY ROLE
// export const PermissionDeniedPage = Loadable(
//   lazy(() => import('../pages/dashboard/PermissionDeniedPage'))
// )

// DASHBOARD
export const AccountsPage = Loadable(lazy(() => import('../pages/dashboard/AccountsPage')))
export const DashboardPage = Loadable(lazy(() => import('../pages/dashboard/DashboardPage')))
export const TransactionFormPage = Loadable(lazy(() => import('../pages/dashboard/TransactionFormPage')))
export const TransactionDetailPage = Loadable(lazy(() => import('../pages/dashboard/TransactionDetailPage')))
export const TransactionExportPage = Loadable(lazy(() => import('../pages/dashboard/TransactionExportPage')))
export const TransactionsPage = Loadable(lazy(() => import('../pages//dashboard/TransactionsPage')))
export const UserPage = Loadable(lazy(() => import('../pages/dashboard/UserPage')))
export const UsersPage = Loadable(lazy(() => import('../pages/dashboard/UsersPage')))
export const VendorsPage = Loadable(lazy(() => import('../pages/dashboard/VendorsPage')))

// EXPORT
export const PDFPage = Loadable(lazy(() => import('../pages/export/PDFPage')))

// MAIN
export const Page403 = Loadable(lazy(() => import('../pages/Page403')))
export const Page404 = Loadable(lazy(() => import('../pages/Page404')))
export const Page500 = Loadable(lazy(() => import('../pages/Page500')))