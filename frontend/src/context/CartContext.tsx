import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItemDto } from '../types/menu';

/**
 * Defines the structure of an item within the shopping cart.
 */
interface CartItem {
  menuItem: MenuItemDto;
  quantity: number;
}

/**
 * Defines the public interface of the CartContext,
 * including the cart state and all available actions.
 */
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItemDto, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateItemQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItems: () => CartItem[];
}

// Create the React Context with an undefined default value.
// Consumers will receive this value if not wrapped by a Provider,
// prompting an error in the useCart hook.
const CartContext = createContext<CartContextType | undefined>(undefined);

// Key for storing cart data in local storage.
const CART_STORAGE_KEY = 'yeti_cart';

/**
 * Props for the CartProvider component.
 */
interface CartProviderProps {
  children: ReactNode;
}

/**
 * CartProvider component manages the shopping cart state,
 * persists it to local storage, and provides cart actions
 * to its children via the CartContext.
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Initialize cart state from local storage on component mount.
  // Uses a function to ensure localStorage is only accessed once.
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return []; // Return empty array for server-side rendering or if window is not available
  });

  // Effect to save cart items to local storage whenever the cartItems state changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  /**
   * Helper function to safely get the menu item ID, handling potential null values.
   * Logs an error if the ID is null, as cart operations expect a valid ID.
   */
  const getMenuItemId = (item: MenuItemDto): string => {
    if (!item.id) {
      console.error("MenuItemDto has a null ID. This item cannot be uniquely managed in the cart.");
      // Fallback to a temporary ID to prevent crashes, though this indicates an upstream data issue.
      return `temp-id-${Math.random().toString(36).substring(2, 9)}`;
    }
    return item.id;
  };

  /**
   * Adds a menu item to the cart or updates its quantity if already present.
   * @param item The MenuItemDto to add.
   * @param quantity The quantity to add.
   */
  const addToCart = (item: MenuItemDto, quantity: number) => {
    const itemId = getMenuItemId(item);
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((cartItem) => getMenuItemId(cartItem.menuItem) === itemId);

      if (existingItemIndex > -1) {
        // Item already in cart, update its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Item not in cart, add it as a new entry
        return [...prevItems, { menuItem: item, quantity }];
      }
    });
  };

  /**
   * Removes an item from the cart based on its menu item ID.
   * @param menuItemId The ID of the menu item to remove.
   */
  const removeFromCart = (menuItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((cartItem) => getMenuItemId(cartItem.menuItem) !== menuItemId));
  };

  /**
   * Updates the quantity of a specific item in the cart.
   * If the new quantity is 0 or less, the item is removed from the cart.
   * @param menuItemId The ID of the menu item to update.
   * @param quantity The new quantity for the item.
   */
  const updateItemQuantity = (menuItemId: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        return prevItems.filter((cartItem) => getMenuItemId(cartItem.menuItem) !== menuItemId);
      } else {
        // Otherwise, update the quantity of the item
        const updatedItems = prevItems.map((cartItem) =>
          getMenuItemId(cartItem.menuItem) === menuItemId ? { ...cartItem, quantity } : cartItem
        );
        return updatedItems;
      }
    });
  };

  /**
   * Clears all items from the shopping cart.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Calculates the total price of all items currently in the cart.
   * Handles potential null prices by defaulting to 0.
   * @returns The total price of the cart.
   */
  const getCartTotal = (): number => {
    return cartItems.reduce((total, cartItem) => {
      const price = cartItem.menuItem.price ?? 0; // Use 0 if price is null
      return total + price * cartItem.quantity;
    }, 0);
  };

  /**
   * Returns the current list of items in the cart.
   * @returns An array of CartItem objects.
   */
  const getCartItems = (): CartItem[] => {
    return cartItems;
  };

  // The value provided to the context consumers.
  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    getCartTotal,
    getCartItems,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to consume the CartContext.
 * Throws an error if used outside of a CartProvider, ensuring proper setup.
 * @returns The CartContextType object with cart state and actions.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};