import { Navigate } from 'react-router-dom'
// routes
import { PATH_DASHBOARD } from '../routes/paths'
// components
import LoadingScreen from '../components/loading-screen'
//
import { useAuthContext } from './useAuthContext'

// ----------------------------------------------------------------------
export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext()

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />
  }

  if (!isInitialized) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
