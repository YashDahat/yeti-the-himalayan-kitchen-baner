import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useAllTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useApproveTestimonial,
  useDeleteTestimonial,
  useTestimonial,
} from '@/hooks/useTestimonials';
import type { TestimonialDto } from '@/types/testimonial';
import { Label } from '@radix-ui/react-label';
import { Checkbox } from '@radix-ui/react-checkbox';
import clsx from 'clsx';

const createTestimonialSchema = z.object({
  authorName: z.string().min(1, 'Author name is required'),
  content: z.string().min(1, 'Content is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  approved: z.boolean().optional(),
});

type CreateTestimonialFormValues = z.infer<typeof createTestimonialSchema>;

const updateTestimonialSchema = z.object({
  authorName: z.string().min(1, 'Author name is required'),
  content: z.string().min(1, 'Content is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  approved: z.boolean(),
});

type UpdateTestimonialFormValues = z.infer<typeof updateTestimonialSchema>;

const AdminTestimonialsPage: React.FC = () => {
  const { data: testimonials, isLoading, isError, error } = useAllTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const approveMutation = useApproveTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | undefined>(undefined);

  const { data: currentTestimonial, isLoading: isLoadingCurrentTestimonial } = useTestimonial(editingTestimonialId);

  const createForm = useForm<CreateTestimonialFormValues>({
    resolver: zodResolver(createTestimonialSchema),
    defaultValues: {
      authorName: '',
      content: '',
      rating: 1,
      approved: false,
    },
  });

  const editForm = useForm<UpdateTestimonialFormValues>({
    resolver: zodResolver(updateTestimonialSchema),
    defaultValues: {
      authorName: '',
      content: '',
      rating: 1,
      approved: false,
    },
  });

  useEffect(() => {
    if (currentTestimonial && isEditModalOpen) {
      editForm.reset({
        authorName: currentTestimonial.authorName ?? '',
        content: currentTestimonial.content ?? '',
        rating: currentTestimonial.rating ?? 1,
        approved: currentTestimonial.approved ?? false,
      });
    }
  }, [currentTestimonial, isEditModalOpen, editForm]);

  const handleCreateTestimonial = async (values: CreateTestimonialFormValues) => {
    createMutation.mutate({ id: null, createdAt: null, ...values, approved: values.approved ?? false }, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        createForm.reset();
      },
    });
  };

  const handleEditTestimonial = async (values: UpdateTestimonialFormValues) => {
    if (!editingTestimonialId) return;
    updateMutation.mutate(
      { id: editingTestimonialId, testimonial: { id: currentTestimonial?.id ?? null, createdAt: currentTestimonial?.createdAt ?? null, ...values } },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingTestimonialId(undefined);
        },
      }
    );
  };

  const handleApproveTestimonial = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleUnapproveTestimonial = (testimonial: TestimonialDto) => {
    updateMutation.mutate({ id: testimonial.id ?? '', testimonial: { ...testimonial, approved: false } });
  };

  const handleDeleteTestimonial = () => {
    if (!deletingTestimonialId) return;
    deleteMutation.mutate(deletingTestimonialId, {
      onSuccess: () => {
        setIsDeleteAlertOpen(false);
        setDeletingTestimonialId(undefined);
      },
    });
  };

  const openEditModal = (id: string) => {
    setEditingTestimonialId(id);
    setIsEditModalOpen(true);
  };

  const openDeleteAlert = (id: string) => {
    setDeletingTestimonialId(id);
    setIsDeleteAlertOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={clsx('w-4 h-4', i < rating ? 'text-[#f4c430]' : 'text-gray-300')}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8">Manage Testimonials</h1>

          <div className="mb-6 flex justify-end">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#f4c430] hover:bg-[#e0b02a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                >
                  Add New Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Create New Testimonial</DialogTitle>
                </DialogHeader>
                <form onSubmit={createForm.handleSubmit(handleCreateTestimonial)} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="authorName" className="text-right">
                      Author Name
                    </Label>
                    <Input id="authorName" {...createForm.register('authorName')} className="col-span-3" />
                    {createForm.formState.errors.authorName && (
                      <p className="col-span-4 text-red-500 text-sm text-right">
                        {createForm.formState.errors.authorName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">
                      Content
                    </Label>
                    <Input id="content" {...createForm.register('content')} className="col-span-3" />
                    {createForm.formState.errors.content && (
                      <p className="col-span-4 text-red-500 text-sm text-right">
                        {createForm.formState.errors.content.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rating" className="text-right">
                      Rating (1-5)
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      {...createForm.register('rating')}
                      className="col-span-3"
                      min="1"
                      max="5"
                    />
                    {createForm.formState.errors.rating && (
                      <p className="col-span-4 text-red-500 text-sm text-right">
                        {createForm.formState.errors.rating.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="approved" className="text-right">
                      Approved
                    </Label>
                    <Checkbox
                      id="approved"
                      checked={createForm.watch('approved')}
                      onCheckedChange={(checked) => createForm.setValue('approved', checked as boolean)}
                      className="h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-50"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="bg-[#f4c430] hover:bg-[#e0b02a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Testimonial'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading testimonials...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">Error: {error?.message}</div>
          ) : !testimonials || testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No testimonials found.</div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium truncate max-w-[80px]">{testimonial.id?.substring(0, 8)}...</TableCell>
                      <TableCell>{testimonial.authorName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{testimonial.content}</TableCell>
                      <TableCell>{renderStars(testimonial.rating ?? 0)}</TableCell>
                      <TableCell>{testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : ''}</TableCell>
                      <TableCell>
                        <Badge variant={testimonial.approved ? 'default' : 'destructive'}>
                          {testimonial.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          onClick={() => openEditModal(testimonial.id ?? '')}
                          className="bg-[#8B4513] hover:bg-[#7a3b10] text-white font-semibold rounded-full px-4 py-2 text-sm transition-all duration-200"
                        >
                          Edit
                        </Button>
                        {testimonial.approved ? (
                          <Button
                            onClick={() => handleUnapproveTestimonial(testimonial)}
                            disabled={updateMutation.isPending}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full px-4 py-2 text-sm transition-all duration-200"
                          >
                            Unapprove
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleApproveTestimonial(testimonial.id ?? '')}
                            disabled={approveMutation.isPending}
                            className="bg-[#f4c430] hover:bg-[#e0b02a] text-white font-semibold rounded-full px-4 py-2 text-sm transition-all duration-200"
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          onClick={() => openDeleteAlert(testimonial.id ?? '')}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-4 py-2 text-sm transition-all duration-200"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Edit Testimonial</DialogTitle>
              </DialogHeader>
              {isLoadingCurrentTestimonial ? (
                <div className="py-4 text-center">Loading testimonial data...</div>
              ) : (
                <form onSubmit={editForm.handleSubmit(handleEditTestimonial)} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editAuthorName" className="text-right">
                      Author Name
                    </Label>
                    <Input id="editAuthorName" {...editForm.register('authorName')} className="col-span-3" />
                    {editForm.formState.errors.authorName && (
                      <p className="col-span-4 text-red-500 text-sm text-right">
                        {editForm.formState.errors.authorName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editContent" className="text-right">
                      Content
                    </Label>
                    <Input id="editContent" {...editForm.register('content')} className="col-span-3" />
                    {editForm.formState.errors.content && (
                      <p className="col-span-4 text-red-500 text-sm text-right">
                        {editForm.formState.errors.content.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editRating" className="text-right">
                      Rating (1-5)
                    </Label>
                    <Input
                      id="editRating"
                      type="number"
                      {...editForm.register('rating')}
                      className="col-span-3"
                      min="1"
                      max="5"
                    />
                    {editForm.formState.errors.rating && (
                      <p className="col-span-4 text-red-500 text-sm text-right">
                        {editForm.formState.errors.rating.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editApproved" className="text-right">
                      Approved
                    </Label>
                    <Checkbox
                      id="editApproved"
                      checked={editForm.watch('approved')}
                      onCheckedChange={(checked) => editForm.setValue('approved', checked as boolean)}
                      className="h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-50"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="bg-[#f4c430] hover:bg-[#e0b02a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-semibold">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  This action cannot be undone. This will permanently delete the testimonial.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-full px-6 py-2 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={handleDeleteTestimonial}
                    disabled={deleteMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-6 py-2 transition-all duration-200"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminTestimonialsPage;