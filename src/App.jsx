import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import PaymentPage from './pages/PaymentPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderDetailPage from './pages/OrderDetailPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import Footer from './components/Footer'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
          <Route path="/orders/:merchantUid" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
