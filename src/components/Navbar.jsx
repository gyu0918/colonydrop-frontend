import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { token } = useAuth()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>colonydrop0079</Link>

        <div className={styles.links}>
          <Link to="/products" className={styles.link}>전체 상품</Link>
          {token && <Link to="/orders" className={styles.link}>주문 내역</Link>}
        </div>

        <div className={styles.right} />
      </div>
    </nav>
  )
}
