import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  useBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from '@/hooks/useBlog';
import type { BlogPostDto } from '@/types/blog';

import { clsx } from 'clsx';

// Zod Schema for Create/Update Blog Post Form
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  publicationDate: z.string().min(1, 'Publication date is required'), // Expects YYYY-MM-DD from input type="date"
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

const AdminBlogPage: React.FC = () => {
  const { data: blogPosts, isLoading, isError, error } = useBlogPosts();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
      publicationDate: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isModalOpen && editingPost) {
      form.reset({
        title: editingPost.title ?? '',
        content: editingPost.content ?? '',
        author: editingPost.author ?? '',
        publicationDate: editingPost.publicationDate ? format(new Date(editingPost.publicationDate), 'yyyy-MM-dd') : '',
        imageUrl: editingPost.imageUrl ?? '',
      });
    } else if (isModalOpen && !editingPost) {
      form.reset({
        title: '',
        content: '',
        author: '',
        publicationDate: '',
        imageUrl: '',
      });
    }
  }, [isModalOpen, editingPost, form]);

  const onSubmit = async (data: BlogPostFormValues) => {
    const postData: BlogPostDto = {
      id: editingPost?.id ?? null,
      title: data.title,
      content: data.content,
      author: data.author,
      // Convert YYYY-MM-DD to ISO 8601 string
      publicationDate: new Date(data.publicationDate).toISOString(),
      imageUrl: data.imageUrl,
    };

    try {
      if (editingPost) {
        await updateMutation.mutateAsync({ id: editingPost.id ?? '', post: postData });
      } else {
        await createMutation.mutateAsync(postData);
      }
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Failed to save blog post:', err);
      // Optionally display a toast or form error
    }
  };

  const handleDelete = async () => {
    if (postToDeleteId) {
      try {
        await deleteMutation.mutateAsync(postToDeleteId);
        setIsDeleteDialogOpen(false);
        setPostToDeleteId(null);
      } catch (err) {
        console.error('Failed to delete blog post:', err);
        // Optionally display a toast
      }
    }
  };

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#1A2B3C]">Manage Blog Posts</h1>
            <Button
              onClick={() => {
                setEditingPost(null);
                setIsModalOpen(true);
              }}
              className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Add New Blog Post
            </Button>
          </div>

          {/* Blog Post List Table */}
          {isLoading && <p>Loading blog posts...</p>}
          {isError && <p className="text-red-500">Error loading blog posts: {error?.message}</p>}
          {!isLoading && !isError && blogPosts && blogPosts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600">No blog posts found. Start by adding a new one!</p>
            </div>
          )}
          {!isLoading && !isError && blogPosts && blogPosts.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publication Date</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.publicationDate ? format(new Date(post.publicationDate), 'PPP') : ''}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{post.imageUrl}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingPost(post);
                            setIsModalOpen(true);
                          }}
                          className="text-[#FF9933] hover:text-[#E68A00] transition-all duration-200 mr-2"
                        >
                          Edit
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setPostToDeleteId(post.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800 transition-all duration-200"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Create/Edit Blog Post Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="fixed z-50 inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-[#1A2B3C] mb-2">
                    {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mb-4">
                    {editingPost ? 'Update the details of this blog post.' : 'Fill in the details for a new blog post.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</Label>
                    <Input
                      id="title"
                      {...form.register('title')}
                      className={clsx("w-full", form.formState.errors.title && "border-red-500")}
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</Label>
                    <Input
                      id="author"
                      {...form.register('author')}
                      className={clsx("w-full", form.formState.errors.author && "border-red-500")}
                    />
                    {form.formState.errors.author && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.author.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700 mb-1">Publication Date</Label>
                    <Input
                      id="publicationDate"
                      type="date"
                      {...form.register('publicationDate')}
                      className={clsx("w-full", form.formState.errors.publicationDate && "border-red-500")}
                    />
                    {form.formState.errors.publicationDate && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.publicationDate.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</Label>
                    <Input
                      id="imageUrl"
                      {...form.register('imageUrl')}
                      className={clsx("w-full", form.formState.errors.imageUrl && "border-red-500")}
                    />
                    {form.formState.errors.imageUrl && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.imageUrl.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</Label>
                    <Textarea
                      id="content"
                      {...form.register('content')}
                      rows={8}
                      className={clsx("w-full", form.formState.errors.content && "border-red-500")}
                    />
                    {form.formState.errors.content && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
                    )}
                  </div>
                  <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-6 py-2 transition-all duration-200"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Saving...'
                        : editingPost
                          ? 'Save Changes'
                          : 'Create Blog Post'}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="fixed z-50 inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold text-[#1A2B3C] mb-2">Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 mb-4">
                    Are you sure you want to delete this blog post? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-end gap-2 pt-4">
                  <AlertDialogCancel asChild>
                    <Button variant="ghost" className="transition-all duration-200">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-6 py-2 transition-all duration-200"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminBlogPage;