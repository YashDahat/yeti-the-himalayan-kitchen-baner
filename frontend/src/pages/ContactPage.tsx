import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';

const ContactPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520607162513-77705d09033c?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Get in Touch</h1>
        </div>
      </section>

      {/* Contact Details & Business Hours Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Contact Details</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong className="block">Yeti - The Himalayan Kitchen</strong>
              First Floor, Yeti - The Himalayan Kitchen, Baner, Atria Building, Baner Rd, Kapil Malhar, Baner Gaon, Baner, Pune, Maharashtra 411069
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Phone:</strong> 070305 55077
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Email:</strong> info@yetihimalayankitchen.com
            </p>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Business Hours</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Monday - Sunday:</strong> 11:00 AM - 11:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* Our Location Section (Map) */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Our Location</h2>
          <div className="aspect-w-16 aspect-h-9 w-full h-[400px] rounded-xl overflow-hidden shadow-md border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.091104869408!2d73.80326907499806!3d18.55953108253106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf3d8b5f3d4d%3A0x7e7e7e7e7e7e7e7e!2sYeti%20-%20The%20Himalayan%20Kitchen!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Yeti - The Himalayan Kitchen Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Send Us a Message</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</Label>
                <Input type="text" id="name" name="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#d4a843] focus:border-[#d4a843] sm:text-sm" />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                <Input type="email" id="email" name="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#d4a843] focus:border-[#d4a843] sm:text-sm" />
              </div>
              <div>
                <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</Label>
                <Input type="text" id="subject" name="subject" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#d4a843] focus:border-[#d4a843] sm:text-sm" />
              </div>
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#d4a843] focus:border-[#d4a843] sm:text-sm p-3"
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;