import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useCart } from '../hooks/useCart';

// Define the MenuItem interface based on the backend model
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 border border-stone-300 bg-white dark:bg-stone-800">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img
            src={item.imageUrl || '/placeholder-food.jpg'} // Fallback image if imageUrl is null/empty
            alt={item.name}
            className="h-full w-full object-cover"
          />
          {item.category && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
              {item.category.name}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <CardTitle className="text-xl font-bold text-blue-900 dark:text-white mb-2">{item.name}</CardTitle>
          <p className="text-sm text-stone-700 dark:text-stone-300 mb-3 line-clamp-3">
            {item.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-lg font-semibold text-amber-800 dark:text-orange-500">
            ₹{item.price.toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={!item.available}
            className="bg-orange-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            {item.available ? 'Add to Cart' : 'Unavailable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;