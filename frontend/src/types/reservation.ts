// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface ReservationResponse {
  id: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  reservationDate: string | null;
  reservationTime: string | null;
  numberOfGuests: number | null;
  status: ReservationStatus | null;
  specialRequests: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface CreateReservationRequest {
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  reservationDate: string | null;
  reservationTime: string | null;
  numberOfGuests: number | null;
  specialRequests: string | null;
}

