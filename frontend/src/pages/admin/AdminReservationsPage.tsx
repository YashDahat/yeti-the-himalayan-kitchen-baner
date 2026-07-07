import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  useReservations,
  useUpdateReservationStatus,
  useDeleteReservation,
} from '@/hooks/useReservations';
import type { ReservationStatus } from '@/types/reservation';
import { format } from 'date-fns';
import clsx from 'clsx';

// UI Components from shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

// Radix UI Components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';

const AdminReservationsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // These states are passed to useReservations, but the underlying service call getAllReservations()
  // does not currently accept them, as per the comment in useReservations.ts.
  // The filter UI is implemented as requested, but actual backend filtering will not occur.
  const [filterStartDate, setFilterStartDate] = useState<string | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<string | undefined>(undefined);

  const {
    data: reservations,
    isLoading,
    isError,
    error,
  } = useReservations(filterStartDate, filterEndDate);
  const updateStatusMutation = useUpdateReservationStatus();
  const deleteMutation = useDeleteReservation();

  const handleFilter = () => {
    setFilterStartDate(startDate || undefined);
    setFilterEndDate(endDate || undefined);
  };

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const reservationStatuses: ReservationStatus[] = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'NO_SHOW',
  ];

  return (
    <AdminLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Reservations</h1>

          {/* Filter Section */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="w-full sm:w-auto"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="w-full sm:w-auto"
            />
            <Button onClick={handleFilter} className="bg-[#D2691E] hover:bg-[#A0522D] text-white font-semibold px-8 py-2 transition-all duration-200 w-full sm:w-auto">
              Filter
            </Button>
          </div>

          {/* Reservations Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading reservations...</p>
                {/* A simple spinner or skeleton could be added here for better UX */}
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {error?.message || 'Failed to fetch reservations.'}</p>
              </div>
            ) : !reservations || reservations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No reservations found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-200 text-gray-700">
                    <TableRow>
                      <TableHead className="py-3 px-4 text-left font-semibold">ID</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Customer Name</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Email</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Phone</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Date</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Time</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Guests</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Special Requests</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Status</TableHead>
                      <TableHead className="py-3 px-4 text-left font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id} className="bg-white hover:bg-gray-50 transition-all duration-200">
                        <TableCell className="py-3 px-4">{reservation.id.substring(0, 8)}...</TableCell>
                        <TableCell className="py-3 px-4">{reservation.customerName}</TableCell>
                        <TableCell className="py-3 px-4">{reservation.customerEmail}</TableCell>
                        <TableCell className="py-3 px-4">{reservation.customerPhone}</TableCell>
                        <TableCell className="py-3 px-4">
                          {format(new Date(reservation.reservationDate), 'yyyy-MM-dd')}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {/* Assuming reservationTime is a string like "HH:mm" */}
                          {format(new Date(`2000-01-01T${reservation.reservationTime}`), 'HH:mm')}
                        </TableCell>
                        <TableCell className="py-3 px-4">{reservation.numberOfGuests}</TableCell>
                        <TableCell className="py-3 px-4">{reservation.specialRequests || 'N/A'}</TableCell>
                        <TableCell className="py-3 px-4">
                          <Select
                            value={reservation.status}
                            onValueChange={(newStatus: ReservationStatus) =>
                              handleStatusChange(reservation.id, newStatus)
                            }
                          >
                            <SelectTrigger className="w-[180px] h-9 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2691E] focus:border-transparent">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              {reservationStatuses.map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  className={clsx(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                    {
                                      "font-semibold text-[#D2691E]": reservation.status === status,
                                    }
                                  )}
                                >
                                  {status.replace(/_/g, ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-3 px-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto z-50">
                              <AlertDialogTitle className="text-lg font-semibold mb-2">Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-sm text-gray-500 mb-4">
                                This action cannot be undone. This will permanently delete the reservation.
                              </AlertDialogDescription>
                              <div className="flex justify-end gap-2">
                                <AlertDialogCancel className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(reservation.id)}
                                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminReservationsPage;