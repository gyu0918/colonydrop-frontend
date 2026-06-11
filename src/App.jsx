import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import ChatSidebar from './components/ChatSidebar'
import Navbar from './components/Navbar'
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
import SupportFormPage from './pages/SupportFormPage'
import SupportMyPage from './pages/SupportMyPage'
import Footer from './components/Footer'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminItemsPage from './pages/admin/AdminItemsPage'
import AdminItemFormPage from './pages/admin/AdminItemFormPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminSupportPage from './pages/admin/AdminSupportPage'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function AppLayout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <div className={!isAdmin ? 'appContent' : ''}>
        <Routes>
          {/* 일반 라우트 */}
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
          <Route path="/support" element={<PrivateRoute><SupportFormPage /></PrivateRoute>} />
          <Route path="/support/my" element={<PrivateRoute><SupportMyPage /></PrivateRoute>} />

          {/* 관리자 라우트 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="items" element={<AdminItemsPage />} />
            <Route path="items/new" element={<AdminItemFormPage />} />
            <Route path="items/:id/edit" element={<AdminItemFormPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="support" element={<AdminSupportPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isAdmin && <Footer />}
      </div>
      {!isAdmin && <ChatSidebar />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ChatProvider>
          <AppLayout />
        </ChatProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}
