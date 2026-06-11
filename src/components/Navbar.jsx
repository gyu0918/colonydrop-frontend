import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { token, logout, nickname } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

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
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={styles.nav}>
      {/* 메인 영역 */}
      <div className={styles.mainSection}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>colonydrop0079</Link>

        <div className={styles.links}>
          <Link to="/products" className={styles.link}>전체 상품</Link>
          {token && <Link to="/orders" className={styles.link}>주문 내역</Link>}
          {token && <Link to="/support/my" className={styles.link}>고객센터</Link>}
          {token && isAdmin && <Link to="/admin" className={styles.link}>관리자</Link>}
        </div>

        {/* 햄버거 버튼 - 모바일 전용 */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="메뉴"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 채팅창 위 오른쪽 영역 - 데스크탑 전용 */}
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

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/products" className={styles.mobileLink} onClick={closeMenu}>전체 상품</Link>
          {token && <Link to="/orders" className={styles.mobileLink} onClick={closeMenu}>주문 내역</Link>}
          {token && <Link to="/support/my" className={styles.mobileLink} onClick={closeMenu}>고객센터</Link>}
          {token && isAdmin && <Link to="/admin" className={styles.mobileLink} onClick={closeMenu}>관리자</Link>}
          <div className={styles.mobileDivider} />
          {token ? (
            <div className={styles.mobileUser}>
              <span className={styles.mobileNickname}>{nickname ?? '회원'}님</span>
              <button className={styles.mobileLogoutBtn} onClick={handleLogout}>로그아웃</button>
            </div>
          ) : (
            <button
              className={styles.mobileLoginBtn}
              onClick={() => { navigate('/login', { state: { from: location.pathname } }); closeMenu() }}
            >
              로그인
            </button>
          )}
        </div>
      )}
    </nav>
  )
}