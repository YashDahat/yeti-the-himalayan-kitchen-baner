import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import ProfilePage from './pages/ProfilePage';
import MenuPage from './pages/MenuPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import HomePage from './pages/HomePage';
import BlogPostPage from './pages/BlogPostPage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage';

const queryClient = new QueryClient()

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/menu" element={<ProtectedRoute><AdminMenuPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
            <Route path="/admin/reservations" element={<ProtectedRoute><AdminReservationsPage /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonialsPage /></ProtectedRoute>} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/blog-post" element={<BlogPostPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
