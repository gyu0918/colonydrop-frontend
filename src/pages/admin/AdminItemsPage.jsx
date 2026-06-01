import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import styles from './AdminItemsPage.module.css'

const ITEM_STATUS = { SALE: '판매중', SOLD: '품절' }

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

export default function AdminItemsPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadItems = () => {
    setLoading(true)
    api.get('/api/admin/items')
      .then((res) => {
        const d = res.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.data) ? d.data
          : []
        setItems(list)
      })
      .catch(() => setError('상품 목록을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadItems() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('상품을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/admin/items/${id}`)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'SALE' ? 'SOLD' : 'SALE'
    try {
      await api.patch(`/api/admin/items/${item.id}/status`, { status: newStatus })
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      )
    } catch {
      alert('상태 변경에 실패했습니다.')
    }
  }

  return (
    <div>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>상품 관리</h1>
        <button className={styles.addBtn} onClick={() => navigate('/admin/items/new')}>
          + 상품 등록
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.loading}>불러오는 중...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>가격</th>
                <th>상태</th>
                <th>등록일</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.empty}>등록된 상품이 없습니다.</td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.imgUrl ? (
                      <img src={item.imgUrl} alt={item.title} className={styles.thumb} />
                    ) : (
                      <div className={styles.noImg}>-</div>
                    )}
                  </td>
                  <td className={styles.itemTitle}>{item.title}</td>
                  <td>{item.price?.toLocaleString()}원</td>
                  <td>
                    <span className={`${styles.badge} ${item.status === 'SALE' ? styles.sale : styles.sold}`}>
                      {ITEM_STATUS[item.status] ?? item.status}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{formatDate(item.createdAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => navigate(`/admin/items/${item.id}/edit`)}
                      >
                        수정
                      </button>
                      <button
                        className={`${styles.toggleBtn} ${item.status === 'SALE' ? styles.toggleSold : styles.toggleSale}`}
                        onClick={() => handleToggleStatus(item)}
                      >
                        {item.status === 'SALE' ? '품절 처리' : '판매 처리'}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(item.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
