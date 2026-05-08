import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import styles from './PaymentPage.module.css'

const IMP_CODE = 'imp42571221'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product

  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  if (!product) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <p className={styles.errorMsg}>상품 정보가 없습니다.</p>
          <button className={styles.backBtn} onClick={() => navigate('/products')}>
            상품 목록으로
          </button>
        </main>
      </>
    )
  }

  const handlePayment = async () => {
    setError('')
    setPaying(true)

    let merchantUid

    try {
      // 1. 주문 생성
      const { data: order } = await api.post('/api/orders', {
        productId: product.id,
        quantity: 1,
      })
      merchantUid = order.merchantUid ?? order.orderId ?? `order_${Date.now()}`
    } catch {
      setError('주문 생성에 실패했습니다.')
      setPaying(false)
      return
    }

    // 2. 포트원 결제창 호출
    const IMP = window.IMP
    IMP.init(IMP_CODE)

    IMP.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: product.name,
        amount: product.price,
        buyer_name: '',
        buyer_email: '',
        buyer_tel: '',
      },
      async (rsp) => {
        if (!rsp.success) {
          setError(rsp.error_msg ?? '결제가 취소되었습니다.')
          setPaying(false)
          return
        }

        // 3. 결제 검증
        try {
          await api.post('/api/payment/verify', {
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
          })
          navigate('/orders')
        } catch {
          setError('결제 검증에 실패했습니다. 고객센터에 문의해주세요.')
          setPaying(false)
        }
      }
    )
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h2 className={styles.heading}>결제</h2>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>주문 상품</h3>
          <div className={styles.productRow}>
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className={styles.thumb} />
            )}
            <div>
              <p className={styles.productName}>{product.name}</p>
              <p className={styles.productPrice}>{product.price?.toLocaleString()}원</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>결제 금액</h3>
          <div className={styles.totalRow}>
            <span>총 결제 금액</span>
            <span className={styles.totalAmount}>{product.price?.toLocaleString()}원</span>
          </div>
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <button
          className={styles.payBtn}
          onClick={handlePayment}
          disabled={paying}
        >
          {paying ? '결제 처리 중...' : `${product.price?.toLocaleString()}원 결제하기`}
        </button>

        <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
          취소
        </button>
      </main>
    </>
  )
}
