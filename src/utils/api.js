import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // refreshToken 쿠키 자동 포함
})

// 요청 인터셉터: 저장된 access token을 헤더에 자동 삽입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터: 401 시 refresh token으로 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const res = await axios.post(
         `${import.meta.env.VITE_API_URL}/auth/refresh`, 
          {}, 
          { withCredentials: true }
        )
        const newToken = res.headers['authorization']?.replace('Bearer ', '')
        if (newToken) {
          localStorage.setItem('accessToken', newToken)
          original.headers['Authorization'] = `Bearer ${newToken}`
          return api(original)
        }
      } catch {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
