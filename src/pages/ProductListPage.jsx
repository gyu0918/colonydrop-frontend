import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import styles from './ProductListPage.module.css'

export default function ProductListPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/products')
      .then((res) => {
        const d = res.data
        console.log('[상품 API 응답]', d)
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.products) ? d.products
          : Array.isArray(d?.data) ? d.data
          : Array.isArray(d?.items) ? d.items
          : Array.isArray(d?.result) ? d.result
          : []
        setProducts(list)
      })
      .catch(() => setError('상품을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h2 className={styles.heading}>상품 목록</h2>

        {loading && <p className={styles.status}>불러오는 중...</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className={styles.status}>등록된 상품이 없습니다.</p>
        )}

        <div className={styles.grid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.card}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {product.imgUrl && (
                <img
                  src={product.imgUrl}
                  alt={product.title}
                  className={styles.image}
                />
              )}
              <div className={styles.info}>
                <p className={styles.name}>{product.title}</p>
                <p className={styles.price}>{product.price?.toLocaleString()}원</p>
                {product.status === 'SOLD' && (
                  <span className={styles.soldOut}>품절</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
