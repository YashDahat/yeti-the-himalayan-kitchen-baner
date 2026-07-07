import React from 'react';
import { NavLink } from 'react-router-dom';
import Layout from '@/components/Layout';
import TestimonialsSection from '@/components/TestimonialsSection';

const HomePage: React.FC = () => {
  // Placeholder data for featured menu items
  const featuredMenuItems = [
    {
      id: '1',
      name: 'Chicken Momos',
      description: 'Steamed dumplings filled with seasoned ground chicken, served with spicy chutney.',
      price: '₹280',
      image: 'https://images.unsplash.com/photo-1626770284489-f53835694a02?w=800&q=80',
    },
    {
      id: '2',
      name: 'Thukpa',
      description: 'Hearty noodle soup with fresh vegetables and your choice of chicken or vegetarian.',
      price: '₹350',
      image: 'https://images.unsplash.com/photo-1626770284489-f53835694a02?w=800&q=80',
    },
    {
      id: '3',
      name: 'Aloo Gobi',
      description: 'Classic Indian dish with potatoes and cauliflower cooked in aromatic spices.',
      price: '₹290',
      image: 'https://images.unsplash.com/photo-1626770284489-f53835694a02?w=800&q=80',
    },
    {
      id: '4',
      name: 'Paneer Butter Masala',
      description: 'Creamy tomato-based curry with soft paneer cubes, a rich and flavorful delight.',
      price: '₹320',
      image: 'https://images.unsplash.com/photo-1626770284489-f53835694a02?w=800&q=80',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Yeti - The Himalayan Kitchen</h1>
          <p className="text-xl md:text-2xl mb-8">An Authentic Culinary Journey to the Peaks of Flavor.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NavLink
              to="/menu"
              className="bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Explore Our Menu
            </NavLink>
            <NavLink
              to="/reservations"
              className="bg-white text-[#2c2c2e] hover:bg-gray-200 font-semibold rounded-full px-8 py-3 transition-all duration-200 border border-white"
            >
              Book a Table
            </NavLink>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2c3e50] text-center mb-4">Our Signature Dishes</h2>
          <p className="text-lg text-gray-600 text-center mb-12 leading-relaxed">
            Savor the authentic tastes of the Himalayas with our chef's special selections.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMenuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">{item.name}</h3>
                <p className="text-gray-700 leading-relaxed mb-3 flex-grow">{item.description}</p>
                <p className="text-lg font-bold text-[#d4a843]">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Callout Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2c3e50] mb-4">Experience the Warmth of Himalayan Hospitality</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Reserve your table today and embark on an unforgettable culinary journey.
          </p>
          <NavLink
            to="/reservations"
            className="bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Make a Reservation
          </NavLink>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </Layout>
  );
};

export default HomePage;