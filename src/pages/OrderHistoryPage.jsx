import { useEffect, useState } from 'react'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import styles from './OrderHistoryPage.module.css'

const STATUS_LABEL = {
  PENDING:   { text: '결제 대기',  cls: 'pending'   },
  PAID:      { text: '결제 완료',  cls: 'paid'      },
  REFUNDED:  { text: '환불 완료',  cls: 'refunded'  },
  CANCELLED: { text: '취소됨',    cls: 'cancelled' },
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/orders')
      .then((res) => {
        const d = res.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.orders) ? d.orders
          : []
        setOrders(list)
      })
      .catch(() => setError('주문 내역을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h2 className={styles.heading}>주문 내역</h2>

        {loading && <p className={styles.status}>불러오는 중...</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className={styles.status}>주문 내역이 없습니다.</p>
        )}

        <div className={styles.list}>
          {orders.map((order) => {
            const statusInfo = STATUS_LABEL[order.status] ?? { text: order.status, cls: 'pending' }
            return (
              <div key={order.id ?? order.merchantUid} className={styles.card}>
                <div className={styles.top}>
                  <div>
                    <p className={styles.productName}>{order.productName ?? '상품 정보 없음'}</p>
                    <p className={styles.orderId}>
                      주문번호: {order.merchantUid ?? order.id}
                    </p>
                  </div>
                  <span className={`${styles.badge} ${styles[statusInfo.cls]}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <div className={styles.bottom}>
                  <span className={styles.amount}>
                    {order.amount?.toLocaleString()}원
                  </span>
                  <span className={styles.date}>{formatDate(order.createdAt)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
