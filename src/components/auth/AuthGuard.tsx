// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter, usePathname } from 'next/navigation'

// ** Hooks Import
import { useAuth } from '@/src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter();
  const pathname = usePathname();

  useEffect(
    () => {
      if (auth.user === null && !window.localStorage.getItem('userData')) {
          router.replace('/login')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  )

  if (auth.user === null && pathname == '/login') {
    return <>{children}</>
  }

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
