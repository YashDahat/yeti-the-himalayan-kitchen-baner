import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReservationForm } from '@/components/ReservationForm';

const ReservationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <Card className="w-full max-w-2xl bg-white/90 text-gray-900 shadow-xl rounded-lg overflow-hidden border-2 border-saffron-orange">
        <CardHeader className="bg-earthy-brown text-white p-6">
          <CardTitle className="text-4xl font-bold text-center font-serif tracking-wide">
            Reserve Your Himalayan Journey
          </CardTitle>
          <CardDescription className="mt-2 text-lg text-center text-gray-200">
            Embark on a culinary adventure. Book your table at Yeti - The Himalayan Kitchen.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <p className="mb-6 text-center text-lg text-gray-700 leading-relaxed">
            We invite you to experience the warmth and rich flavors of the Himalayas.
            Please fill out the form below to secure your spot for an unforgettable dining experience.
          </p>
          <ReservationForm />
          <p className="mt-8 text-center text-sm text-gray-600">
            For special requests or larger parties, please contact us directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationPage;