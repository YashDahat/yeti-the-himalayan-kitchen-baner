import type { JSX } from 'react';
import React from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-[#2c2c2e] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Business Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#d4a843]">Yeti - The Himalayan Kitchen</h3>
          <p className="text-gray-300 mb-2">
            First Floor, Yeti - The Himalayan Kitchen, Baner, Atria Building, Baner Rd, Kapil Malhar, Baner Gaon, Baner, Pune, Maharashtra 411069
          </p>
          <p className="text-gray-300 mb-2">Phone: 070305 55077</p>
          <p className="text-gray-300">Mon-Sun: 11:00 AM - 11:00 PM</p>
        </div>
    
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#d4a843]">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-300 hover:text-[#d4a843] transition-all duration-200">Home</a></li>
            <li><a href="/menu" className="text-gray-300 hover:text-[#d4a843] transition-all duration-200">Menu</a></li>
            <li><a href="/about" className="text-gray-300 hover:text-[#d4a843] transition-all duration-200">About Us</a></li>
            <li><a href="/contact" className="text-gray-300 hover:text-[#d4a843] transition-all duration-200">Contact Us</a></li>
          </ul>
        </div>
    
        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#d4a843]">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#d4a843] transition-all duration-200">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#d4a843] transition-all duration-200">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#d4a843] transition-all duration-200">
              Twitter
            </a>
          </div>
        </div>
    
        {/* Newsletter (Placeholder) */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#d4a843]">Stay Connected</h3>
          <p className="text-gray-300">Join our newsletter for updates and special offers.</p>
          {/* Placeholder for a newsletter signup form */}
          <form className="mt-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#d4a843]"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    
      <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Yeti - The Himalayan Kitchen. All rights reserved.</p>
      </div>
    </footer>
  );
}
