import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'Order Online', href: '/order' },
  { name: 'Reservations', href: '/reservations' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-brown/20 bg-primary-dark text-accent-white shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand Name */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-wide text-accent-white transition-colors duration-300 hover:text-saffron-orange">
          {/* Assuming a logo image exists in the public directory */}
          <img src="/yeti-logo.png" alt="Yeti Logo" className="h-8 w-8" />
          Yeti
          <span className="ml-1 hidden text-base font-normal md:inline">The Himalayan Kitchen</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-saffron-orange ${
                  isActive ? 'border-b-2 border-saffron-orange pb-1 text-saffron-orange' : 'text-accent-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <div className="ml-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-accent-white hover:text-saffron-orange">
              <Link to="/checkout">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-accent-white hover:text-saffron-orange">
              <Link to="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-accent-white hover:text-saffron-orange">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-l border-primary-brown/20 bg-primary-dark text-accent-white sm:w-[400px]">
            <div className="flex flex-col gap-6 p-6">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-wide text-accent-white">
                <img src="/yeti-logo.png" alt="Yeti Logo" className="h-8 w-8" />
                Yeti
              </Link>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `text-xl font-medium transition-colors hover:text-saffron-orange ${
                        isActive ? 'text-saffron-orange' : 'text-accent-white'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `text-xl font-medium transition-colors hover:text-saffron-orange ${
                      isActive ? 'text-saffron-orange' : 'text-accent-white'
                    }`
                  }
                >
                  Account
                </NavLink>
                <NavLink
                  to="/checkout"
                  className={({ isActive }) =>
                    `text-xl font-medium transition-colors hover:text-saffron-orange ${
                      isActive ? 'text-saffron-orange' : 'text-accent-white'
                    }`
                  }
                >
                  Cart
                </NavLink>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}