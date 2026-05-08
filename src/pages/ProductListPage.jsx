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
        // Spring Page { content: [] } / { products: [] } / 배열 직접 반환 모두 처리
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.content) ? d.content
          : Array.isArray(d?.products) ? d.products
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
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={styles.image}
                />
              )}
              <div className={styles.info}>
                <p className={styles.name}>{product.name}</p>
                <p className={styles.price}>{product.price?.toLocaleString()}원</p>
                {product.stock === 0 && (
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
