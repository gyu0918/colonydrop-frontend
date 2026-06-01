import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { token, logout, nickname } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // JWT에서 roles 꺼내기
  const isAdmin = (() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
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
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>colonydrop0079</Link>

        <div className={styles.links}>
          <Link to="/products" className={styles.link}>전체 상품</Link>
          {token && <Link to="/orders" className={styles.link}>주문 내역</Link>}
          {token && <Link to="/support" className={styles.link}>고객센터</Link>}  {/* ← 추가 */}
          {token && isAdmin && <Link to="/admin" className={styles.link}>관리자</Link>}  {/* ← 추가 */}
        </div>

        <div className={styles.right}>
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
      </div>
    </nav>
  )
}