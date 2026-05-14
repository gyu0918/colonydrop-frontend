// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import api from '../utils/api'
// import Navbar from '../components/Navbar'
// import styles from './OrderDetailPage.module.css'

// const STATUS_LABEL = {
//   PENDING:            { text: '결제 대기',  cls: 'pending'   },
//   PAID:               { text: '결제 완료',  cls: 'paid'      },
//   REFUNDED:           { text: '환불 완료',  cls: 'refunded'  },
//   PARTIALLY_REFUNDED: { text: '부분 환불',  cls: 'refunded'  },
//   CANCELLED:          { text: '취소됨',    cls: 'cancelled' },
// }

// export default function OrderDetailPage() {
//   const { merchantUid } = useParams()
//   const navigate = useNavigate()

//   const [order, setOrder] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   const [showModal, setShowModal] = useState(false)
//   const [refundReason, setRefundReason] = useState('')
//   const [refunding, setRefunding] = useState(false)
//   const [refundError, setRefundError] = useState('')
//   const [refundSuccess, setRefundSuccess] = useState(false)

//   useEffect(() => {
//     api.get(`/api/orders/${merchantUid}`)
//       .then((res) => setOrder(res.data))
//       .catch(() => setError('주문 정보를 불러오는 데 실패했습니다.'))
//       .finally(() => setLoading(false))
//   }, [merchantUid])

//   const formatDate = (dateStr) => {
//     if (!dateStr) return '-'
//     return new Date(dateStr).toLocaleString('ko-KR', {
//       year: 'numeric', month: '2-digit', day: '2-digit',
//       hour: '2-digit', minute: '2-digit',
//     })
//   }

//   const handleRefund = async () => {
//     setRefunding(true)
//     setRefundError('')
//     try {
//       await api.post('/api/payment/refund', {
//         merchantUid: order.merchantUid,
//         refundAmount: order.totalPrice,
//         refundReason: refundReason.trim(),
//       })
//       setOrder((prev) => ({ ...prev, status: 'REFUNDED' }))
//       setRefundSuccess(true)
//       setShowModal(false)
//     } catch {
//       setRefundError('환불 처리에 실패했습니다. 고객센터에 문의해주세요.')
//     } finally {
//       setRefunding(false)
//     }
//   }

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <main className={styles.main}><p className={styles.status}>불러오는 중...</p></main>
//       </>
//     )
//   }

//   if (error || !order) {
//     return (
//       <>
//         <Navbar />
//         <main className={styles.main}>
//           <p className={styles.errorMsg}>{error || '주문 정보가 없습니다.'}</p>
//           <button className={styles.backBtn} onClick={() => navigate('/orders')}>주문 내역으로</button>
//         </main>
//       </>
//     )
//   }

//   const statusInfo = STATUS_LABEL[order.status] ?? { text: order.status, cls: 'pending' }

//   return (
//     <>
//       <Navbar />
//       <main className={styles.main}>
//         <div className={styles.pageHeader}>
//           <button className={styles.backBtn} onClick={() => navigate('/orders')}>← 주문 내역</button>
//           <h2 className={styles.heading}>주문 상세</h2>
//         </div>

//         {/* 상품 정보 */}
//         <div className={styles.card}>
//           <h3 className={styles.sectionTitle}>주문 상품</h3>
//           <div className={styles.productRow}>
//             {order.itemImgUrl && (
//               <img src={order.itemImgUrl} alt={order.itemTitle} className={styles.thumb} />
//             )}
//             <div>
//               <p className={styles.productName}>{order.itemTitle ?? '상품 정보 없음'}</p>
//               <p className={styles.productPrice}>{order.totalPrice?.toLocaleString()}원</p>
//             </div>
//           </div>
//         </div>

//         {/* 구매자 정보 */}
//         <div className={styles.card}>
//           <h3 className={styles.sectionTitle}>구매자 정보</h3>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>이름</span>
//             <span className={styles.infoValue}>{order.buyerName ?? '-'}</span>
//           </div>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>연락처</span>
//             <span className={styles.infoValue}>{order.buyerTel ?? '-'}</span>
//           </div>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>배송지</span>
//             <span className={styles.infoValue}>{order.buyerAddr ?? '-'}</span>
//           </div>
//         </div>

//         {/* 결제 정보 */}
//         <div className={styles.card}>
//           <h3 className={styles.sectionTitle}>결제 정보</h3>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>결제 금액</span>
//             <span className={`${styles.infoValue} ${styles.totalAmount}`}>
//               {order.totalPrice?.toLocaleString()}원
//             </span>
//           </div>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>주문 상태</span>
//             <span className={`${styles.badge} ${styles[statusInfo.cls]}`}>{statusInfo.text}</span>
//           </div>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>주문 번호</span>
//             <span className={styles.infoValue}>{order.merchantUid}</span>
//           </div>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>주문 일시</span>
//             <span className={styles.infoValue}>{formatDate(order.createdAt)}</span>
//           </div>
//           <div className={styles.infoRow}>
//             <span className={styles.infoLabel}>결제 일시</span>
//             <span className={styles.infoValue}>{formatDate(order.paidAt)}</span>
//           </div>
//         </div>

//         {refundSuccess && (
//           <p className={styles.successMsg}>환불이 완료되었습니다.</p>
//         )}
//         {error && <p className={styles.errorMsg}>{error}</p>}

//         {order.status === 'PAID' && !refundSuccess && (
//           <button className={styles.refundBtn} onClick={() => { setShowModal(true); setRefundError('') }}>
//             환불 신청
//           </button>
//         )}
//       </main>

//       {showModal && (
//         <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
//           <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <h3 className={styles.modalTitle}>환불 신청</h3>
//             <p className={styles.modalDesc}>환불 사유를 입력해주세요.</p>
//             <textarea
//               className={styles.modalInput}
//               placeholder="예: 단순 변심, 상품 불량 등"
//               value={refundReason}
//               onChange={(e) => setRefundReason(e.target.value)}
//               rows={3}
//             />
//             {refundError && <p className={styles.modalError}>{refundError}</p>}
//             <div className={styles.modalActions}>
//               <button
//                 className={styles.modalCancelBtn}
//                 onClick={() => setShowModal(false)}
//                 disabled={refunding}
//               >
//                 취소
//               </button>
//               <button
//                 className={styles.modalConfirmBtn}
//                 onClick={handleRefund}
//                 disabled={!refundReason.trim() || refunding}
//               >
//                 {refunding ? '처리 중...' : '환불 확인'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import styles from './OrderDetailPage.module.css'

const IMP_CODE = 'imp42571221'

const STATUS_LABEL = {
  PENDING:            { text: '결제 대기',  cls: 'pending'   },
  PAID:               { text: '결제 완료',  cls: 'paid'      },
  REFUNDED:           { text: '환불 완료',  cls: 'refunded'  },
  PARTIALLY_REFUNDED: { text: '부분 환불',  cls: 'refunded'  },
  CANCELLED:          { text: '취소됨',    cls: 'cancelled' },
}

export default function OrderDetailPage() {
  const { merchantUid } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [refunding, setRefunding] = useState(false)
  const [refundError, setRefundError] = useState('')
  const [refundSuccess, setRefundSuccess] = useState(false)

  useEffect(() => {
    api.get(`/api/orders/${merchantUid}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('주문 정보를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [merchantUid])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const handleRefund = async () => {
    setRefunding(true)
    setRefundError('')
    try {
      await api.post('/api/payment/refund', {
        merchantUid: order.merchantUid,
        refundAmount: order.totalPrice,
        refundReason: refundReason.trim(),
      })
      setOrder((prev) => ({ ...prev, status: 'REFUNDED' }))
      setRefundSuccess(true)
      setShowModal(false)
    } catch {
      setRefundError('환불 처리에 실패했습니다. 고객센터에 문의해주세요.')
    } finally {
      setRefunding(false)
    }
  }

  const handleResumePayment = () => {
    setError('')
    const IMP = window.IMP
    IMP.init(IMP_CODE)
    IMP.request_pay(
      {
        pg: 'html5_inicis.INIpayTest',
        pay_method: 'card',
        merchant_uid: order.merchantUid,
        name: order.itemTitle,
        amount: order.totalPrice,
        buyer_name: order.buyerName,
        buyer_tel: order.buyerTel,
        buyer_addr: order.buyerAddr,
      },
      async (rsp) => {
        if (!rsp.success) {
          setError(rsp.error_msg ?? '결제가 취소되었습니다.')
          return
        }
        try {
          await api.post('/api/payment/verify', {
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
          })
          navigate('/orders')
        } catch {
          setError('결제 검증에 실패했습니다. 고객센터에 문의해주세요.')
        }
      }
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.main}><p className={styles.status}>불러오는 중...</p></main>
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <p className={styles.errorMsg}>{error || '주문 정보가 없습니다.'}</p>
          <button className={styles.backBtn} onClick={() => navigate('/orders')}>주문 내역으로</button>
        </main>
      </>
    )
  }

  const statusInfo = STATUS_LABEL[order.status] ?? { text: order.status, cls: 'pending' }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => navigate('/orders')}>
            뒤로가기
          </button>
          <h2 className={styles.heading}>주문 상세</h2>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>주문 상품</h3>
          <div className={styles.productRow}>
            {order.itemImgUrl && (
              <img src={order.itemImgUrl} alt={order.itemTitle} className={styles.thumb} />
            )}
            <div>
              <p className={styles.productName}>{order.itemTitle ?? '상품 정보 없음'}</p>
              <p className={styles.productPrice}>{order.totalPrice?.toLocaleString()}원</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>구매자 정보</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>이름</span>
            <span className={styles.infoValue}>{order.buyerName ?? '-'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>연락처</span>
            <span className={styles.infoValue}>{order.buyerTel ?? '-'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>배송지</span>
            <span className={styles.infoValue}>{order.buyerAddr ?? '-'}</span>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>결제 정보</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>결제 금액</span>
            <span className={styles.infoValue}>{order.totalPrice?.toLocaleString()}원</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>주문 상태</span>
            <span className={`${styles.badge} ${styles[statusInfo.cls]}`}>{statusInfo.text}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>주문 번호</span>
            <span className={styles.infoValue}>{order.merchantUid}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>주문 일시</span>
            <span className={styles.infoValue}>{formatDate(order.createdAt)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>결제 일시</span>
            <span className={styles.infoValue}>{formatDate(order.paidAt)}</span>
          </div>
        </div>

        {refundSuccess && <p className={styles.successMsg}>환불이 완료되었습니다.</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        {order.status === 'PAID' && !refundSuccess && (
          <button
            className={styles.refundBtn}
            onClick={() => { setShowModal(true); setRefundError('') }}
          >
            환불 신청
          </button>
        )}

        {order.status === 'PENDING' && (
          <button
            className={styles.refundBtn}
            onClick={handleResumePayment}
            style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff' }}
          >
            결제 이어하기
          </button>
        )}
      </main>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>환불 신청</h3>
            <p className={styles.modalDesc}>환불 사유를 입력해주세요.</p>
            <textarea
              className={styles.modalInput}
              placeholder="예: 단순 변심, 상품 불량 등"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={3}
            />
            {refundError && <p className={styles.modalError}>{refundError}</p>}
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setShowModal(false)}
                disabled={refunding}
              >
                취소
              </button>
              <button
                className={styles.modalConfirmBtn}
                onClick={handleRefund}
                disabled={!refundReason.trim() || refunding}
              >
                {refunding ? '처리 중...' : '환불 확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
