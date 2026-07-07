import Layout from '@/components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[300px] md:h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550966871-3ed3cdb04c5a?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Our Story</h1>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            The Journey of Yeti - The Himalayan Kitchen
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              Yeti - The Himalayan Kitchen began with a simple dream: to bring the authentic, soul-warming flavors of the Himalayas to the vibrant city of Pune. Our founders, inspired by their travels through the majestic mountains and the rich culinary traditions of Nepal and Tibet, envisioned a place where every dish tells a story of heritage, passion, and the pristine landscapes from which these recipes originated.
            </p>
            <p>
              From humble beginnings, we embarked on a journey to source the finest ingredients, master traditional cooking techniques, and recreate the genuine taste of Himalayan cuisine. Our kitchen is a testament to the dedication of our chefs, who meticulously prepare each meal, ensuring that every bite transports our guests to the serene valleys and snow-capped peaks of the Himalayas.
            </p>
            <p>
              More than just a restaurant, Yeti is a cultural experience. It's a place where friends and family gather, where laughter fills the air, and where the spirit of Himalayan hospitality thrives. We are proud to share our culinary heritage with you and invite you to become a part of our ongoing story.
            </p>
          </div>
        </div>
      </section>

      {/* Culinary Philosophy Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Our Culinary Philosophy
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              At Yeti - The Himalayan Kitchen, our culinary philosophy is rooted in authenticity, freshness, and tradition. We believe that the true essence of Himalayan food lies in its simplicity and the quality of its ingredients. We are committed to using only the freshest, locally sourced produce whenever possible, combined with unique spices and herbs imported directly from the Himalayan region to ensure an unparalleled taste experience.
            </p>
            <p>
              Our chefs employ time-honored cooking methods passed down through generations, from slow-simmered broths to perfectly steamed momos and expertly grilled tandoori dishes. We shun artificial flavors and preservatives, focusing instead on natural ingredients that highlight the distinct profiles of each dish.
            </p>
            <p>
              We celebrate the diversity of Himalayan cuisine, offering a menu that spans the hearty flavors of Nepal, the subtle spices of Tibet, and the vibrant tastes of the surrounding regions. Every dish is crafted with care, reflecting our dedication to providing a wholesome, flavorful, and memorable dining experience that honors the rich culinary legacy of the Himalayas.
            </p>
          </div>
        </div>
      </section>

      {/* Ambiance Gallery Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Experience Our Ambiance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                alt="Restaurant interior dining area"
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="card">
              <img
                src="https://images.unsplash.com/photo-1592861956120-e524fcff1253?w=800&q=80"
                alt="Cozy restaurant seating"
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="card">
              <img
                src="https://images.unsplash.com/photo-1563905977-0473f0250616?w=800&q=80"
                alt="Restaurant bar area"
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="card">
              <img
                src="https://images.unsplash.com/photo-1578474846927-4403010779c1?w=800&q=80"
                alt="Elegant table setting"
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="card">
              <img
                src="https://images.unsplash.com/photo-1596468138116-f565551f3580?w=800&q=80"
                alt="Restaurant facade at night"
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="card">
              <img
                src="https://images.unsplash.com/photo-1552504008-013098317789?w=800&q=80"
                alt="Chef preparing food in kitchen"
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;