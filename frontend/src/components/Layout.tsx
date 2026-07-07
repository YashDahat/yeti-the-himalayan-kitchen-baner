import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/917030555077"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-200 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-2xl">💬</span> {/* Using a simple emoji as an icon placeholder */}
      </a>
    </div>
  );
};

export default Layout;