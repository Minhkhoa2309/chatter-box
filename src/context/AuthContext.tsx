// ** React Imports
import { createContext, useState, ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter, usePathname } from 'next/navigation'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType, RegisterParams } from './types'
import axios from 'axios'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem('accessToken')!
      if (storedToken) {
        setLoading(true)
        await axios
          .get('api/auth/authMe', {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (pathname && !pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('api/auth/login', params)
      .then(async response => {
        params.rememberMe
          ? window.localStorage.setItem('accessToken', response.data.accessToken)
          : null

        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null

        setUser({ ...response.data.userData })

        response.data.accessToken && window.localStorage.setItem('accessToken', response.data.accessToken);

        router.replace('/')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('accessToken')
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('api/auth/register', params)
      .then(async response => {
        window.localStorage.setItem('accessToken', response.data.accessToken)

        setUser({ ...response.data.userData })

        response.data.accessToken && window.localStorage.setItem('accessToken', response.data.accessToken);

        router.replace('/')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
