import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { BlogPostDto } from '@/types/blog';
import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/services/blogService';

/**
 * Hook to fetch all blog posts.
 * @returns UseQueryResult containing an array of BlogPostDto.
 */
export const useBlogPosts = (): UseQueryResult<BlogPostDto[], Error> => {
  return useQuery<BlogPostDto[], Error>({
    queryKey: ['blogPosts'],
    queryFn: getAllBlogPosts,
  });
};

/**
 * Hook to fetch a single blog post by its ID.
 * @param id The ID of the blog post to fetch.
 * @returns UseQueryResult containing a single BlogPostDto.
 */
export const useBlogPost = (id: string): UseQueryResult<BlogPostDto, Error> => {
  return useQuery<BlogPostDto, Error>({
    queryKey: ['blogPost', id],
    queryFn: () => getBlogPostById(id),
    enabled: !!id, // Only run the query if id is truthy
  });
};

/**
 * Hook to create a new blog post.
 * @returns UseMutationResult for creating a blog post.
 */
export const useCreateBlogPost = (): UseMutationResult<BlogPostDto, Error, BlogPostDto> => {
  const queryClient = useQueryClient();
  return useMutation<BlogPostDto, Error, BlogPostDto>({
    mutationFn: createBlogPost,
    onSuccess: () => {
      // Invalidate all blog posts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

/**
 * Hook to update an existing blog post.
 * @returns UseMutationResult for updating a blog post.
 */
export const useUpdateBlogPost = (): UseMutationResult<BlogPostDto, Error, { id: string; post: BlogPostDto }> => {
  const queryClient = useQueryClient();
  return useMutation<BlogPostDto, Error, { id: string; post: BlogPostDto }>({
    mutationFn: ({ id, post }) => updateBlogPost(id, post),
    onSuccess: (data, variables) => {
      // Invalidate all blog posts query and the specific blog post query
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id] });
    },
  });
};

/**
 * Hook to delete a blog post.
 * @returns UseMutationResult for deleting a blog post.
 */
export const useDeleteBlogPost = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      // Invalidate all blog posts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};