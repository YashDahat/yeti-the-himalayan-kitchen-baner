import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F1A2C] text-white py-12"> {/* Deep blue background */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
          {/* Section 1: About Yeti */}
          <div>
            <h3 className="text-3xl font-bold text-[#FF9933] mb-4 font-serif">Yeti</h3> {/* Saffron orange for heading */}
            <p className="text-gray-300 text-sm leading-relaxed">
              Embark on a culinary journey to the Himalayas. Experience authentic flavors and warm hospitality at Yeti - The Himalayan Kitchen.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">Home</Link></li>
              <li><Link to="/menu" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">Menu</Link></li>
              <li><Link to="/reservations" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">Reservations</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">Contact Us</Link></li>
              <li><Link to="/account" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">My Account</Link></li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-[#FF9933] flex-shrink-0" />
                <span>First Floor, Yeti - The Himalayan Kitchen, Atria Building, Baner Rd, Kapil Malhar, Baner Gaon, Baner, Pune, Maharashtra 411069</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-[#FF9933]" />
                <span>+91 98765 43210 (Example)</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-[#FF9933]" />
                <span>info@yetihimalayankitchen.com</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Follow Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">
                <FaFacebookF size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF9933] transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Yeti - The Himalayan Kitchen. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;