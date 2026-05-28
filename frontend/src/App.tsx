import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { OrderPage } from './pages/OrderPage';
import { ReservationPage } from './pages/ReservationPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { CheckoutPage } from './pages/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      {/* Overall application container with a flex column layout to push footer to bottom */}
      {/* Using earthy tones for background and text as per design direction */}
      <div className="flex flex-col min-h-screen bg-stone-50 text-stone-800 font-sans">
        <Header />
        
        {/* Main content area that grows to fill available space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/order" element={<OrderPage />} /> {/* Could be "My Orders" or a general order status page */}
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* Add a 404 Not Found page route if needed */}
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;