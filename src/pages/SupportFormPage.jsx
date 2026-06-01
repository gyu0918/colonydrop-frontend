import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import styles from './SupportFormPage.module.css'

export default function SupportFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('제목을 입력해주세요.'); return }
    if (!form.content.trim()) { setError('내용을 입력해주세요.'); return }
    setError('')
    setSubmitting(true)
    try {
      await api.post('/api/support', { title: form.title.trim(), content: form.content.trim() })
      navigate('/support/my')
    } catch {
      setError('문의 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.main}>
      <h2 className={styles.heading}>고객문의 작성</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>제목 *</label>
          <input
            className={styles.input}
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="문의 제목을 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>내용 *</label>
          <textarea
            className={styles.textarea}
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="문의 내용을 상세히 입력해주세요"
            rows={7}
          />
        </div>

        <div className={styles.btnRow}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
            취소
          </button>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? '등록 중...' : '문의 등록'}
          </button>
        </div>
      </form>
    </main>
  )
}
