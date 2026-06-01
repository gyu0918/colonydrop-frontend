import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { token, logout, nickname } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = (() => {
    if (!token) return false
    try {
      const raw = token.startsWith('Bearer ') ? token.slice(7) : token
      const payload = JSON.parse(atob(raw.split('.')[1]))
      return payload.roles === 'ROLE_ADMIN'
    } catch {
      return false
    }
  })()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      {/* 메인 영역 */}
      <div className={styles.mainSection}>
        <Link to="/" className={styles.logo}>colonydrop0079</Link>

        <div className={styles.links}>
          <Link to="/products" className={styles.link}>전체 상품</Link>
          {token && <Link to="/orders" className={styles.link}>주문 내역</Link>}
          {token && <Link to="/support/my" className={styles.link}>고객센터</Link>}
          {token && isAdmin && <Link to="/admin" className={styles.link}>관리자</Link>}
        </div>
      </div>

      {/* 채팅창 위 오른쪽 영역 */}
      <div className={styles.chatSection}>
        {token ? (
          <>
            <span className={styles.nickname}>{nickname ?? '회원'}님</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <button className={styles.loginBtn} onClick={() => navigate('/login', { state: { from: location.pathname } })}>
            로그인
          </button>
        )}
      </div>
    </nav>
  )
}