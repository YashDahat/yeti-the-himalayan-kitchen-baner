import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Menu Management', path: '/admin/menu' },
    { name: 'Reservations', path: '/admin/reservations' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Blog Posts', path: '/admin/blog' },
    { name: 'Testimonials', path: '/admin/testimonials' },
  ];

  const baseLinkClasses = 'block p-4 text-white hover:text-[#E67E22] transition-colors duration-200';
  const activeLinkClasses = 'text-[#E67E22] font-semibold';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2C3E50] text-white flex flex-col">
        <div className="p-4 text-2xl font-bold text-white border-b border-gray-700">
          Yeti Admin
        </div>
        <nav className="flex-grow">
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={logout}
            className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#F8F8F8] p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;