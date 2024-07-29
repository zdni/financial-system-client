import { Helmet } from 'react-helmet-async'

import Login from '../../sections/auth/Login'

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Login | Cash Draw Simple Recording System</title>
      </Helmet>

      <Login />
    </>
  )
}