import {apiClient} from "./apiClient";
import paths from "./paths";
import { Yacht } from "../types/yachts";
import { Idealyacht } from "../types/yachts";
import { bookYacht } from "../types/yachts";
import { CreateYachtRequest } from "../types/createYacht";
export const yachtAPI = {
    getAllYachts: async (): Promise<Yacht[]> => {
      const response = await apiClient.get(paths.getYachtList);
      console.log("Respons data is here :",response.data);
      return response.data;
    },

    getTopYachts: async (): Promise<Yacht[]> => {
      const response = await apiClient.get(paths.getTopYachts);
      return response.data;
    },

    getIdealYatchs: async (filters: Idealyacht): Promise<Idealyacht> => {
      const token = localStorage.getItem('token');
      const response = await apiClient.post(paths.locationFilter, filters, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },

    bookYacht: async (booking: bookYacht): Promise<bookYacht> => {
      const token = localStorage.getItem('token');
      const response = await apiClient.post(`${paths.bookYacht}/${booking.yacht}`, booking, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },

    getYachtById: async (yachtId: string): Promise<Yacht> => {
      const response = await apiClient.get(`${paths.getYatchDetail}/${yachtId}`);
      return response.data;
    },
    createYacht: async (yacht: CreateYachtRequest): Promise<CreateYachtRequest> => {
      const token = localStorage.getItem('token');
      const response = await apiClient.post(paths.createAdminYacht, yacht, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
  };
