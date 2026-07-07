import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
} from '@/services/reservationService';
import type { CreateReservationRequest, ReservationResponse, ReservationStatus } from '@/types/reservation';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateReservationRequest) => createReservation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useReservations = (startDate?: string, endDate?: string) => {
  return useQuery<ReservationResponse[], Error>({
    queryKey: ['reservations', startDate, endDate],
    queryFn: () => getAllReservations(), // The service function does not currently accept startDate/endDate, follow the service contract.
  });
};

export const useReservation = (id: string) => {
  return useQuery<ReservationResponse, Error>({
    queryKey: ['reservation', id],
    queryFn: () => getReservationById(id),
    enabled: !!id,
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatus }) =>
      updateReservationStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservation', variables.id] });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};