import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import api from '../utils/api'
import styles from './PaymentPage.module.css'

const IMP_CODE = 'imp42571221'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product

  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const [buyerName, setBuyerName] = useState('')
  const [buyerTel, setBuyerTel] = useState('')
  const [buyerAddr, setBuyerAddr] = useState('')
  const [buyerAddrDetail, setBuyerAddrDetail] = useState('')
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false)

  // 대기열 상태
  const [waiting, setWaiting] = useState(false)
  const [waitMessage, setWaitMessage] = useState('')
  const [queuePosition, setQueuePosition] = useState(null)
  const stompClientRef = useRef(null)

  if (!product) {
    return (
      <>
  
        <main className={styles.main}>
          <p className={styles.errorMsg}>상품 정보가 없습니다.</p>
          <button className={styles.backBtn} onClick={() => navigate('/products')}>
            상품 목록으로
          </button>
        </main>
      </>
    )
  }

  const allAgreed = agreePrivacy && agreeTerms

  const handleAllAgree = (e) => {
    const checked = e.target.checked
    setAgreePrivacy(checked)
    setAgreeTerms(checked)
  }

  const fullAddr = buyerAddr + (buyerAddrDetail.trim() ? ' ' + buyerAddrDetail.trim() : '')

  const handleAddrSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setBuyerAddr(data.address)
        setBuyerAddrDetail('')
      },
    }).open()
  }

  const canPay =
    buyerName.trim() && buyerTel.trim() && buyerAddr && agreePrivacy && agreeTerms && !paying && !waiting

  // WebSocket 메시지 처리
  const handleQueueMessage = (msg, client) => {
    switch (msg.status) {
      case 'WAITING':
        // 3명 이상일 때만 순번 표시
        if (msg.queuePosition >= 3) {
          setQueuePosition(msg.queuePosition)
          setWaitMessage(`현재 ${msg.queuePosition}번째 대기 중입니다.`)
        } else {
          setQueuePosition(null)
          setWaitMessage('잠시만 기다려 주세요...')
        }
        break

      case 'PROCESSING':
        setQueuePosition(null)
        setWaitMessage('결제 처리 중입니다...')
        break

      case 'READY': {
        client.deactivate()
        stompClientRef.current = null
        setWaiting(false)
        setWaitMessage('')

        const merchantUid = msg.merchantUid

        const IMP = window.IMP
        IMP.init(IMP_CODE)

        IMP.request_pay(
          {
            pg: 'html5_inicis.INIpayTest',
            pay_method: 'card',
            merchant_uid: merchantUid,
            name: product.title,
            amount: product.price,
            buyer_name: buyerName.trim(),
            buyer_email: '',
            buyer_tel: buyerTel.trim(),
            buyer_addr: fullAddr,
          },
          async (rsp) => {
            if (!rsp.success) {
              try {
                await api.post('/api/orders/cancel', { merchantUid })
              } catch (e) {
                console.error('주문 취소 실패', e)
              }
              setError(rsp.error_msg ?? '결제가 취소되었습니다.')
              setPaying(false)
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
              setPaying(false)
            }
          }
        )
        break
      }

      case 'SOLD_OUT':
        client.deactivate()
        stompClientRef.current = null
        setWaiting(false)
        setWaitMessage('')
        setPaying(false)
        setError('품절되었습니다.')
        break

      default:
        break
    }
  }

  const handlePayment = async () => {
    setError('')
    setPaying(true)
    setWaiting(true)
    setWaitMessage('잠시만 기다려 주세요...')

    const sessionId = crypto.randomUUID()

    // WebSocket 먼저 연결
    try {
      await new Promise((resolve, reject) => {
        const socket = new SockJS('https://api.colonydrop0079.com/ws')
        const client = new Client({
          webSocketFactory: () => socket,
          onConnect: () => {
            client.subscribe(`/queue/order/${sessionId}`, (frame) => {
              const msg = JSON.parse(frame.body)
              handleQueueMessage(msg, client)
            })
            resolve()
          },
          onStompError: () => {
            reject(new Error('WebSocket 연결 실패'))
          },
          reconnectDelay: 3000,
        })
        stompClientRef.current = client
        client.activate()
      })
    } catch {
      setError('실시간 연결에 실패했습니다.')
      setPaying(false)
      setWaiting(false)
      return
    }

    // WebSocket 연결 완료 후 주문 생성
    try {
      await api.post('/api/orders', {
        itemId: product.id,
        quantity: 1,
        buyerName: buyerName.trim(),
        buyerTel: buyerTel.trim(),
        buyerAddr: fullAddr,
        sessionId: sessionId,
      })
    } catch {
      setError('주문 요청에 실패했습니다.')
      setPaying(false)
      setWaiting(false)
    }
  }

  return (
    <>

      <main className={styles.main}>

        {/* 대기 오버레이 */}
        {waiting && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, color: '#fff',
            fontFamily: 'inherit', gap: '20px',
          }}>
            <div style={{
              width: 48, height: 48,
              border: '4px solid #333',
              borderTop: '4px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            {queuePosition && (
              <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
                {queuePosition}번째 대기 중
              </p>
            )}
            <p style={{ fontSize: 16, color: '#aaa', margin: 0 }}>{waitMessage}</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <h2 className={styles.heading}>결제</h2>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>주문 상품</h3>
          <div className={styles.productRow}>
            {product.imgUrl && (
              <img src={product.imgUrl} alt={product.title} className={styles.thumb} />
            )}
            <div>
              <p className={styles.productName}>{product.title}</p>
              <p className={styles.productPrice}>{product.price?.toLocaleString()}원</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>구매자 정보</h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              이름 <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="이름을 입력해주세요"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              휴대폰 번호 <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="tel"
              placeholder="010-0000-0000"
              value={buyerTel}
              onChange={(e) => setBuyerTel(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              배송지 주소 <span className={styles.required}>*</span>
            </label>
            <div className={styles.addrRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="주소 검색 후 자동 입력됩니다"
                value={buyerAddr}
                readOnly
              />
              <button type="button" className={styles.addrSearchBtn} onClick={handleAddrSearch}>
                주소 검색
              </button>
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="상세 주소 입력 (동/호수 등)"
              value={buyerAddrDetail}
              onChange={(e) => setBuyerAddrDetail(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>약관 동의</h3>

          <label className={styles.allAgreeRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={allAgreed}
              onChange={handleAllAgree}
            />
            <span className={styles.allAgreeText}>전체 동의</span>
          </label>

          <div className={styles.divider} />

          <div className={styles.agreeRow}>
            <label className={styles.agreeLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
              />
              <span>[필수] 개인정보 수집 및 이용 동의</span>
            </label>
            <button
              type="button"
              className={styles.detailBtn}
              onClick={() => setShowPrivacyDetail((prev) => !prev)}
            >
              {showPrivacyDetail ? '닫기' : '상세보기'}
            </button>
          </div>

          {showPrivacyDetail && (
            <div className={styles.privacyDetail}>
              <ul className={styles.privacyList}>
                <li><strong>수집 항목:</strong> 이름, 휴대폰 번호, 배송지 주소</li>
                <li><strong>수집 목적:</strong> 상품 배송 및 구매 확인</li>
                <li><strong>보유 기간:</strong> 구매일로부터 5년 (전자상거래법 기준)</li>
              </ul>
              <p className={styles.privacyNote}>
                위 개인정보 수집에 동의하지 않으실 경우 구매가 제한될 수 있습니다.
              </p>
            </div>
          )}

          <div className={styles.agreeRow}>
            <label className={styles.agreeLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>[필수] 결제 서비스 이용약관 동의</span>
            </label>
            <a
              href="https://portone.io/korea/ko/terms"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detailBtn}
            >
              상세보기
            </a>
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
          disabled={!canPay}
        >
          {paying ? '처리 중...' : `${product.price?.toLocaleString()}원 결제하기`}
        </button>

        <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
          취소
        </button>
      </main>
    </>
  )
}
