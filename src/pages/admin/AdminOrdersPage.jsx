import { useEffect, useState } from 'react'
import api from '../../utils/api'
import styles from './AdminOrdersPage.module.css'

const STATUS_LABEL = {
  PENDING:            '결제 대기',
  PAID:               '결제 완료',
  REFUNDED:           '환불 완료',
  PARTIALLY_REFUNDED: '부분 환불',
  CANCELLED:          '취소됨',
}

const STATUS_OPTIONS = ['PENDING', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED']

const STATUS_CLS = {
  PENDING: 'pending', PAID: 'paid',
  REFUNDED: 'refunded', PARTIALLY_REFUNDED: 'refunded', CANCELLED: 'cancelled',
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/api/admin/orders')
      .then((res) => {
        const d = res.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.data) ? d.data
          : []
        setOrders(list)
      })
      .catch(() => setError('주문 목록을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (merchantUid, newStatus) => {
    try {
      await api.patch(`/api/admin/orders/${merchantUid}/status`, { status: newStatus })
      setOrders((prev) =>
        prev.map((o) => o.merchantUid === merchantUid ? { ...o, status: newStatus } : o)
      )
      if (selected?.merchantUid === merchantUid) {
        setSelected((prev) => ({ ...prev, status: newStatus }))
      }
    } catch {
      alert('상태 변경에 실패했습니다.')
    }
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>주문 관리</h1>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.loading}>불러오는 중...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>구매자명</th>
                <th>상품명</th>
                <th>금액</th>
                <th>상태</th>
                <th>주문일</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.empty}>주문 내역이 없습니다.</td>
                </tr>
              )}
              {orders.map((order) => {
                const cls = STATUS_CLS[order.status] ?? 'pending'
                const buyerName =
                  order.buyerName ||
                  safeDecodeURIComponent(order.buyer?.memberName)
                return (
                  <tr key={order.merchantUid}>
                    <td className={styles.mono}>{order.merchantUid}</td>
                    <td>{buyerName}</td>
                    <td className={styles.itemTitle}>{order.item?.title ?? '-'}</td>
                    <td className={styles.price}>{order.totalPrice?.toLocaleString()}원</td>
                    <td>
                      <select
                        className={`${styles.statusSelect} ${styles[cls]}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.merchantUid, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.dateCell}>{formatDate(order.createdAt)}</td>
                    <td>
                      <button
                        className={styles.detailBtn}
                        onClick={() => setSelected(order)}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>주문 상세</h2>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <dl className={styles.dl}>
                <div className={styles.dlRow}>
                  <dt>주문번호</dt>
                  <dd className={styles.mono}>{selected.merchantUid}</dd>
                </div>
                <div className={styles.dlRow}>
                  <dt>상품명</dt>
                  <dd>{selected.item?.title ?? '-'}</dd>
                </div>
                <div className={styles.dlRow}>
                  <dt>결제 금액</dt>
                  <dd>{selected.totalPrice?.toLocaleString()}원</dd>
                </div>
                {selected.refundedAmount > 0 && (
                  <div className={styles.dlRow}>
                    <dt>환불 금액</dt>
                    <dd className={styles.refund}>{selected.refundedAmount?.toLocaleString()}원</dd>
                  </div>
                )}
                <div className={styles.divider} />
                <div className={styles.dlRow}>
                  <dt>구매자 이름</dt>
                  <dd>{selected.buyerName || safeDecodeURIComponent(selected.buyer?.memberName)}</dd>
                </div>
                <div className={styles.dlRow}>
                  <dt>연락처</dt>
                  <dd>{selected.buyerTel || '-'}</dd>
                </div>
                <div className={styles.dlRow}>
                  <dt>배송지</dt>
                  <dd>{selected.buyerAddr || '-'}</dd>
                </div>
                <div className={styles.divider} />
                <div className={styles.dlRow}>
                  <dt>주문일시</dt>
                  <dd>{formatDate(selected.createdAt)}</dd>
                </div>
                <div className={styles.dlRow}>
                  <dt>결제일시</dt>
                  <dd>{formatDate(selected.paidAt)}</dd>
                </div>
                <div className={styles.dlRow}>
                  <dt>상태</dt>
                  <dd>
                    <select
                      className={`${styles.statusSelect} ${styles[STATUS_CLS[selected.status] ?? 'pending']}`}
                      value={selected.status}
                      onChange={(e) => handleStatusChange(selected.merchantUid, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
