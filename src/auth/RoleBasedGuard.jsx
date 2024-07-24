import { Navigate } from 'react-router-dom'

// ----------------------------------------------------------------------

export default function RoleBasedGuard({ roles, user, children }) {
  if (typeof roles !== 'undefined' && !roles.includes(user?.role)) {
    // return <Navigate to='/403' />
  }

  return <>{children}</>
}
