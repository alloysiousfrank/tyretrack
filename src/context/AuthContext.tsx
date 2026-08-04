import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  userName: string
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [userName, setUserName] = useState('')

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('latestBookingId')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('loginTimestamp')

    setUserName('')
    setIsLoggedIn(false)
  }

  const isSessionExpired = () => {
    const loginTimestamp = localStorage.getItem('loginTimestamp')

    if (!loginTimestamp) return false

    return (
      Date.now() - Number(loginTimestamp) > SESSION_DURATION_MS
    )
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('userName')

    if (savedUser) {

      if (isSessionExpired()) {
        clearSession()
      } else {
        setUserName(savedUser)
        setIsLoggedIn(true)
      }

    }

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        clearSession()
      }
    }, 5 * 60 * 1000) // check every 5 minutes

    return () => clearInterval(interval)

  }, [])

  const login = (name: string) => {
    localStorage.setItem('userName', name)

    setUserName(name)

    setIsLoggedIn(true)
  }

  const logout = () => {
    clearSession()
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return context
}