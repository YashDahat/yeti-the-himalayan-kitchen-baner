import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useMenuItems, useCategories } from '@/hooks/useMenu';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import clsx from 'clsx';

const MenuPage: React.FC = () => {
  const { data: menuItems, isLoading: isLoadingItems, error: menuItemsError } = useMenuItems();
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();
  const { addToCart } = useCart();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredMenuItems = menuItems?.filter(item =>
    selectedCategoryId ? item.categoryId === selectedCategoryId : true
  );

  const handleAddToCart = (item: any) => { // item is MenuItemDto, but useCart expects MenuItemDto
    if (item.id) {
      addToCart(item, 1);
    } else {
      console.error("Cannot add item to cart: item ID is null", item);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[50vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Savor the Authentic Flavors of Yeti - The Himalayan Kitchen
          </h1>
          <p className="text-lg md:text-xl mt-4">
            Embark on a culinary journey to the heart of the Himalayas.
          </p>
        </div>
      </section>

      {/* Menu Categories Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8 text-center">
            Our Menu Categories
          </h2>
          {isLoadingCategories && <p className="text-center text-gray-700">Loading categories...</p>}
          {categoriesError && <p className="text-center text-red-500">Error loading categories: {categoriesError.message}</p>}
          {!isLoadingCategories && !categoriesError && (
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => setSelectedCategoryId(null)}
                className={clsx(
                  "rounded-full px-4 py-2 transition-all duration-200",
                  !selectedCategoryId
                    ? "bg-[#FF9933] hover:bg-[#E68A00] text-white"
                    : "bg-[#8B4513] hover:bg-[#6F360F] text-white"
                )}
              >
                All
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={clsx(
                    "rounded-full px-4 py-2 transition-all duration-200",
                    selectedCategoryId === category.id
                      ? "bg-[#FF9933] hover:bg-[#E68A00] text-white"
                      : "bg-[#8B4513] hover:bg-[#6F360F] text-white"
                  )}
                >
                  {category.name ?? 'Unnamed Category'}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Menu Items Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8 text-center">
            Explore Our Delicious Offerings
          </h2>
          {isLoadingItems && <p className="text-center text-gray-700">Loading menu items...</p>}
          {menuItemsError && <p className="text-center text-red-500">Error loading menu items: {menuItemsError.message}</p>}
          {!isLoadingItems && !menuItemsError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenuItems?.length === 0 ? (
                <p className="col-span-full text-center text-gray-700">No items found in this category.</p>
              ) : (
                filteredMenuItems?.map((item) => (
                  <Card key={item.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name ?? 'Menu Item'}
                        className="w-full h-48 object-cover rounded-md mb-4 aspect-video"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-[#1A2B4C] mb-2">{item.name ?? 'Unnamed Item'}</h3>
                    <p className="text-gray-700 text-sm mb-4 flex-grow">{item.description ?? 'No description available.'}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-[#FF9933]">
                        ${(item.price ?? 0).toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                        disabled={!item.available}
                      >
                        {item.available ? 'Add to Order' : 'Unavailable'}
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MenuPage;