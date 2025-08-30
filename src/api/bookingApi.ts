import { apiClient } from './apiClient';
import { paths } from './paths';

export interface Booking {
  id: string;
  name: string;
  capacity: number;
  startingPrice: string;
  imageUrl: string;
}

export const bookingAPI = {
  getCurrentBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get(paths.currentRides);
    return response.data;
  },
  
  getPreviousBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get(paths.prevRides);
    return response.data;
  }
};