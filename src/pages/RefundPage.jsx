import styles from './RefundPage.module.css'

export default function RefundPage() {
  return (
    <>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>환불 정책</h1>
          <p className={styles.updated}>최종 업데이트: 2026년 1월 1일</p>

          <section className={styles.section}>
            <h2>환불 가능 기간</h2>
            <p>
              상품 수령 후 <strong>7일 이내</strong>에 환불 신청이 가능합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2>환불 불가 조건</h2>
            <p>아래 경우에는 환불이 어려울 수 있으니 양해 부탁드립니다.</p>
            <ul>
              <li>상품을 개봉하거나 사용한 경우</li>
              <li>이용자의 과실로 상품이 파손된 경우</li>
              <li>상품을 분실한 경우</li>
              <li>한정판 또는 특별 행사 상품으로 환불 불가 안내가 된 경우</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>환불 신청 방법</h2>
            <p>
              아래 이메일로 주문번호와 환불 사유를 함께 보내주시면
              빠르게 처리해 드리겠습니다.
            </p>
            <p className={styles.contact}>이메일: wjdrb0918@naver.com</p>
          </section>

          <section className={styles.section}>
            <h2>환불 처리 기간</h2>
            <p>
              환불 신청 확인 후 <strong>영업일 기준 3~5일</strong> 이내에 처리됩니다.
            </p>
            <p>카드사 정책에 따라 실제 환불 반영까지 추가 시간이 소요될 수 있습니다.</p>
          </section>

          <section className={styles.section}>
            <h2>배송비 안내</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>사유</th>
                  <th>배송비 부담</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>단순 변심</td>
                  <td>고객 부담</td>
                </tr>
                <tr>
                  <td>상품 불량 / 오배송</td>
                  <td>판매자 부담</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  )
}
