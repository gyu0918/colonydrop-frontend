import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { token, logout, nickname } = useAuth()
  const navigate = useNavigate()

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
        </div>

        <div className={styles.right}>
          {token ? (
            <>
              <span className={styles.nickname}>{nickname ?? '회원'}님</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
