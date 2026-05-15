import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <p><span>상호명</span> 콜로니드롭0079 (ColonyDrop0079)</p>
          <p><span>대표자명</span> 김정규</p>
          <p><span>사업자등록번호</span> 726-58-00869</p>
          <p><span>주소</span> 경기도 수원시 권선구 권선로 509번길 5</p>
          <p><span>이메일</span> wjdrb0918@naver.com</p>
        </div>
        <div className={styles.links}>
          <Link to="/terms">이용약관</Link>
          <span className={styles.divider}>|</span>
          <Link to="/privacy">개인정보처리방침</Link>
          <span className={styles.divider}>|</span>
          <Link to="/refund">환불정책</Link>
        </div>
        <p className={styles.copy}>© 2026 ColonyDrop0079. All rights reserved.</p>
      </div>
    </footer>
  )
}
