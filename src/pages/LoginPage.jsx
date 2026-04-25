import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // POST /api/login — body: { email, password }
      const res = await axios.post('/api/login', form, {
        withCredentials: true, // refreshToken 쿠키 받기
      })

      // Authorization 헤더에서 access token 추출
      const authHeader = res.headers['authorization']
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '')
        localStorage.setItem('accessToken', token)
        onLogin(token)
        navigate('/dashboard')
      } else {
        setError('토큰을 받지 못했습니다.')
      }
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (status === 403) {
        setError('접근이 거부되었습니다.')
      } else {
        setError(`서버 오류 (${status ?? 'network error'})`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ColonyDrop</h1>
        <p className={styles.subtitle}>건담 한정판 드롭 플랫폼</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
