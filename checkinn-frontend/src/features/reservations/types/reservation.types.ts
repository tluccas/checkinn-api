import type { Hotel } from "@/features/hotels/types/hotel.types";

export type ReservationStatus =
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export interface Reservation {
  id: string;
  hotelId: string;
  hotel?: Hotel;
  checkInDate: string;
  checkOutDate: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  roomCount: number;
  status: ReservationStatus;
  notes: string;
  guestCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  responsibleName: string;
  responsibleEmail?: string;
  responsiblePhone?: string;
  roomCount?: number;
  notes?: string;
}
