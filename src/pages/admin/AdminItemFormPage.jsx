import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'
import styles from './AdminItemFormPage.module.css'

export default function AdminItemFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    imgUrl: '',
    status: 'SALE',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get(`/api/admin/items`)
      .then((res) => {
        const d = res.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.data) ? d.data
          : []
        const found = list.find((i) => String(i.id) === String(id))
        if (found) {
          setForm({
            title: found.title ?? '',
            description: found.description ?? '',
            price: found.price ?? '',
            imgUrl: found.imgUrl ?? '',
            status: found.status ?? 'SALE',
          })
        }
      })
      .catch(() => setError('상품 정보를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('상품명을 입력해주세요.'); return }
    if (!form.price || Number(form.price) <= 0) { setError('가격을 올바르게 입력해주세요.'); return }
    setError('')
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        imgUrl: form.imgUrl.trim(),
        status: form.status,
      }
      if (isEdit) {
        await api.put(`/api/admin/items/${id}`, payload)
      } else {
        await api.post('/api/admin/items', payload)
      }
      navigate('/admin/items')
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className={styles.loading}>불러오는 중...</p>

  return (
    <div className={styles.wrap}>
      <h1 className={styles.pageTitle}>{isEdit ? '상품 수정' : '상품 등록'}</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>상품명 *</label>
          <input
            className={styles.input}
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="상품명을 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>설명</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="상품 설명을 입력하세요"
            rows={4}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>가격 (원) *</label>
            <input
              className={styles.input}
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>판매 상태</label>
            <select className={styles.select} name="status" value={form.status} onChange={handleChange}>
              <option value="SALE">판매중</option>
              <option value="SOLD">품절</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>이미지 URL</label>
          <input
            className={styles.input}
            type="text"
            name="imgUrl"
            value={form.imgUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {form.imgUrl && (
            <img src={form.imgUrl} alt="미리보기" className={styles.preview} />
          )}
        </div>

        <div className={styles.btnRow}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/admin/items')}
          >
            취소
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? '저장 중...' : (isEdit ? '수정 완료' : '등록 완료')}
          </button>
        </div>
      </form>
    </div>
  )
}
