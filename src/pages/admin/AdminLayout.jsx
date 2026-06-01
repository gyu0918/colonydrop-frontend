import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'

function PrivateAdminRoute({ children }) {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (user?.roles !== 'ROLE_ADMIN') return <Navigate to="/" replace />
  return children
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const nickname = (() => {
    const raw = user?.memberName ?? user?.nickname ?? user?.name ?? user?.memberId ?? null
    if (!raw) return null
    try { return decodeURIComponent(raw) } catch { return raw }
  })()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <PrivateAdminRoute>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Colony</span>
            <span className={styles.logoBold}>Drop</span>
            <span className={styles.logoAdmin}>관리자</span>
          </div>
          <nav className={styles.nav}>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.navActive}` : styles.navItem
              }
            >
              <span className={styles.navIcon}>▦</span>
              대시보드
            </NavLink>
            <NavLink
              to="/admin/items"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.navActive}` : styles.navItem
              }
            >
              <span className={styles.navIcon}>☰</span>
              상품 관리
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.navActive}` : styles.navItem
              }
            >
              <span className={styles.navIcon}>◫</span>
              주문 관리
            </NavLink>
            <NavLink
              to="/admin/support"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.navActive}` : styles.navItem
              }
            >
              <span className={styles.navIcon}>✉</span>
              고객문의
            </NavLink>
          </nav>
          <div className={styles.sidebarBottom}>
            <NavLink to="/" className={styles.siteLink}>← 사이트로 이동</NavLink>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.header}>
            <span className={styles.headerUser}>
              {nickname ? `${nickname} 님` : '관리자'}
            </span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              로그아웃
            </button>
          </header>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </PrivateAdminRoute>
  )
}
