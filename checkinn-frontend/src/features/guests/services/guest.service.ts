import { api } from "@/services/api";
import type { CreateGuestRequest, Guest } from "../types/guest.types";

export const guestService = {
  findByReservation: (reservationId: string) =>
    api.get<Guest[]>(`/guests/reservation/${reservationId}`),
  create: (data: CreateGuestRequest) => api.post<Guest>("/guests", data),
};
