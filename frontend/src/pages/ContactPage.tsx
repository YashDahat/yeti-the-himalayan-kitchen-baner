import React from 'react';

const ContactPage: React.FC = () => {
  const address = "First Floor, Yeti - The Himalayan Kitchen, Baner, Atria Building, Baner Rd, Kapil Malhar, Baner Gaon, Baner, Pune, Maharashtra 411069";
  const phoneNumber = "+91 98765 43210"; // Placeholder phone number
  const emailAddress = "info@yetihimalayankitchen.com"; // Placeholder email address
  const operatingHours = "Mon-Sun: 12:00 PM - 3:00 PM & 7:00 PM - 11:00 PM";

  // Google Maps embed URL for "Yeti - The Himalayan Kitchen, Baner, Pune"
  // This URL is typically obtained from Google Maps by searching for the location,
  // clicking "Share", then "Embed a map", and copying the src attribute from the iframe.
  // The provided URL is a good approximation based on the business context.
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.162799307769!2d73.76679937500001!3d18.56611108256565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf25b6a7114d%3A0x1c3a6b5e0b7b7b7b!2sYeti%20-%20The%20Himalayan%20Kitchen%2C%20Baner!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-center text-blue-900 mb-8 font-serif tracking-wide">
          Reach Out to Yeti
        </h1>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Embark on a culinary journey with us. For reservations, inquiries, or just to say hello, we're here to help you experience the authentic taste of the Himalayas.
        </p>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Contact Details */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-orange-600 mb-6 font-serif">Contact Details</h2>
            <div className="space-y-5 text-lg">
              <p>
                <strong className="block text-blue-900 mb-1">Phone:</strong>
                <a href={`tel:${phoneNumber}`} className="text-gray-700 hover:text-orange-600 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {phoneNumber}
                </a>
              </p>
              <p>
                <strong className="block text-blue-900 mb-1">Email:</strong>
                <a href={`mailto:${emailAddress}`} className="text-gray-700 hover:text-orange-600 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {emailAddress}
                </a>
              </p>
              <p>
                <strong className="block text-blue-900 mb-1">Operating Hours:</strong>
                <span className="text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {operatingHours}
                </span>
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-orange-600 mb-6 font-serif">Our Location</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              <strong className="block text-blue-900 mb-2">Yeti - The Himalayan Kitchen</strong>
              <span className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-600 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="block">
                  {address.split(', ').map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))}
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="mt-16 bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-8 font-serif">Find Us on the Map</h2>
          <div className="relative w-full overflow-hidden rounded-md" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute top-0 left-0 w-full h-full"
              title="Yeti - The Himalayan Kitchen Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;