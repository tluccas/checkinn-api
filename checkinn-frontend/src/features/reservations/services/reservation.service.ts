import { api } from "@/services/api";
import type {
  CreateReservationRequest,
  Reservation,
} from "../types/reservation.types";

export const reservationService = {
  findAll: () => api.get<Reservation[]>("/reservations"),
  create: (data: CreateReservationRequest) =>
    api.post<Reservation>("/reservations", data),
};
