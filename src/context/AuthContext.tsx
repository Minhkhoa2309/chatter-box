// ** React Imports
import { createContext, useState, ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter, usePathname } from 'next/navigation'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { authMe, login } from '../actions/auth/jwt'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
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
      const storedAccessToken = window.localStorage.getItem('accessToken')!;
      const storedRefreshToken = window.localStorage.getItem('refreshToken')!;
      if (storedAccessToken && storedRefreshToken) {
        setLoading(true)
        await authMe(storedAccessToken, storedRefreshToken)
          .then(async ([status, response]) => {
            setLoading(false)
            if (status === 200) {
              setUser(response.userData); // Update user state here
            }
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (!pathname.includes('login')) {
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
    login(params)
      .then(async response => {
        console.log(response);
        
        setUser({ ...response.user })

        response.accessToken && window.localStorage.setItem('accessToken', response.accessToken);
        response.refreshToken && window.localStorage.setItem('refreshToken', response.refreshToken);

        router.replace('/')
      })
      .catch(err => {
        console.log(err);
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('accessToken')
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
