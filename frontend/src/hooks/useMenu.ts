import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MenuItemDto, MenuItemCategory } from '../types/menu';
import {
  getAllMenuItems,
  getMenuItemById,
  getAllMenuItemCategories,
  getMenuItemCategoryById,
  createMenuItem,
  updateMenuItem,
  createMenuItemCategory,
  updateMenuItemCategory,
} from '../services/menuService';

import apiClient from '../api/client';
const deleteMenuItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/menu/items/${id}`);
};
const deleteMenuItemCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/menu/categories/${id}`);
};

export const useMenuItems = () => {
  return useQuery<MenuItemDto[], Error>({
    queryKey: ['menuItems'],
    queryFn: getAllMenuItems,
  });
};

export const useMenuItem = (id: string) => {
  return useQuery<MenuItemDto, Error>({
    queryKey: ['menuItem', id],
    queryFn: () => getMenuItemById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery<MenuItemCategory[], Error>({
    queryKey: ['categories'],
    queryFn: getAllMenuItemCategories,
  });
};

export const useCategory = (id: string) => {
  return useQuery<MenuItemCategory, Error>({
    queryKey: ['category', id],
    queryFn: () => getMenuItemCategoryById(id),
    enabled: !!id,
  });
};

type MenuItemCreateUpdateInput = MenuItemDto;

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation<MenuItemDto, Error, MenuItemCreateUpdateInput>({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation<MenuItemDto, Error, { id: string; item: MenuItemCreateUpdateInput }>({
    mutationFn: ({ id, item }) => updateMenuItem(id, item),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItem', variables.id] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useCreateMenuItemCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<MenuItemCategory, Error, string>({
    mutationFn: (name) => createMenuItemCategory({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
};

export const useUpdateMenuItemCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<MenuItemCategory, Error, { id: string; name: string }>({
    mutationFn: ({ id, name }) => updateMenuItemCategory(id, { name }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
};

export const useDeleteMenuItemCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMenuItemCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
};