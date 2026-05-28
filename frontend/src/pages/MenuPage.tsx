import React, { useEffect, useState, useRef } from 'react';
import { MenuItemCard } from '../components/MenuItemCard';
import { getMenuCategories, getMenuItems } from '../services/api';
import { MenuCategory, MenuItem } from '../types'; // Assuming types are defined here or in a shared types file
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';

// Define types if not already in a shared file (e.g., src/types.ts)
// interface MenuCategory {
//   id: number;
//   name: string;
//   description: string;
// }

// interface MenuItem {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   vegetarian: boolean;
//   spicy: boolean;
//   available: boolean;
//   categoryId: number;
// }

const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [fetchedCategories, fetchedItems] = await Promise.all([
          getMenuCategories(),
          getMenuItems(),
        ]);
        setCategories(fetchedCategories.sort((a, b) => a.id - b.id)); // Sort by ID for consistent order
        setMenuItems(fetchedItems);
      } catch (err) {
        console.error('Failed to fetch menu data:', err);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const scrollToCategory = (categoryId: number) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-120px)] flex flex-col md:flex-row gap-8">
        {/* Category Sidebar Skeleton */}
        <div className="w-full md:w-1/4 lg:w-1/5 sticky top-24 h-fit">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Categories</h2>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md bg-light-grey/30" />
            ))}
          </div>
        </div>

        {/* Menu Items Skeleton */}
        <div className="flex-1">
          {[1, 2, 3].map((catIndex) => (
            <div key={catIndex} className="mb-10">
              <Skeleton className="h-10 w-3/4 mb-4 bg-light-grey/30" />
              <Skeleton className="h-6 w-1/2 mb-6 bg-light-grey/30" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((itemIndex) => (
                  <Skeleton key={itemIndex} className="h-64 w-full rounded-lg bg-light-grey/30" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-maroon min-h-[calc(100vh-120px)]">
        <h2 className="text-3xl font-bold mb-4">Error</h2>
        <p className="text-lg">{error}</p>
        <p className="text-md mt-2">Please refresh the page or contact support if the issue persists.</p>
      </div>
    );
  }

  if (categories.length === 0 && menuItems.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center text-deep-blue min-h-[calc(100vh-120px)]">
        <h2 className="text-3xl font-bold mb-4">Menu Coming Soon!</h2>
        <p className="text-lg">We are preparing our authentic Himalayan delights for you.</p>
        <p className="text-md mt-2">Please check back shortly.</p>
      </div>
    );
  }

  const groupedMenuItems = categories.reduce((acc, category) => {
    acc[category.id] = menuItems.filter(item => item.categoryId === category.id);
    return acc;
  }, {} as Record<number, MenuItem[]>);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-120px)] flex flex-col md:flex-row gap-8">
      {/* Category Sidebar */}
      <aside className="w-full md:w-1/4 lg:w-1/5 sticky top-24 h-fit bg-white p-4 rounded-lg shadow-lg border border-light-grey/20 hidden md:block">
        <h2 className="text-2xl font-bold text-deep-blue mb-4 font-heading tracking-wide">Explore Our Menu</h2>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <nav className="flex flex-col gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="justify-start text-lg text-earthy-brown hover:bg-saffron-orange/10 hover:text-saffron-orange transition-colors duration-200"
                onClick={() => scrollToCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile Category Navigation (Scrollable Tabs) */}
      <div className="md:hidden sticky top-20 z-10 bg-white shadow-md py-2 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-light-grey/20">
        <div className="inline-flex gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="flex-shrink-0 text-earthy-brown border-earthy-brown hover:bg-saffron-orange hover:text-white transition-colors duration-200"
              onClick={() => scrollToCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items Display */}
      <main className="flex-1">
        <h1 className="text-4xl md:text-5xl font-extrabold text-deep-blue mb-8 text-center md:text-left font-heading tracking-wide">
          A Culinary Journey to the Himalayas
        </h1>

        {categories.map((category) => (
          <section
            key={category.id}
            ref={(el) => (categoryRefs.current[category.id] = el)}
            className="mb-12 pt-4" // Added pt-4 for scroll padding
          >
            <h2 className="text-3xl md:text-4xl font-bold text-saffron-orange mb-4 font-heading tracking-wide">
              {category.name}
            </h2>
            <p className="text-lg text-earthy-brown mb-6 leading-relaxed">
              {category.description}
            </p>
            <Separator className="my-6 bg-light-grey/50" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMenuItems[category.id]?.length > 0 ? (
                groupedMenuItems[category.id].map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))
              ) : (
                <p className="col-span-full text-center text-light-grey italic">
                  No items available in this category yet.
                </p>
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default MenuPage;