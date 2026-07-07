import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <h1 className="text-4xl md:text-6xl font-bold text-[#4A2C2A]">
            Welcome, Administrator! Your Himalayan Kitchen Command Center Awaits.
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Navigate through the heart of Yeti - The Himalayan Kitchen's operations.
          </p>

          {/* Overview Section */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Today's Reservations */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-[#4A2C2A]">Today's Reservations</h2>
              <p className="text-3xl font-bold mt-2">12</p>
              <p className="text-gray-700 text-sm">New bookings for today</p>
            </div>

            {/* Card 2: Pending Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-[#4A2C2A]">Pending Orders</h2>
              <p className="text-3xl font-bold mt-2">5</p>
              <p className="text-gray-700 text-sm">Awaiting processing</p>
            </div>

            {/* Card 3: New Testimonials */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-[#4A2C2A]">New Testimonials</h2>
              <p className="text-3xl font-bold mt-2">3</p>
              <p className="text-gray-700 text-sm">Ready for review</p>
            </div>

            {/* Card 4: Menu Items */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-[#4A2C2A]">Total Menu Items</h2>
              <p className="text-3xl font-bold mt-2">78</p>
              <p className="text-gray-700 text-sm">Available for customers</p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#4A2C2A]">Quick Actions</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/menu"
                className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold rounded-md px-6 py-3 text-center transition-all duration-200"
              >
                Manage Menu
              </Link>
              <Link
                to="/admin/reservations"
                className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold rounded-md px-6 py-3 text-center transition-all duration-200"
              >
                View Reservations
              </Link>
              <Link
                to="/admin/orders"
                className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold rounded-md px-6 py-3 text-center transition-all duration-200"
              >
                Process Orders
              </Link>
              <Link
                to="/admin/blog"
                className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold rounded-md px-6 py-3 text-center transition-all duration-200"
              >
                Edit Blog Posts
              </Link>
              <Link
                to="/admin/testimonials"
                className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold rounded-md px-6 py-3 text-center transition-all duration-200"
              >
                Review Testimonials
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboardPage;