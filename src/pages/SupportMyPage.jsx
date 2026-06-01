import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import styles from './SupportMyPage.module.css'

const SUPPORT_STATUS = { PENDING: '접수', IN_PROGRESS: '처리중', DONE: '완료' }
const STATUS_CLS = { PENDING: 'pending', IN_PROGRESS: 'inProgress', DONE: 'done' }

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function SupportMyPage() {
  const navigate = useNavigate()
  const [supports, setSupports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    api.get('/api/support/my')
      .then((res) => {
        const d = res.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.data) ? d.data
          : []
        setSupports(list)
      })
      .catch(() => setError('문의 내역을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const openDetail = async (support) => {
    setDetailLoading(true)
    setSelected(support)
    try {
      const res = await api.get(`/api/support/${support.id}`)
      setSelected(res.data)
    } catch {
      // 목록 데이터로 폴백
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h2 className={styles.heading}>내 문의 목록</h2>
          <button className={styles.newBtn} onClick={() => navigate('/support')}>
            + 문의 작성
          </button>
        </div>

        {loading && <p className={styles.status}>불러오는 중...</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        {!loading && !error && supports.length === 0 && (
          <p className={styles.status}>등록된 문의가 없습니다.</p>
        )}

        <div className={styles.list}>
          {supports.map((s) => {
            const cls = STATUS_CLS[s.status] ?? 'pending'
            return (
              <div key={s.id} className={styles.card} onClick={() => openDetail(s)}>
                <div className={styles.cardTop}>
                  <p className={styles.title}>{s.title}</p>
                  <span className={`${styles.badge} ${styles[cls]}`}>
                    {SUPPORT_STATUS[s.status] ?? s.status}
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <span className={styles.answered}>
                    {s.answer ? '✓ 답변 완료' : '답변 대기 중'}
                  </span>
                  <span className={styles.date}>{formatDate(s.createdAt)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>문의 상세</h2>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              {detailLoading ? (
                <p className={styles.detailLoading}>불러오는 중...</p>
              ) : (
                <>
                  <div className={styles.questionBox}>
                    <p className={styles.questionTitle}>{selected.title}</p>
                    <p className={styles.questionContent}>{selected.content}</p>
                    <p className={styles.questionDate}>{formatDate(selected.createdAt)}</p>
                  </div>

                  <div className={styles.answerBox}>
                    <p className={styles.answerLabel}>관리자 답변</p>
                    {selected.answer ? (
                      <>
                        <p className={styles.answerContent}>{selected.answer}</p>
                        {selected.answeredAt && (
                          <p className={styles.answerDate}>{formatDate(selected.answeredAt)}</p>
                        )}
                      </>
                    ) : (
                      <p className={styles.noAnswer}>답변 대기 중입니다.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
