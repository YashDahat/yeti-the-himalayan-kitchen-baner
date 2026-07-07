import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { AuthContextProvider } from '@/context/AuthContext';

// Public Pages
import HomePage from '@/pages/HomePage';
import MenuPage from '@/pages/MenuPage';
import ReservationPage from '@/pages/ReservationPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import ProfilePage from '@/pages/ProfilePage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';

// Initialize QueryClient
const queryClient = new QueryClient();

// Placeholder components for pages not yet implemented
const GalleryPage: React.FC = () => {
  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Gallery Page</h1>
          <p className="mt-4 text-lg text-gray-600">A visual journey through our kitchen and culture. Coming soon!</p>
        </div>
      </section>
    </Layout>
  );
};

const AdminMenuPage: React.FC = () => {
  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Menu Management</h1>
          <p className="mt-4 text-lg text-gray-600">Manage menu items and categories here.</p>
        </div>
      </section>
    </AdminLayout>
  );
};

const AdminReservationsPage: React.FC = () => {
  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Reservations</h1>
          <p className="mt-4 text-lg text-gray-600">View and manage reservations here.</p>
        </div>
      </section>
    </AdminLayout>
  );
};

const AdminOrdersPage: React.FC = () => {
  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Orders</h1>
          <p className="mt-4 text-lg text-gray-600">Process and track customer orders here.</p>
        </div>
      </section>
    </AdminLayout>
  );
};

const AdminBlogPage: React.FC = () => {
  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Blog Management</h1>
          <p className="mt-4 text-lg text-gray-600">Create, edit, and publish blog posts here.</p>
        </div>
      </section>
    </AdminLayout>
  );
};

const AdminTestimonialsPage: React.FC = () => {
  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Testimonials</h1>
          <p className="mt-4 text-lg text-gray-600">Review and approve customer testimonials here.</p>
        </div>
      </section>
    </AdminLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <ProtectedRoute>
                  <AdminMenuPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reservations"
              element={
                <ProtectedRoute>
                  <AdminReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute>
                  <AdminBlogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute>
                  <AdminTestimonialsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;