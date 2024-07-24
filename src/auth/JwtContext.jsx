import { createContext, useEffect, useReducer } from 'react'
//
import { isValidToken, setSession } from './utils'
// 
import { authLogin, getUserFromToken } from '../helpers/backend_helper'
// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...
const Types = {
  INITIAL: 'INITIAL',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
}
// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
}

const reducer = (state, action) => {
  if (action.type === Types.INITIAL) {
    const {isAuthenticated, user} = action.payload
    return { isInitialized: true, isAuthenticated, user }
  }
  if (action.type === Types.LOGIN) {
    const {user} = action.payload
    return { ...state, isAuthenticated: true, user }
  }
  if (action.type === Types.LOGOUT) {
    return { ...state, isAuthenticated: false, user: null }
  }
  return state
}

// ----------------------------------------------------------------------

export const AuthContext = createContext(null)

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken)
          
          const response = await getUserFromToken(accessToken)
  
          const user = response.data.data
  
          dispatch({
            type: Types.INITIAL,
            payload: { isAuthenticated: true, user }
          })
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: { isAuthenticated: false, user: null }
          })
        }
      } catch (error) {
        dispatch({
          type: Types.INITIAL,
          payload: { isAuthenticated: false, user: null }
        })
      }
    }

    initialize()
  }, [])

  // LOGIN
  const login = async (email, password) => {
    const response = await authLogin({ email, password })
    const data = response.data
    const code = response.status
    
    if(data.status) {
      const { accessToken, user } = data.data
  
      localStorage.setItem('accessToken', JSON.stringify(accessToken))
      setSession(accessToken)
      dispatch({ type: Types.LOGIN, payload: { user } })
    }
    return { ...data, code }
    
  }

  // LOGOUT
  const logout = async () => {
    setSession(null)
    dispatch({ type: Types.LOGOUT })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
