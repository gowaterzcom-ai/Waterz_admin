import { apiClient } from "./apiClient";
import paths from "./paths";
import { CreateYachtRequest } from "../types/createYacht";

export const ownerAPI = {


  createYacht: async (yacht: CreateYachtRequest): Promise<CreateYachtRequest> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.post(paths.createYacht, yacht, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateYacht: async (yachtId: string, yachtData: Partial<CreateYachtRequest>): Promise<CreateYachtRequest> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.put(`${paths.updateYacht}/${yachtId}`, yachtData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },


};
