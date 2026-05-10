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
          {products.map((product) => {
            const isSoldOut = product.status !== 'SALE'
            return (
              <div
                key={product.id}
                className={`${styles.card} ${isSoldOut ? styles.soldOutCard : ''}`}
                onClick={isSoldOut ? undefined : () => navigate(`/products/${product.id}`)}
              >
                {product.imgUrl && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.imgUrl}
                      alt={product.title}
                      className={`${styles.image} ${isSoldOut ? styles.imageSoldOut : ''}`}
                    />
                    {isSoldOut && <div className={styles.soldOutOverlay}>품절</div>}
                  </div>
                )}
                <div className={styles.info}>
                  <p className={styles.name}>{product.title}</p>
                  <p className={`${styles.price} ${isSoldOut ? styles.priceSoldOut : ''}`}>
                    {product.price?.toLocaleString()}원
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
