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

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [userName, setUserName] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('userName')

    if (savedUser) {
      setUserName(savedUser)
      setIsLoggedIn(true)
    }
  }, [])

  const login = (name: string) => {
    localStorage.setItem('userName', name)

    setUserName(name)

    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('userName')

    setUserName('')

    setIsLoggedIn(false)
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