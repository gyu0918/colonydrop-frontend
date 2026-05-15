import Navbar from '../components/Navbar'
import styles from './PrivacyPage.module.css'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>개인정보처리방침</h1>
          <p className={styles.updated}>최종 업데이트: 2026년 1월 1일</p>

          <p className={styles.intro}>
            콜로니드롭0079(이하 "회사")는 이용자의 개인정보를 소중히 여기며,
            「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을 준수합니다.
          </p>

          <section className={styles.section}>
            <h2>1. 수집하는 개인정보 항목</h2>
            <ul>
              <li>이름</li>
              <li>휴대폰 번호</li>
              <li>배송지 주소</li>
              <li>이메일 주소</li>
              <li>결제 정보 (카드사 등 결제 처리 기관에서 별도 관리)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. 개인정보 수집 목적</h2>
            <ul>
              <li>주문 접수 및 처리</li>
              <li>상품 배송 및 배송 현황 안내</li>
              <li>고객 문의 응대 및 불만 처리</li>
              <li>관련 법령에 따른 의무 이행</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. 개인정보 보유 기간</h2>
            <p>
              구매일로부터 <strong>5년</strong> 보관합니다.
              (전자상거래 등에서의 소비자 보호에 관한 법률 기준)
            </p>
            <p>관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관됩니다.</p>
          </section>

          <section className={styles.section}>
            <h2>4. 제3자 제공</h2>
            <p>이용자의 개인정보는 아래와 같이 제3자에게 제공됩니다.</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>제공 받는 자</th>
                  <th>목적</th>
                  <th>제공 항목</th>
                  <th>보유 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>KG이니시스</td>
                  <td>결제 처리</td>
                  <td>이름, 결제 정보</td>
                  <td>결제 완료 후 5년</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2>5. 개인정보 파기</h2>
            <p>보유 기간이 경과하거나 수집 목적이 달성된 경우 지체 없이 파기합니다.</p>
            <ul>
              <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
              <li>종이 문서: 분쇄 또는 소각</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. 정보주체의 권리</h2>
            <p>이용자는 언제든지 아래 권리를 행사할 수 있습니다.</p>
            <ul>
              <li>개인정보 열람 요청</li>
              <li>개인정보 수정 또는 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
            </ul>
            <p>권리 행사는 아래 이메일로 요청해 주세요.</p>
            <p className={styles.contact}>이메일: wjdrb0918@naver.com</p>
          </section>
        </div>
      </main>
    </>
  )
}
