import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Define custom Tailwind colors if not already in tailwind.config.js:
// extend: {
//   colors: {
//     'earthy-brown': '#6F4E37', // Example, adjust to actual shade
//     'deep-blue': '#1A2E40',    // Example, adjust to actual shade
//     'saffron': '#FF9933',      // Example, adjust to actual shade
//     'maroon': '#800000',       // Example, adjust to actual shade
//     'light-grey': '#D3D3D3',   // Example, adjust to actual shade
//   },
//   fontFamily: {
//     sans: ['Inter', 'sans-serif'], // Or your preferred sans-serif font
//     serif: ['Playfair Display', 'serif'], // Or your preferred serif font
//   },
// },

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  // Assuming orderItems are not displayed directly on the account page table,
  // but would be on a separate "View Order Details" page.
  // orderItems: OrderItem[];
}

interface Reservation {
  id: number;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  status: string;
}

const AccountPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch User Profile
        const profileResponse = await api.get<UserProfile>('/api/users/profile');
        setUserProfile(profileResponse.data);

        // Fetch Orders
        const ordersResponse = await api.get<Order[]>('/api/orders/my');
        setOrders(ordersResponse.data);

        // Fetch Reservations
        const reservationsResponse = await api.get<Reservation[]>('/api/reservations/my');
        setReservations(reservationsResponse.data);

      } catch (err: any) {
        console.error('Failed to fetch account data:', err);
        if (err.response && err.response.status === 401) {
          setError('You need to be logged in to view this page.');
          // Optionally redirect to login page
          navigate('/login'); // Assuming a login route exists
        } else {
          setError('Failed to load account data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center text-maroon font-sans min-h-screen flex items-center justify-center">
        <p className="text-xl">Embarking on your account journey... Loading details.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600 font-sans min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">{error}</p>
        {error !== 'You need to be logged in to view this page.' && (
          <Button onClick={() => window.location.reload()} className="mt-4 bg-saffron text-white hover:bg-saffron/90 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300">
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-deep-blue mb-8 text-center font-serif tracking-wide">
          Your Yeti Account
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-earthy-brown/10 border border-earthy-brown rounded-lg p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-saffron data-[state=active]:text-white text-deep-blue hover:bg-earthy-brown/20 transition-colors duration-300 rounded-md py-2 font-semibold">
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-saffron data-[state=active]:text-white text-deep-blue hover:bg-earthy-brown/20 transition-colors duration-300 rounded-md py-2 font-semibold">
              Order History
            </TabsTrigger>
            <TabsTrigger value="reservations" className="data-[state=active]:bg-saffron data-[state=active]:text-white text-deep-blue hover:bg-earthy-brown/20 transition-colors duration-300 rounded-md py-2 font-semibold">
              Reservations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-white shadow-lg border-none rounded-lg overflow-hidden">
              <CardHeader className="bg-earthy-brown text-white rounded-t-lg p-6">
                <CardTitle className="text-2xl font-semibold font-serif">Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {userProfile ? (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-deep-blue font-medium text-base mb-1 block">Name</Label>
                      <Input id="name" value={`${userProfile.firstName} ${userProfile.lastName}`} readOnly className="mt-1 bg-stone-50 border-light-grey focus:ring-saffron focus:border-saffron text-deep-blue" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-deep-blue font-medium text-base mb-1 block">Email</Label>
                      <Input id="email" value={userProfile.email} readOnly className="mt-1 bg-stone-50 border-light-grey focus:ring-saffron focus:border-saffron text-deep-blue" />
                    </div>
                    {userProfile.phone && (
                      <div>
                        <Label htmlFor="phone" className="text-deep-blue font-medium text-base mb-1 block">Phone</Label>
                        <Input id="phone" value={userProfile.phone} readOnly className="mt-1 bg-stone-50 border-light-grey focus:ring-saffron focus:border-saffron text-deep-blue" />
                      </div>
                    )}
                    {/* Future enhancement: Edit Profile button */}
                    {/* <Button className="mt-4 bg-saffron text-white hover:bg-saffron/90 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300">Edit Profile</Button> */}
                  </>
                ) : (
                  <p className="text-deep-blue text-center py-4 text-lg">No profile data available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card className="bg-white shadow-lg border-none rounded-lg overflow-hidden">
              <CardHeader className="bg-earthy-brown text-white rounded-t-lg p-6">
                <CardTitle className="text-2xl font-semibold font-serif">Your Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-light-grey/50 border-b border-light-grey">
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Order ID</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Date</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Total</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Status</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="border-b border-light-grey/30 hover:bg-stone-50 transition-colors duration-200">
                            <TableCell className="font-medium text-deep-blue text-sm sm:text-base">#{order.id}</TableCell>
                            <TableCell className="text-deep-blue text-sm sm:text-base">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-deep-blue text-sm sm:text-base">₹{order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-deep-blue text-sm sm:text-base">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-saffron hover:bg-saffron/10 transition-colors duration-200 text-sm sm:text-base">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-deep-blue text-center py-4 text-lg">You haven't placed any orders yet. Time to explore our menu!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="mt-6">
            <Card className="bg-white shadow-lg border-none rounded-lg overflow-hidden">
              <CardHeader className="bg-earthy-brown text-white rounded-t-lg p-6">
                <CardTitle className="text-2xl font-semibold font-serif">Your Reservations</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {reservations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-light-grey/50 border-b border-light-grey">
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Reservation ID</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Date</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Time</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Guests</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Status</TableHead>
                          <TableHead className="text-deep-blue font-semibold text-sm sm:text-base">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map((reservation) => (
                          <TableRow key={reservation.id} className="border-b border-light-grey/30 hover:bg-stone-50 transition-colors duration-200">
                            <TableCell className="font-medium text-deep-blue text-sm sm:text-base">#{reservation.id}</TableCell>
                            <TableCell className="text-deep-blue text-sm sm:text-base">{new Date(reservation.reservationDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-deep-blue text-sm sm:text-base">{reservation.reservationTime}</TableCell>
                            <TableCell className="text-deep-blue text-sm sm:text-base">{reservation.numberOfGuests}</TableCell>
                            <TableCell className="text-deep-blue text-sm sm:text-base">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                reservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {reservation.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-saffron hover:bg-saffron/10 transition-colors duration-200 text-sm sm:text-base">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-deep-blue text-center py-4 text-lg">You haven't made any reservations yet. Book a table for an authentic experience!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;