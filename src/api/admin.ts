import { apiClient } from "./apiClient";
import paths from "./paths";

interface TodayAnalytics {
  count: number;
  percentageChange: number;
}

interface PeriodAnalytics {
  current: number;
  lastWeek?: number;
  lastMonth?: number;
  lastYear?: number;
  percentageChange: number | null;
}

export interface Analytics {
  today: TodayAnalytics;
  weekly: PeriodAnalytics;
  monthly: PeriodAnalytics;
  yearly: PeriodAnalytics;
}

export interface AnalyticsResponse {
  analytics: Analytics;
}

export interface BookingFilters {
    status: 'all' | 'today' | 'previous' | 'upcoming';
    bookedBy: 'all' | 'agent' | 'customer';
    searchName?: string;
}

export interface YachtFilters {
    status: 'all' | 'recent' | 'requested' | 'denied' ;
    searchName?: string;
}
  
export interface BookingData {
  _id: string;
  name: string;
  capacity: number;
  startingPrice: string;
  images: string[];
  yacht: string;
  status: string;
  bookedBy: string;
  isVerifiedByAdmin: string;
}

export interface BookingsResponse {
    bookings: BookingData[];
}

// customer
export interface CustomerData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    bookings: string[];
    isVerified: boolean;
    createdAt: string;
  }
  
  export interface CustomerFilters {
    type: 'all' | 'withBookings' | 'withoutBookings';
    searchQuery?: string;
  }
  
  export interface CustomerResponse {
    customers: CustomerData[];
  }

// agent
export interface AgentData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    bookings: string[];
    isVerified: boolean;
    superagentName: string;
    createdAt: string;
    isVerifiedByAdmin: string;
    commissionRate: number;
  }
  
  export interface AgentFilters {
    type: 'all' | 'withBookings' | 'withoutBookings';
    searchQuery?: string;
  }
  
  export interface AgentResponse {
    agents: AgentData[];
  }

// super agent
export interface SuperAgentData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    agents: string[];
    isVerified: boolean;
    createdAt: string;
    isVerifiedByAdmin: string;
    commissionRate: number;
}
  
  export interface SuperAgentFilters {
    searchQuery?: string;
  }
  
  export interface SuperAgentResponse {
    superAgents: SuperAgentData[];
  }

// earnings
export interface PaymentData {
    totalBookings: number;
    totalEarning: number;
  }
  
  export interface EarningsFilters {
    period: 'total' | 'today' | 'lastWeek' | 'lastMonth';
  }
  
  export interface PaymentResponse {
    allEarnings: PaymentData;
  }

// dashboard
export interface BookingDataPoint {
  month: string;
  totalBookings: number;
  customerBookings: number;
  agentBookings: number;
}

export interface EarningDataPoint {
  month: string;
  amount: number;
}

export interface DistributionData {
  customerPercentage: number | null;
  agentPercentage: number | null;
  customerValue: number;
  agentValue: number;
}

export interface DashboardFilters {
  bookingView: 'thisYear' | 'overall';
  earningView: 'thisYear' | 'overall';
  distributionView: 'thisYear' | 'thisMonth';
}

export interface DashboardResponse {
  dashboard: {
    bookings: {
      data: BookingDataPoint[];
      total: number;
      byCustomer: number;
      byAgent: number;
    };
    earnings: {
      data: EarningDataPoint[];
      total: number;
    };
    distribution: {
      bookings: DistributionData;
      earnings: DistributionData;
    };
  }
}

// delete customer
export interface DeleteParams {
  customerId: string;
}

export interface DeleteResponse {
  message: string;
}

// Approve agent
export interface ApproveAgent {
  id: string;
  approved: string;
  commision: number;
}


// approve yacht
export interface ApproveYacht {
  sailingPeakTimePrice: number;
  sailingNonPeakTimePrice: number;
  anchoringPeakTimePrice: number;
  anchoringNonPeakTimePrice: number;
  approved: string;
  yatchId: string;
}

// Query
export interface QueryData {
  id: string;
  name: string;
  email: string;
  query: string;
  queryAnswer: string;
}

// Promo code
export interface TargetedUsers {
  userIds: string[];  // Using string instead of Types.ObjectId
  userType: "agent" | "customer";
  userModel: "User" | "Agent";
}

export interface UserUsage {
  userId: string;  // Using string instead of mongoose.Types.ObjectId
  usageCount: number;
}

export interface PromoCode {
  _id?: string;
  code: string;
  description: string;
  validFor: string;
  discountType: string;
  discountValue: number;
  targetedUsers?: {
    userIds: string; 
    userType: string;
    userModel: string;
  };
  userUsage: {
    userId: string; 
    usageCount: number;
  }[];
  maxUsagePerUser: number;
  totalUsageLimit: number;
  totalUsageCount: number;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  startDate: string; 
  expiryDate: string; 
  isActive: boolean;
}

export interface PromoCodeResponse {
  promoCodes: PromoCode[];
}

export interface CreatePromoCodeResponse {
  message: string;
}

export const adminAPI = {
  getAnalytics: async (): Promise<AnalyticsResponse> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get(paths.getAnalytics, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getBookings: async (filters: BookingFilters): Promise<BookingsResponse[]> => {
    const response = await apiClient.post(paths.getAllBookings, filters);
    return response.data;
  },

  getYachts: async (filters: YachtFilters): Promise<BookingsResponse[]> => {
    const response = await apiClient.post(paths.getAllYatchs, filters);
    return response.data;
  },
  getCustomers: async (filters: CustomerFilters): Promise<CustomerResponse> => {
    const response = await apiClient.post(paths.getAllCustomers, filters);
    return response.data;
  },
  getAllCustomers: async (): Promise<CustomerResponse> => {
    const response = await apiClient.get(paths.getCustomers);
    return response.data;
  },
  getAgents: async (filters: AgentFilters): Promise<AgentResponse> => {
    const response = await apiClient.post(paths.getAllAgents, filters);
    return response.data;
  },
  getAllAgents: async (): Promise<AgentResponse> => {
    const response = await apiClient.get(paths.getAgents);
    return response.data;
  },
  getAllOwners: async (): Promise<AgentResponse> => {
    const response = await apiClient.get(paths.getOwners);
    return response.data;
  },
  getSuperAgents: async (filters: SuperAgentFilters): Promise<SuperAgentResponse> => {
    const response = await apiClient.post(paths.getAllSuperAgents, filters);
    return response.data;
  },
  getPayments: async (filters: EarningsFilters): Promise<PaymentResponse> => {
    const response = await apiClient.post(paths.getAllPayments, filters);
    return response.data;
  },
  getDashboardData: async (filters: DashboardFilters): Promise<DashboardResponse> => {
    const response = await apiClient.post(paths.getDashboardData, filters);
    return response.data;
  },
  deleteCustomer: async (customerId: string): Promise<DeleteResponse> => {
    const response = await apiClient.delete(`${paths.deleteCustomer}/${customerId}`);
    return response.data;
  },


  getAgentById: async (id: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get(`${paths.getAgent}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },
  removeAgentById: async (id: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get(`${paths.removeAgent}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },

  approveAgent: async (filters: ApproveAgent): Promise<any> => {
    const response = await apiClient.post(`${paths.isApproved}/agent`, filters);
    return response.data;
  },

  updateAgentCommison: async (filters: ApproveAgent): Promise<any> => {
    const response = await apiClient.post(`${paths.updateAgentCommison}`, filters);
    return response.data;
  },

  getSuperAgentById: async (id: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get(`${paths.getSuperAgent}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },

  approveSuperAgent: async (filters: ApproveAgent): Promise<any> => { 
    const response = await apiClient.post(`${paths.isApproved}/superagent`, filters);
    return response.data;
  },
  
  updateSuperAgentCommison: async (filters: ApproveAgent): Promise<any> => {
    const response = await apiClient.post(`${paths.updateSuperAgentCommison}`, filters);
    return response.data;
  },

  approveYacht: async (filters: ApproveYacht): Promise<any> => {
    const response = await apiClient.post(`${paths.isApproved}/yatch/${filters.yatchId}`, filters);
    return response.data;
  },

  deleteYacht: async (yachtId: string): Promise<DeleteResponse> => {
    const response = await apiClient.delete(`${paths.removeYacht}/${yachtId}`);
    return response.data;
  },

  updateYachtPricing: async (filters: ApproveYacht): Promise<any> => {
    const response = await apiClient.post(`${paths.updatePricing}`, filters);
    return response.data;
  },

  getQueries: async ( ): Promise<QueryData[]> => {
    const response = await apiClient.get(paths.getAllQueries);
    return response.data;
  },

  queryResponse: async (query: QueryData): Promise<any> => {
    const response = await apiClient.post(`${paths.queryResponse}/${query.id}`, query);
    return response.data;
  },

  getAllPromoCodes: async (): Promise<PromoCodeResponse> => {
    const response = await apiClient.get(paths.getAllPromoCodes);
    return response.data;
  }, 

  createPromoCode: async (promoData: Omit<PromoCode, '_id'>): Promise<CreatePromoCodeResponse> => {
    const response = await apiClient.post(paths.generatePromoCode, promoData);
    return response.data;
  },

  deactivateCode: async (id: string): Promise<any> => {
    const response = await apiClient.post(`${paths.deactivatePromoCode}/${id}`);
    return response.data;
  },

  getAgentPayments: async (agentId: string): Promise<any> => {
    const response = await apiClient.post(paths.getAgentPayments, {agentId: agentId});
    return response.data;
  },

  agentPayStatus: async (bookingId: string): Promise<any> => {
    const response = await apiClient.post(paths.agentPayStatus, {bookingId: bookingId});
    return response.data;
  },
  getSuperAgentPayments: async (superAgentId: string): Promise<any> => {
    const response = await apiClient.post(paths.getSuperAgentPayments, {superAgentId: superAgentId});
    return response.data;
  },

  superAgentPayStatus: async (bookingId: string): Promise<any> => {
    const response = await apiClient.post(paths.superAgentPayStatus, {bookingId: bookingId});
    return response.data;
  },

  getBookingDetails: async (bookingId: string): Promise<any> => {
    const response = await apiClient.post(paths.getBookingDetails, {bookingId: bookingId});
    return response.data;
  },

};