import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import clsx from 'clsx';

import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
}
from '@radix-ui/react-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';

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
  price: z.coerce.number().min(0.01, 'Price must be positive'),
  categoryId: z.string().uuid('Invalid category selected'),
  imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  available: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;
type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

const AdminMenuPage: React.FC = () => {
  const { data: menuItems, isLoading: isLoadingItems, error: itemsError } = useMenuItems();
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  const createMenuItemMutation = useCreateMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();
  const createCategoryMutation = useCreateMenuItemCategory();
  const updateCategoryMutation = useUpdateMenuItemCategory();
  const deleteCategoryMutation = useDeleteMenuItemCategory();

  const [isCategoryEditDialogOpen, setIsCategoryEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuItemCategory | null>(null);

  const [isMenuItemEditDialogOpen, setIsMenuItemEditDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemDto | null>(null);

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: '' },
  });

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

  useEffect(() => {
    if (selectedCategory) {
      categoryForm.reset({ name: selectedCategory.name });
    } else {
      categoryForm.reset({ name: '' });
    }
  }, [selectedCategory, categoryForm]);

  useEffect(() => {
    if (selectedMenuItem) {
      menuItemForm.reset({
        name: selectedMenuItem.name,
        description: selectedMenuItem.description,
        price: selectedMenuItem.price,
        categoryId: selectedMenuItem.categoryId,
        imageUrl: selectedMenuItem.imageUrl ?? '',
        available: selectedMenuItem.available,
      });
    } else {
      menuItemForm.reset({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        imageUrl: '',
        available: true,
      });
    }
  }, [selectedMenuItem, menuItemForm]);

  const handleCreateCategory = async (values: CategoryFormValues) => {
    try {
      await createCategoryMutation.mutateAsync(values.name);
      toast.success('Category created successfully!');
      categoryForm.reset();
    } catch (error: any) {
      toast.error(`Failed to create category: ${error.message}`);
    }
  };

  const handleUpdateCategory = async (values: CategoryFormValues) => {
    if (!selectedCategory) return;
    try {
      await updateCategoryMutation.mutateAsync({ id: selectedCategory.id, name: values.name });
      toast.success('Category updated successfully!');
      setIsCategoryEditDialogOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      toast.error(`Failed to update category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
      toast.success('Category deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  };

  const handleCreateMenuItem = async (values: MenuItemFormValues) => {
    try {
      await createMenuItemMutation.mutateAsync({
        name: values.name,
        description: values.description,
        price: values.price,
        categoryId: values.categoryId,
        imageUrl: values.imageUrl || null,
        available: values.available,
      });
      toast.success('Menu item created successfully!');
      menuItemForm.reset();
    } catch (error: any) {
      toast.error(`Failed to create menu item: ${error.message}`);
    }
  };

  const handleUpdateMenuItem = async (values: MenuItemFormValues) => {
    if (!selectedMenuItem) return;
    try {
      await updateMenuItemMutation.mutateAsync({
        id: selectedMenuItem.id,
        item: {
          name: values.name,
          description: values.description,
          price: values.price,
          categoryId: values.categoryId,
          imageUrl: values.imageUrl || null,
          available: values.available,
        },
      });
      toast.success('Menu item updated successfully!');
      setIsMenuItemEditDialogOpen(false);
      setSelectedMenuItem(null);
    } catch (error: any) {
      toast.error(`Failed to update menu item: ${error.message}`);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteMenuItemMutation.mutateAsync(id);
      toast.success('Menu item deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete menu item: ${error.message}`);
    }
  };

  if (isLoadingItems || isLoadingCategories) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8">Admin Menu Management</h1>
            <p>Loading menu data...</p>
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (itemsError || categoriesError) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8">Admin Menu Management</h1>
            <p className="text-red-500">Error loading menu data: {itemsError?.message || categoriesError?.message}</p>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8">Manage Menu Categories</h2>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold text-[#1A2B4C] mb-4">Existing Categories</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">No categories found.</TableCell>
                  </TableRow>
                ) : (
                  categories?.map((category) => (
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
                              className="hover:bg-gray-100 transition-all duration-200"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <Form {...categoryForm}>
                              <form onSubmit={categoryForm.handleSubmit(handleUpdateCategory)} className="grid gap-4 py-4">
                                <FormField
                                  control={categoryForm.control}
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
                                <div className="flex justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    type="submit"
                                    className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold transition-all duration-200"
                                    disabled={updateCategoryMutation.isPending}
                                  >
                                    {updateCategoryMutation.isPending ? 'Saving...' : 'Save Changes'}
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="hover:opacity-80 transition-all duration-200">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the category &quot;{category.name}&quot;
                                and potentially affect associated menu items.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel asChild>
                                <Button variant="outline">Cancel</Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  disabled={deleteCategoryMutation.isPending}
                                >
                                  {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A2B4C] mb-8">Manage Menu Items</h2>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Menu Item</CardTitle>
            </CardHeader>
            <CardContent>
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
                          <Textarea placeholder="A brief description of the item" {...field} />
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
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={menuItemForm.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Available</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                    disabled={createMenuItemMutation.isPending}
                  >
                    {createMenuItemMutation.isPending ? 'Creating...' : 'Create Item'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold text-[#1A2B4C] mb-4">Existing Menu Items</h3>
          <div className="overflow-x-auto">
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
              <TableBody>
                {menuItems?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No menu items found.</TableCell>
                  </TableRow>
                ) : (
                  menuItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id.substring(0, 8)}...</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.available ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog open={isMenuItemEditDialogOpen && selectedMenuItem?.id === item.id} onOpenChange={setIsMenuItemEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMenuItem(item);
                                setIsMenuItemEditDialogOpen(true);
                              }}
                              className="hover:bg-gray-100 transition-all duration-200"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
                            <DialogHeader>
                              <DialogTitle>Edit Menu Item</DialogTitle>
                            </DialogHeader>
                            <Form {...menuItemForm}>
                              <form onSubmit={menuItemForm.handleSubmit(handleUpdateMenuItem)} className="grid gap-4 py-4">
                                <FormField
                                  control={menuItemForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Item Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
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
                                        <Textarea {...field} />
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
                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                                      <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={menuItemForm.control}
                                  name="available"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>Available</FormLabel>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    type="submit"
                                    className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold transition-all duration-200"
                                    disabled={updateMenuItemMutation.isPending}
                                  >
                                    {updateMenuItemMutation.isPending ? 'Saving...' : 'Save Changes'}
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="hover:opacity-80 transition-all duration-200">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the menu item &quot;{item.name}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel asChild>
                                <Button variant="outline">Cancel</Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  disabled={deleteMenuItemMutation.isPending}
                                >
                                  {deleteMenuItemMutation.isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminMenuPage;