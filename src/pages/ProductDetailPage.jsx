import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import styles from './ProductDetailPage.module.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('상품 정보를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBuy = () => {
    if (!token) {
      // 비로그인 → 로그인 페이지로, 로그인 후 결제 페이지로 복귀
      navigate('/login', { state: { from: '/payment', product } })
      return
    }
    navigate('/payment', { state: { product } })
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <button className={styles.back} onClick={() => navigate('/products')}>
          ← 목록으로
        </button>

        {loading && <p className={styles.status}>불러오는 중...</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        {product && (
          <div className={styles.detail}>
            {product.imgUrl && (
              <img src={product.imgUrl} alt={product.title} className={styles.image} />
            )}
            <div className={styles.info}>
              <h2 className={styles.name}>{product.title}</h2>
              <p className={styles.price}>{product.price?.toLocaleString()}원</p>
              {product.description && (
                <p className={styles.desc}>{product.description}</p>
              )}
              <div className={styles.stock}>
                {product.status === 'SALE'
                  ? <span className={styles.inStock}>구매 가능</span>
                  : <span className={styles.soldOut}>품절</span>
                }
              </div>
              <button
                className={styles.buyBtn}
                onClick={handleBuy}
                disabled={product.status === 'SOLD'}
              >
                {product.status === 'SOLD' ? '품절' : token ? '구매하기' : '로그인 후 구매하기'}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
