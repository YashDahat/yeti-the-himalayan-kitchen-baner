import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Loader2, ShoppingCart as ShoppingCartIcon } from 'lucide-react';

import { getMenuCategories, getMenuItems } from '../services/api';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { toast } from 'sonner';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  vegetarian: boolean;
  spicy: boolean;
  categoryId: number;
}

interface MenuCategory {
  id: number;
  name: string;
  description: string;
}

const OrderPage: React.FC = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery<MenuCategory[], Error>({
    queryKey: ['menuCategories'],
    queryFn: getMenuCategories,
  });

  const { data: menuItems, isLoading: isLoadingMenuItems, error: menuItemsError } = useQuery<MenuItem[], Error>({
    queryKey: ['menuItems'],
    queryFn: getMenuItems,
  });

  useEffect(() => {
    if (categories && categories.length > 0 && activeCategory === null) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (categoriesError) {
      toast.error("Failed to load menu categories.", { description: categoriesError.message });
    }
    if (menuItemsError) {
      toast.error("Failed to load menu items.", { description: menuItemsError.message });
    }
  }, [categoriesError, menuItemsError]);

  const filteredMenuItems = activeCategory
    ? menuItems?.filter(item => item.categoryId === activeCategory)
    : menuItems;

  const handleAddToCart = useCallback((item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
    toast.success(`${item.name} added to cart!`);
  }, [addToCart]);

  const handleUpdateQuantity = useCallback((itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      toast.info("Item removed from cart.");
    } else {
      updateQuantity(itemId, newQuantity);
    }
  }, [removeFromCart, updateQuantity]);

  const renderMenuItemCard = (item: MenuItem) => (
    <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/90 border-earthy-brown-200">
      <img src={item.imageUrl || '/placeholder-food.jpg'} alt={item.name} className="w-full h-48 object-cover" />
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-bold text-deep-blue-700">{item.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center p-4 pt-0">
        <span className="text-lg font-semibold text-saffron-orange-600">₹{item.price.toFixed(2)}</span>
        <div className="flex items-center space-x-2">
          {item.vegetarian && <span className="text-green-600 text-xs font-medium px-2 py-1 rounded-full bg-green-100">Veg</span>}
          {item.spicy && <span className="text-red-600 text-xs font-medium px-2 py-1 rounded-full bg-red-100">Spicy</span>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleAddToCart(item)}
          className="w-full bg-saffron-orange-500 hover:bg-saffron-orange-600 text-white font-semibold py-2 rounded-md transition-colors duration-300"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );

  const renderCartItem = (item: { id: number; name: string; price: number; quantity: number; imageUrl?: string }) => (
    <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
      <img src={item.imageUrl || '/placeholder-food.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
      <div className="flex-grow">
        <h4 className="font-medium text-deep-blue-700">{item.name}</h4>
        <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 p-0 text-deep-blue-700 border-deep-blue-200 hover:bg-deep-blue-50"
        >
          -
        </Button>
        <span className="w-6 text-center font-medium text-deep-blue-700">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 p-0 text-deep-blue-700 border-deep-blue-200 hover:bg-deep-blue-50"
        >
          +
        </Button>
      </div>
    </div>
  );

  if (isLoadingCategories || isLoadingMenuItems) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)] text-deep-blue-700">
        <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading Menu...
      </div>
    );
  }

  if (categoriesError || menuItemsError) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)] text-red-600">
        Error: {categoriesError?.message || menuItemsError?.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-light-grey-100 min-h-[calc(100vh-120px)]">
      <h1 className="text-4xl md:text-5xl font-extrabold text-deep-blue-800 mb-8 text-center tracking-tight">
        Embark on a Culinary Journey
      </h1>
      <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
        Explore our authentic Himalayan dishes, crafted with traditional recipes and the freshest ingredients.
        Select your favorites for a delightful takeaway or delivery experience.
      </p>

      {/* Category Navigation */}
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-earthy-brown-200 bg-white/95 mb-8 shadow-sm">
        <div className="flex w-max p-2">
          {categories?.map(category => (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 mx-1 text-lg font-medium rounded-full transition-all duration-200
                ${activeCategory === category.id
                  ? 'bg-saffron-orange-500 text-white shadow-md hover:bg-saffron-orange-600'
                  : 'text-deep-blue-700 hover:bg-deep-blue-50 hover:text-saffron-orange-500'
                }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {filteredMenuItems?.length === 0 ? (
          <p className="col-span-full text-center text-lg text-gray-600">No items found in this category.</p>
        ) : (
          filteredMenuItems?.map(renderMenuItemCard)
        )}
      </div>

      {/* Floating Cart Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 bg-maroon-600 hover:bg-maroon-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105 z-50"
            aria-label="View Cart"
          >
            <ShoppingCartIcon className="h-6 w-6 mr-2" />
            <span className="font-semibold text-lg">
              Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full md:w-[400px] sm:max-w-md bg-white/95 backdrop-blur-sm p-6 flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-3xl font-bold text-deep-blue-800 mb-4">Your Cart</SheetTitle>
          </SheetHeader>
          <Separator className="mb-4 bg-earthy-brown-200" />

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow text-gray-600 text-lg">
              <ShoppingCartIcon className="h-16 w-16 mb-4 text-gray-400" />
              Your cart is empty.
              <Button variant="link" onClick={() => setActiveCategory(categories?.[0]?.id || null)} className="mt-2 text-saffron-orange-600 hover:text-saffron-orange-700">
                Start ordering!
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-grow pr-4 -mr-4">
                {cartItems.map(renderCartItem)}
                <ScrollBar orientation="vertical" />
              </ScrollArea>

              <Separator className="my-4 bg-earthy-brown-200" />

              <div className="flex justify-between items-center text-xl font-bold text-deep-blue-800 mb-4">
                <span>Total:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>

              <Button
                asChild
                className="w-full bg-saffron-orange-500 hover:bg-saffron-orange-600 text-white font-semibold py-3 text-lg rounded-md transition-colors duration-300"
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full mt-2 border-maroon-600 text-maroon-600 hover:bg-maroon-50 hover:text-maroon-700 transition-colors duration-300"
              >
                Clear Cart
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrderPage;