// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { BlogPostDto } from '@/types/blog';

export const getAllBlogPosts = async (): Promise<BlogPostDto[]> => {
  const response = await apiClient.get<BlogPostDto[]>('/api/v1/blog');
  return response.data;
};

export const getBlogPostById = async (id: string): Promise<BlogPostDto> => {
  const response = await apiClient.get<BlogPostDto>(`/api/v1/blog/${id}`);
  return response.data;
};

export const adminGetAllBlogPosts = async (): Promise<BlogPostDto[]> => {
  const response = await apiClient.get<BlogPostDto[]>('/api/v1/admin/blog');
  return response.data;
};

export const adminGetBlogPostById = async (id: string): Promise<BlogPostDto> => {
  const response = await apiClient.get<BlogPostDto>(`/api/v1/admin/blog/${id}`);
  return response.data;
};

export const createBlogPost = async (request: BlogPostDto): Promise<BlogPostDto> => {
  const response = await apiClient.post<BlogPostDto>('/api/v1/admin/blog', request);
  return response.data;
};

export const updateBlogPost = async (id: string, request: BlogPostDto): Promise<BlogPostDto> => {
  const response = await apiClient.put<BlogPostDto>(`/api/v1/admin/blog/${id}`, request);
  return response.data;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/blog/${id}`);
};

