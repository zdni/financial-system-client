import { useAuthContext } from './useAuthContext';
import { Navigate } from 'react-router-dom'

// ----------------------------------------------------------------------

export default function RoleBasedGuard({ hasContent, roles, children }) {
  const { user } = useAuthContext();

  const currentRole = user?.role; // admin;

  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return <Navigate to='/403' />
  }

  return <>{children}</>
}
