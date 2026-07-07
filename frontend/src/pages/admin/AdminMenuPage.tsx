import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@radix-ui/react-checkbox';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@radix-ui/react-dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useToast } from '@/components/ui/use-toast';

import {
  useMenuItems,
  useCategories,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useCreateMenuItemCategory,
  useUpdateMenuItemCategory,
  useDeleteMenuItemCategory,
} from '../../hooks/useMenu';
import type { MenuItemDto, MenuItemCategory } from '../../types/menu';

// Zod schema for category form
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

// Zod schema for menu item form
const menuItemFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  categoryId: z.string().uuid('Invalid category selected'),
  imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  available: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;
type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

const AdminMenuPage = () => {
  const { toast } = useToast();

  // --- Category Management ---
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, error: categoriesError } = useCategories();
  const createCategoryMutation = useCreateMenuItemCategory();
  const updateCategoryMutation = useUpdateMenuItemCategory();
  const deleteCategoryMutation = useDeleteMenuItemCategory();

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const [isCategoryEditDialogOpen, setIsCategoryEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuItemCategory | null>(null);
  const editCategoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      editCategoryForm.reset({ name: selectedCategory.name });
    }
  }, [selectedCategory, editCategoryForm]);

  const handleCreateCategory = async (values: CategoryFormValues) => {
    try {
      await createCategoryMutation.mutateAsync(values.name);
      toast({ title: 'Success', description: 'Category created successfully.' });
      categoryForm.reset();
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to create category: ${error.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleUpdateCategory = async (values: CategoryFormValues) => {
    if (!selectedCategory) return;
    try {
      await updateCategoryMutation.mutateAsync({ id: selectedCategory.id, name: values.name });
      toast({ title: 'Success', description: 'Category updated successfully.' });
      setIsCategoryEditDialogOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to update category: ${error.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
      toast({ title: 'Success', description: 'Category deleted successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to delete category: ${error.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  // --- Menu Item Management ---
  const { data: menuItems, isLoading: isLoadingMenuItems, isError: isErrorMenuItems, error: menuItemsError } = useMenuItems();
  const createMenuItemMutation = useCreateMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const menuItemForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      imageUrl: '',
      available: true,
    },
  });

  const [isItemEditDialogOpen, setIsItemEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemDto | null>(null);
  const editItemForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      imageUrl: '',
      available: true,
    },
  });

  useEffect(() => {
    if (selectedItem) {
      editItemForm.reset({
        name: selectedItem.name,
        description: selectedItem.description,
        price: selectedItem.price,
        categoryId: selectedItem.categoryId,
        imageUrl: selectedItem.imageUrl ?? '',
        available: selectedItem.available,
      });
    }
  }, [selectedItem, editItemForm]);

  const handleCreateMenuItem = async (values: MenuItemFormValues) => {
    try {
      await createMenuItemMutation.mutateAsync(values);
      toast({ title: 'Success', description: 'Menu item created successfully.' });
      menuItemForm.reset();
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to create menu item: ${error.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleUpdateMenuItem = async (values: MenuItemFormValues) => {
    if (!selectedItem) return;
    try {
      await updateMenuItemMutation.mutateAsync({ id: selectedItem.id, item: values });
      toast({ title: 'Success', description: 'Menu item updated successfully.' });
      setIsItemEditDialogOpen(false);
      setSelectedItem(null);
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to update menu item: ${error.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteMenuItemMutation.mutateAsync(id);
      toast({ title: 'Success', description: 'Menu item deleted successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to delete menu item: ${error.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8">Manage Menu Categories</h2>

          {/* Create Category Form */}
          <div className="mb-12 p-6 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Category</h3>
            <Form {...categoryForm}>
              <form onSubmit={categoryForm.handleSubmit(handleCreateCategory)} className="space-y-4">
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Appetizers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
                </Button>
              </form>
            </Form>
          </div>

          {/* Categories Table */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Categories</h3>
          {isLoadingCategories && <p>Loading categories...</p>}
          {isErrorCategories && <p className="text-red-500">Error: {categoriesError?.message}</p>}
          {!isLoadingCategories && !isErrorCategories && categories && categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">No categories found.</div>
          )}
          {!isLoadingCategories && !isErrorCategories && categories && categories.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.id.substring(0, 8)}...</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog open={isCategoryEditDialogOpen && selectedCategory?.id === category.id} onOpenChange={setIsCategoryEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsCategoryEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
                            <DialogTitle className="text-xl font-semibold text-[#1A2B4C]">Edit Category</DialogTitle>
                            <DialogDescription className="text-gray-600 mb-4">
                              Make changes to your category here. Click save when you're done.
                            </DialogDescription>
                            <Form {...editCategoryForm}>
                              <form onSubmit={editCategoryForm.handleSubmit(handleUpdateCategory)} className="space-y-4">
                                <FormField
                                  control={editCategoryForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Category Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end space-x-2">
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    type="submit"
                                    className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold transition-all duration-200"
                                    disabled={updateCategoryMutation.isPending}
                                  >
                                    {updateCategoryMutation.isPending ? 'Saving...' : 'Save changes'}
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedCategory(category)}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
                            <AlertDialogTitle className="text-xl font-semibold text-[#1A2B4C]">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 mb-4">
                              This action cannot be undone. This will permanently delete the category and all associated menu items.
                            </AlertDialogDescription>
                            <div className="flex justify-end space-x-2">
                              <AlertDialogCancel asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => selectedCategory && handleDeleteCategory(selectedCategory.id)}
                                  disabled={deleteCategoryMutation.isPending}
                                >
                                  {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8">Manage Menu Items</h2>

          {/* Create Menu Item Form */}
          <div className="mb-12 p-6 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Menu Item</h3>
            <Form {...menuItemForm}>
              <form onSubmit={menuItemForm.handleSubmit(handleCreateMenuItem)} className="space-y-4">
                <FormField
                  control={menuItemForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Chicken Momo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Steamed dumplings filled with seasoned ground chicken." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 12.99" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., https://example.com/chicken-momo.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Available</FormLabel>
                        <FormDescription className="text-sm text-gray-500">
                          Is this item currently available on the menu?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                  disabled={createMenuItemMutation.isPending}
                >
                  {createMenuItemMutation.isPending ? 'Creating...' : 'Create Menu Item'}
                </Button>
              </form>
            </Form>
          </div>

          {/* Menu Items Table */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Menu Items</h3>
          {isLoadingMenuItems && <p>Loading menu items...</p>}
          {isErrorMenuItems && <p className="text-red-500">Error: {menuItemsError?.message}</p>}
          {!isLoadingMenuItems && !isErrorMenuItems && menuItems && menuItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">No menu items found.</div>
          )}
          {!isLoadingMenuItems && !isErrorMenuItems && menuItems && menuItems.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <