import { api } from "@/services/api";
import type {
  CreateGuestRequest,
  Guest,
  UpdateGuestRequest,
} from "../types/guest.types";

export const guestService = {
  findByReservation: (reservationId: string) =>
    api.get<Guest[]>(`/guests/reservation/${reservationId}`),
  create: (data: CreateGuestRequest) => api.post<Guest>("/guests", data),
  update: (id: string, data: UpdateGuestRequest) =>
    api.put<Guest>(`/guests/${id}`, data),
  remove: (id: string) => api.delete<void>(`/guests/${id}`),
};
