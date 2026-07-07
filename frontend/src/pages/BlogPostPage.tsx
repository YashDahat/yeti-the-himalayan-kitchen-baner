import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlog';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blogPost, isLoading, isError } = useBlogPost(id || '');

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-lg text-gray-700">Loading blog post...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-lg text-red-500">Error loading blog post.</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!blogPost) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-lg text-gray-700">Blog post not found.</p>
            <Link to="/blog" className="text-[#FF9933] hover:underline mt-4 inline-block transition-all duration-200">
              Back to Blog
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const formattedDate = new Date(blogPost.publicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <img
            src={blogPost.imageUrl}
            alt={blogPost.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
          <h1 className="text-4xl font-bold text-[#1A2B3C] mb-4">{blogPost.title}</h1>
          <p className="text-gray-600 text-sm mb-6">
            By {blogPost.author} on {formattedDate}
          </p>
          <div className="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed">
            <p>{blogPost.content}</p>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="mt-12 text-[#FF9933] hover:underline transition-all duration-200"
          >
            &larr; Back to Blog
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostPage;