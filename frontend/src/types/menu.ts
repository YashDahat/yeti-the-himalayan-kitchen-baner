// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface MenuItemDto {
  id: string | null;
  name: string | null;
  description: string | null;
  price: number | null;
  categoryId: string | null;
  categoryName: string | null;
  imageUrl: string | null;
  available: boolean | null;
}

export interface MenuItemCategory {
  id: string;
  name: string | null;
  menuItems: MenuItem[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MenuItem {
  id: string;
  name: string | null;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  available: boolean | null;
  category: MenuItemCategory | null;
  createdAt: string | null;
  updatedAt: string | null;
}

