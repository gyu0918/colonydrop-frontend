import { useEffect, useState } from 'react'
import api from '../../utils/api'
import styles from './AdminSupportPage.module.css'

const SUPPORT_STATUS = { PENDING: '접수', IN_PROGRESS: '처리중', DONE: '완료' }
const STATUS_CLS = { PENDING: 'pending', IN_PROGRESS: 'inProgress', DONE: 'done' }
const FILTER_TABS = ['ALL', 'PENDING', 'IN_PROGRESS', 'DONE']
const FILTER_LABEL = { ALL: '전체', ...SUPPORT_STATUS }

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

export default function AdminSupportPage() {
  const [supports, setSupports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState(null)
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)

  const loadSupports = () => {
    api.get('/api/admin/support')
      .then((res) => {
        const d = res.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.data) ? d.data
          : []
        setSupports(list)
      })
      .catch(() => setError('문의 목록을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadSupports() }, [])

  const openDetail = async (support) => {
    try {
      const res = await api.get(`/api/admin/support/${support.id}`)
      const detail = res.data
      setSelected(detail)
      setAnswer(detail.answer ?? '')
    } catch {
      setSelected(support)
      setAnswer(support.answer ?? '')
    }
  }

  const handleAnswer = async () => {
    if (!answer.trim()) return
    setSaving(true)
    try {
      await api.patch(`/api/admin/support/${selected.id}/answer`, { answer: answer.trim() })
      const updated = { ...selected, answer: answer.trim() }
      setSelected(updated)
      setSupports((prev) => prev.map((s) => s.id === selected.id ? { ...s, answer: answer.trim() } : s))
    } catch {
      alert('답변 등록에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/admin/support/${id}/status`, { status: newStatus })
      setSupports((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s))
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status: newStatus }))
    } catch {
      alert('상태 변경에 실패했습니다.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('문의를 삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/admin/support/${id}`)
      setSupports((prev) => prev.filter((s) => s.id !== id))
      setSelected(null)
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const filtered = filter === 'ALL' ? supports : supports.filter((s) => s.status === filter)

  return (
    <div>
      <h1 className={styles.pageTitle}>고객문의 관리</h1>

      <div className={styles.tabs}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${filter === tab ? styles.tabActive : ''}`}
            onClick={() => setFilter(tab)}
          >
            {FILTER_LABEL[tab]}
            <span className={styles.tabCount}>
              {tab === 'ALL' ? supports.length : supports.filter((s) => s.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.loading}>불러오는 중...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>작성자</th>
                <th>제목</th>
                <th>상태</th>
                <th>등록일</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.empty}>문의가 없습니다.</td>
                </tr>
              )}
              {filtered.map((s) => {
                const cls = STATUS_CLS[s.status] ?? 'pending'
                return (
                  <tr key={s.id}>
                    <td>{safeDecodeURIComponent(s.author?.memberName)}</td>
                    <td className={styles.titleCell}>{s.title}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[cls]}`}>
                        {SUPPORT_STATUS[s.status] ?? s.status}
                      </span>
                    </td>
                    <td className={styles.dateCell}>{formatDate(s.createdAt)}</td>
                    <td>
                      <button className={styles.detailBtn} onClick={() => openDetail(s)}>
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
              <h2 className={styles.modalTitle}>문의 상세</h2>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.metaRow}>
                <span className={styles.metaAuthor}>
                  {safeDecodeURIComponent(selected.author?.memberName)}
                </span>
                <span className={styles.metaDate}>{formatDate(selected.createdAt)}</span>
              </div>

              <div className={styles.questionBox}>
                <p className={styles.questionTitle}>{selected.title}</p>
                <p className={styles.questionContent}>{selected.content}</p>
              </div>

              <div className={styles.answerSection}>
                <label className={styles.answerLabel}>관리자 답변</label>
                <textarea
                  className={styles.answerInput}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="답변을 입력하세요..."
                  rows={4}
                />
                <button
                  className={styles.answerBtn}
                  onClick={handleAnswer}
                  disabled={saving || !answer.trim()}
                >
                  {saving ? '저장 중...' : '답변 등록'}
                </button>
              </div>

              <div className={styles.statusSection}>
                <p className={styles.statusLabel}>상태 변경</p>
                <div className={styles.statusBtns}>
                  {['PENDING', 'IN_PROGRESS', 'DONE'].map((st) => (
                    <button
                      key={st}
                      className={`${styles.statusBtn} ${selected.status === st ? styles.statusBtnActive : ''} ${styles[STATUS_CLS[st]]}`}
                      onClick={() => handleStatusChange(selected.id, st)}
                    >
                      {SUPPORT_STATUS[st]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(selected.id)}
              >
                문의 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
