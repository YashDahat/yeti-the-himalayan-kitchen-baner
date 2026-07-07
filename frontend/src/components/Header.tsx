import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

const Header: React.FC = () => {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-[#2c2c2e] text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#d4a843]">
          Yeti - The Himalayan Kitchen
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-[#d4a843] transition-colors duration-200 ${
                  isActive ? 'text-[#d4a843]' : ''
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth CTA */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;