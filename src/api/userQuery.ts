import {apiClient} from "./apiClient";
import paths from "./paths";
import { UserQuery } from "../types/userQuery";

export const userQueryAPI = {
    userQuery: async (query: UserQuery): Promise<UserQuery> => {
      const response = await apiClient.post(paths.userQuery, query);
      return response.data;
    }
};