import { api } from "@/services/api";
import type {
  CreateReservationRequest,
  Reservation,
  UpdateReservationRequest,
  UpdateReservationStatusRequest,
} from "../types/reservation.types";
import type { PaginatedResponse } from "@/types/pagination.types";

export const reservationService = {
  findAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Reservation>>("/reservations", {
      params: { page: String(page), limit: String(limit) },
    }),
  create: (data: CreateReservationRequest) =>
    api.post<Reservation>("/reservations", data),
  update: (id: string, data: UpdateReservationRequest) =>
    api.put<Reservation>(`/reservations/${id}`, data),
  updateStatus: (id: string, data: UpdateReservationStatusRequest) =>
    api.patch<Reservation>(`/reservations/${id}/status`, data),
  remove: (id: string) => api.delete<void>(`/reservations/${id}`),
};
