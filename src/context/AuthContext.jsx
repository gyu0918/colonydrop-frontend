import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const parseToken = (t) => {
  try {
    return JSON.parse(atob(t.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'))

  const user = token ? parseToken(token) : null
  // 닉네임: JWT 페이로드에서 nickname > name > memberId 순으로 추출
  const nickname = user?.nickname ?? user?.memberName ?? user?.name ?? user?.memberId ?? null

  const login = (newToken) => {
    localStorage.setItem('accessToken', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, user, nickname }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
