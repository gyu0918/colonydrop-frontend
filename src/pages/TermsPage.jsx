import styles from './TermsPage.module.css'

export default function TermsPage() {
  return (
    <>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>이용약관</h1>
          <p className={styles.updated}>최종 업데이트: 2026년 1월 1일</p>

          <section className={styles.section}>
            <h2>제1조 목적</h2>
            <p>
              본 약관은 콜로니드롭0079(이하 "회사")가 운영하는 ColonyDrop 온라인 쇼핑몰(이하 "서비스")의
              이용 조건과 절차, 회사와 이용자 간의 권리·의무 및 책임사항을 규정합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2>제2조 회원가입</h2>
            <ul>
              <li>서비스 이용을 위해 회원가입이 필요합니다.</li>
              <li>만 14세 이상이면 누구나 가입하실 수 있습니다.</li>
              <li>정확한 정보를 입력해 주세요. 허위 정보로 인한 불이익은 회원 본인이 부담합니다.</li>
              <li>계정 정보는 타인과 공유하지 마세요.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>제3조 구매 및 결제</h2>
            <ul>
              <li>상품 구매 시 표시된 가격으로 결제됩니다.</li>
              <li>결제는 KG이니시스를 통해 안전하게 처리됩니다.</li>
              <li>
                주문 완료 후 재고 부족 등의 사유로 주문이 취소될 수 있으며,
                이 경우 즉시 전액 환불됩니다.
              </li>
              <li>한정판 상품의 경우 1인당 구매 수량이 제한될 수 있습니다.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>제4조 서비스 이용 제한</h2>
            <p>아래 행위가 확인될 경우 서비스 이용이 제한될 수 있습니다.</p>
            <ul>
              <li>허위 주문 또는 결제 시도</li>
              <li>부정한 방법으로 타인의 계정 사용</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>본 약관 및 관련 법령을 위반하는 행위</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>제5조 면책 조항</h2>
            <ul>
              <li>천재지변, 서버 장애 등 불가항력적인 상황으로 서비스 제공이 중단될 수 있습니다.</li>
              <li>이용자가 게시한 정보로 인한 손해는 회사가 책임지지 않습니다.</li>
              <li>회사는 서비스 개선을 위해 사전 공지 후 내용을 변경할 수 있습니다.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>제6조 문의</h2>
            <p>약관에 관한 문의는 아래 이메일로 연락해 주세요.</p>
            <p className={styles.contact}>이메일: wjdrb0918@naver.com</p>
          </section>
        </div>
      </main>
    </>
  )
}
