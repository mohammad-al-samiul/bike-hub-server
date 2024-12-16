export type TBike = {
  name: string;
  description: string;
  pricePerHour: number;
  isAvailable?: boolean;
  bikeImage?: string;
  cc: number;
  year: number;
  model: string;
  brand: string;
};
export type BikeFilterParams = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};
