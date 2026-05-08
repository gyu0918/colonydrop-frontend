import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          {/* 배경 동영상 - public/hero.mp4 파일을 넣으면 자동 재생됩니다 */}
          <video
            className={styles.videoBg}
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className={styles.overlay} />

          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>COLONYDROP<br />0079</h1>
            <p className={styles.heroDesc}>1차 판매 기간 <br/>5월 17일 오후 9:00</p>
            <button className={styles.heroCta} onClick={() => navigate('/products')}>
              전체 상품 보기
            </button>
          </div>
        </section>
      </main>
    </>
  )
}
