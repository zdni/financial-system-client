import { Navigate, useRoutes } from 'react-router-dom'
// auth
import AuthGuard from '../auth/AuthGuard'
import GuestGuard from '../auth/GuestGuard'
// layouts
import CompactLayout from '../layouts/compact'
import DashboardLayout from '../layouts/dashboard'
//
import {
  // Auth
  LoginPage,
  // Dashboard
  AccountsPage,
  DashboardPage,
  TransactionFormPage,
  TransactionsPage,
  UserPage,
  UsersPage,
  VendorsPage,
  // Compact
  Page403,
  Page404,
  Page500,
  // Export
  PDFPage,
} from './elements'

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        { path: 'login', element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ) },
      ],
    },

    // User Routes
    {
      path: 'beranda',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <DashboardPage />, index: true },
        { 
          path: 'transaksi', 
          children: [
            { element: <TransactionsPage />, index: true },
            { path: 'form', element: <TransactionFormPage /> },
          ]
        },
        {
          path: 'pengguna',
          children: [
            { element: <UserPage />, index: true },
            { path: ':id', element: <UserPage /> },
          ]
        },
        {
          path: 'manajemen',
          children: [
            { path: 'akun', element: <AccountsPage />},
            { path: 'vendor', element: <VendorsPage />},
            { path: 'pengguna', element: <UsersPage />},
          ]
        },
      ]
    },

    // Main Routes
    { element: <Navigate to={'beranda'} replace />, index: true },
    { element: <PDFPage />, path: 'export-pdf' },
    {
      element: <CompactLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}