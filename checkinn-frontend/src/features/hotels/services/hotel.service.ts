import { api } from "@/services/api";
import type { CreateHotelRequest, Hotel } from "../types/hotel.types";

export const hotelService = {
  findAll: () => api.get<Hotel[]>("/hotels"),
  create: (data: CreateHotelRequest) => api.post<Hotel>("/hotels", data),
};
