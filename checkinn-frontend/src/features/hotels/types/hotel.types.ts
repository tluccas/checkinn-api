export interface Hotel {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  totalRooms: number;
  starsRating: number;
  description: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelRequest {
  name: string;
  city: string;
  state: string;
  address: string;
  totalRooms: number;
  starsRating?: number;
  description?: string;
  phone?: string;
  email?: string;
}
