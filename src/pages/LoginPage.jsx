import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './LoginPage.module.css'

const BACKEND_URL = 'https://api.colonydrop0079.com'

const SOCIAL_PROVIDERS = [
  { id: 'kakao',  label: '카카오로 시작하기', bg: '#FEE500', color: '#000' },
  { id: 'naver',  label: '네이버로 시작하기', bg: '#03C75A', color: '#fff' },
  { id: 'google', label: '구글로 시작하기',   bg: '#fff',    color: '#222', border: '1px solid #ddd' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, token } = useAuth()
  const popupRef = useRef(null)

  useEffect(() => {
    if (token) navigate('/', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    const handleMessage = (e) => {
      const accessToken =
        e.data?.accessToken ?? e.data?.token ?? e.data?.access_token
      if (!accessToken) return

      // 팝업 닫기
      popupRef.current?.close()

      login(accessToken)

      const state = location.state
      if (state?.product) {
        navigate('/payment', { state: { product: state.product } })
      } else {
        navigate(state?.from ?? '/')
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [login, navigate, location.state])

  const openSocialLogin = (provider) => {
    popupRef.current = window.open(
      `${BACKEND_URL}/oauth2/authorization/${provider}`,
      'socialLogin',
      'width=500,height=700,left=400,top=100'
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>colonydrop0079</div>
        <p className={styles.subtitle}>소셜 계정으로 간편하게 시작하세요</p>

        <div className={styles.buttons}>
          {SOCIAL_PROVIDERS.map((p) => (
            <button
              key={p.id}
              className={styles.socialBtn}
              style={{ background: p.bg, color: p.color, border: p.border ?? 'none' }}
              onClick={() => openSocialLogin(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
