import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
// import { createReservation } from '@/services/api'; // Assuming an API service for reservations

// Define the schema for the reservation form
const reservationFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }).max(50, {
    message: 'Name must not be longer than 50 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, {
    message: 'Please enter a valid phone number (e.g., +919876543210).',
  }),
  date: z.date({
    required_error: 'A reservation date is required.',
  }).refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Reservation date cannot be in the past.',
  }),
  time: z.string({
    required_error: 'A reservation time is required.',
  }),
  numberOfGuests: z.coerce.number().min(1, {
    message: 'Number of guests must be at least 1.',
  }).max(20, {
    message: 'Maximum 20 guests per reservation online. For larger groups, please call.',
  }),
  specialRequests: z.string().max(500, {
    message: 'Special requests cannot exceed 500 characters.',
  }).optional(),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

// Predefined time slots for reservations
const timeSlots = [
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM', '10:00 PM',
];

interface ReservationFormProps {
  onReservationSuccess?: (reservationData: ReservationFormValues) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onReservationSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: undefined,
      time: '',
      numberOfGuests: 1,
      specialRequests: '',
    },
  });

  const onSubmit = async (values: ReservationFormValues) => {
    setIsLoading(true);
    try {
      // In a real application, you would call your backend API here:
      // const response = await createReservation(values);
      // const newReservation = response.data;

      // Simulate API call and network delay
      console.log('Submitting reservation:', values);
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Reservation Confirmed!',
        description: `Thank you, ${values.name}. Your table for ${values.numberOfGuests} on ${format(values.date, 'PPP')} at ${values.time} has been booked.`,
        variant: 'default',
      });
      form.reset(); // Clear form after successful submission
      onReservationSuccess?.(values);
    } catch (error) {
      console.error('Reservation failed:', error);
      toast({
        title: 'Reservation Failed',
        description: 'There was an error processing your reservation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today for comparison

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-deep-blue mb-6 text-center">Book Your Table</h2>
      <p className="text-center text-gray-700 mb-8">
        Embark on a culinary journey to the Himalayas. Reserve your spot for an authentic dining experience.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earthy-brown">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="border-gray-300 focus:border-saffron-orange focus:ring-saffron-orange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earthy-brown">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} className="border-gray-300 focus:border-saffron-orange focus:ring-saffron-orange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earthy-brown">Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+919876543210" {...field} className="border-gray-300 focus:border-saffron-orange focus:ring-saffron-orange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-earthy-brown">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal border-gray-300 focus:border-saffron-orange focus:ring-saffron-orange",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < today} // Disable past dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-earthy-brown">Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-saffron-orange focus:ring-saffron-orange">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="numberOfGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earthy-brown">Number of Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(isNaN(value) ? '' : value); // Handle empty input gracefully
                    }}
                    className="border-gray-300 focus:border-saffron-orange focus:ring-saffron-orange"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earthy-brown">Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any dietary restrictions, special occasions, or seating preferences?"
                    className="resize-y min-h-[80px] border-gray-300 focus:border-saffron-orange focus:ring-saffron-orange"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-saffron-orange hover:bg-maroon text-white font-semibold py-3 rounded-md transition-colors duration-300" disabled={isLoading}>
            {isLoading ? 'Booking...' : 'Confirm Reservation'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReservationForm;