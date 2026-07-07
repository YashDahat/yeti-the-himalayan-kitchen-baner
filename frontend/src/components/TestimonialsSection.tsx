import React from 'react';
import { useAllApprovedTestimonials } from '@/hooks/useTestimonials';

// Helper component for rendering star icons
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`h-5 w-5 ${filled ? 'text-[#f4c430]' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

const TestimonialsSection: React.FC = () => {
  const { data: testimonials, isLoading, isError } = useAllApprovedTestimonials();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2c3e50] text-center mb-4">
            Hear From Our Adventurous Guests
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            What our amazing customers have to say about their experiences.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, starIdx) => (
                    <div key={starIdx} className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          <p>Failed to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 px-4 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2c3e50] mb-4">
            Hear From Our Adventurous Guests
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            What our amazing customers have to say about their experiences.
          </p>
          <div className="p-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No testimonials available yet. Be the first to share your experience!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#2c3e50] text-center mb-4">
          Hear From Our Adventurous Guests
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          What our amazing customers have to say about their experiences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} filled={index < (testimonial.rating ?? 0)} />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial.content}"</p>
              <p className="font-semibold text-[#2c3e50]">- {testimonial.authorName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;