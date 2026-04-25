import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import styles from './DashboardPage.module.css'

export default function DashboardPage({ token, onLogout }) {
  const navigate = useNavigate()
  const [testResult, setTestResult] = useState(null)
  const [testLoading, setTestLoading] = useState(false)

  // JWT 페이로드 디코딩 (서명 검증 없이 정보만 확인)
  const parseToken = (t) => {
    try {
      return JSON.parse(atob(t.split('.')[1]))
    } catch {
      return null
    }
  }

  const payload = parseToken(token)
  const expiresAt = payload?.exp ? new Date(payload.exp * 1000).toLocaleString('ko-KR') : '알 수 없음'

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    onLogout()
    navigate('/login')
  }

  // /user/** 경로로 인증 보호된 API 테스트
  const handleTestAuth = async () => {
    setTestLoading(true)
    setTestResult(null)
    try {
      const res = await api.get('/user/test')
      setTestResult({ ok: true, status: res.status, data: res.data })
    } catch (err) {
      setTestResult({
        ok: false,
        status: err.response?.status,
        data: err.response?.data ?? err.message,
      })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>대시보드</h1>
            <p className={styles.memberId}>
              {payload?.memberId ?? '알 수 없는 사용자'}
            </p>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            로그아웃
          </button>
        </div>

        <div className={styles.section}>
          <h2>Access Token 정보</h2>
          <div className={styles.info}>
            <div className={styles.row}>
              <span className={styles.label}>memberId</span>
              <span className={styles.value}>{payload?.memberId ?? '-'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>만료 시각</span>
              <span className={styles.value}>{expiresAt}</span>
            </div>
          </div>
          <details className={styles.rawToken}>
            <summary>토큰 원문 보기</summary>
            <code>{token}</code>
          </details>
        </div>

        <div className={styles.section}>
          <h2>인증 보호 API 테스트</h2>
          <p className={styles.desc}>
            <code>GET /api/user/test</code> 요청 — Spring Security의{' '}
            <code>/user/**</code> 인증 검증 확인
          </p>
          <button
            className={styles.testBtn}
            onClick={handleTestAuth}
            disabled={testLoading}
          >
            {testLoading ? '요청 중...' : '요청 보내기'}
          </button>

          {testResult && (
            <div className={testResult.ok ? styles.resultOk : styles.resultErr}>
              <span className={styles.statusBadge}>
                HTTP {testResult.status}
              </span>
              <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
