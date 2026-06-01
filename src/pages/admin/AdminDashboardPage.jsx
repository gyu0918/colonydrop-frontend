import { useEffect, useState } from 'react'
import api from '../../utils/api'
import styles from './AdminDashboardPage.module.css'

const STATUS_LABEL = {
  PENDING:            { text: '결제 대기',  cls: 'pending'   },
  PAID:               { text: '결제 완료',  cls: 'paid'      },
  REFUNDED:           { text: '환불 완료',  cls: 'refunded'  },
  PARTIALLY_REFUNDED: { text: '부분 환불',  cls: 'refunded'  },
  CANCELLED:          { text: '취소됨',    cls: 'cancelled' },
}

const safeDecodeURIComponent = (str) => {
  if (!str) return '-'
  try { return decodeURIComponent(str) } catch { return str }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [supports, setSupports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/items').catch(() => ({ data: [] })),
      api.get('/api/admin/orders').catch(() => ({ data: [] })),
      api.get('/api/admin/support').catch(() => ({ data: [] })),
    ]).then(([itemRes, orderRes, supportRes]) => {
      const parseList = (d) =>
        Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.data) ? d.data
          : []
      setItems(parseList(itemRes.data))
      setOrders(parseList(orderRes.data))
      setSupports(parseList(supportRes.data))
    }).finally(() => setLoading(false))
  }, [])

  const paidCount = orders.filter((o) => o.status === 'PAID').length
  const pendingSupport = supports.filter((s) => s.status === 'PENDING').length
  const recentOrders = [...orders].slice(0, 5)

  if (loading) {
    return <p className={styles.loading}>불러오는 중...</p>
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>대시보드</h1>

      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>전체 상품</p>
          <p className={styles.cardValue}>{items.length.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>전체 주문</p>
          <p className={styles.cardValue}>{orders.length.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>결제 완료</p>
          <p className={`${styles.cardValue} ${styles.green}`}>{paidCount.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>미답변 문의</p>
          <p className={`${styles.cardValue} ${styles.orange}`}>{pendingSupport.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>최근 주문 5건</h2>
        {recentOrders.length === 0 ? (
          <p className={styles.empty}>주문이 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>구매자</th>
                  <th>상품명</th>
                  <th>금액</th>
                  <th>상태</th>
                  <th>주문일</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const s = STATUS_LABEL[order.status] ?? { text: order.status, cls: 'pending' }
                  return (
                    <tr key={order.merchantUid}>
                      <td className={styles.mono}>{order.merchantUid}</td>
                      <td>{safeDecodeURIComponent(order.buyer?.memberName) || order.buyerName || '-'}</td>
                      <td>{order.item?.title ?? '-'}</td>
                      <td>{order.totalPrice?.toLocaleString()}원</td>
                      <td>
                        <span className={`${styles.badge} ${styles[s.cls]}`}>{s.text}</span>
                      </td>
                      <td className={styles.dateCell}>{formatDate(order.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
