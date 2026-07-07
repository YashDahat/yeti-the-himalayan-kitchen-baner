import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TestimonialDto } from '@/types/testimonial';
import {
  getAllApprovedTestimonials,
  getAllTestimonials,
  adminGetTestimonialById,
  createTestimonial,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial,
} from '@/services/testimonialService';

export const useAllApprovedTestimonials = () => {
  return useQuery<TestimonialDto[], Error>({
    queryKey: ['approvedTestimonials'],
    queryFn: getAllApprovedTestimonials,
  });
};

export const useAllTestimonials = () => {
  return useQuery<TestimonialDto[], Error>({
    queryKey: ['testimonials'],
    queryFn: getAllTestimonials,
  });
};

export const useTestimonial = (id: string | undefined) => {
  return useQuery<TestimonialDto, Error>({
    queryKey: ['testimonial', id],
    queryFn: () => adminGetTestimonialById(id!),
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation<TestimonialDto, Error, TestimonialDto>({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['approvedTestimonials'] });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation<TestimonialDto, Error, { id: string; testimonial: TestimonialDto }>({
    mutationFn: ({ id, testimonial }) => updateTestimonial(id, testimonial),
    onSuccess: (updatedTestimonial) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['approvedTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', updatedTestimonial.id] });
    },
  });
};

export const useApproveTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation<TestimonialDto, Error, string>({
    mutationFn: approveTestimonial,
    onSuccess: (approvedTestimonial) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['approvedTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', approvedTestimonial.id] });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['approvedTestimonials'] });
    },
  });
};