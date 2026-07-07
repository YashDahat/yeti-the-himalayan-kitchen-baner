import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { useBlogPosts } from '@/hooks/useBlog';

const BlogPage: React.FC = () => {
  const { data: blogPosts, isLoading, isError } = useBlogPosts();

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Journey Through Our Stories</h1>
          <p className="text-xl text-white mt-4">Discover the tales and traditions behind Yeti - The Himalayan Kitchen.</p>
        </div>
      </div>

      {/* Blog Post Grid Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2B3C] mb-8 text-center">Our Latest Adventures</h2>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center text-red-600 text-lg">
              Failed to load blog posts. Please try again later.
            </div>
          )}

          {!isLoading && !isError && (!blogPosts || blogPosts.length === 0) && (
            <div className="text-center text-gray-600 text-lg">
              No blog posts found. Check back soon for new stories!
            </div>
          )}

          {!isLoading && !isError && blogPosts && blogPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
                  <img
                    src={post.imageUrl ?? undefined}
                    alt={post.title ?? undefined}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold text-[#1A2B3C] mb-2">{post.title}</h3>
                  <p className="text-gray-700 text-sm mb-4 flex-grow leading-relaxed">
                    {truncateContent(post.content ?? '', 150)}
                  </p>
                  <div className="text-gray-600 text-xs mb-4">
                    By {post.author} on {post.publicationDate ? format(new Date(post.publicationDate), 'MMMM dd, yyyy') : ''}
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="mt-auto bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200 self-start text-center"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;