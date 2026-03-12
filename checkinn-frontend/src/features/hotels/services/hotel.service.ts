import { api } from "@/services/api";
import type {
  CreateHotelRequest,
  Hotel,
  UpdateHotelRequest,
} from "../types/hotel.types";
import type { PaginatedResponse } from "@/types/pagination.types";

export const hotelService = {
  findAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Hotel>>("/hotels", {
      params: { page: String(page), limit: String(limit) },
    }),
  create: (data: CreateHotelRequest) => api.post<Hotel>("/hotels", data),
  update: (id: string, data: UpdateHotelRequest) =>
    api.put<Hotel>(`/hotels/${id}`, data),
  remove: (id: string) => api.delete<void>(`/hotels/${id}`),
};
