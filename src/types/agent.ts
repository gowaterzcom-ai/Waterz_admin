import { Yacht } from "./yachts";

export interface Agent {
    agentId: string;
    agentName: string;
  }
  
export interface AgentState {
  allAgents: IAgent[];
  loading: boolean;
  error: string | null;
}


export interface IAgent {
    id: string;
    username: string;
    name: string;
    age: number;
    experience: number;
    email: string;
    phone: string;
    address: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    commissionRate: number;
    imgUrl: string;
    bookings: Yacht[];
    isVerifiedByAdmin?: 'requested' | 'accepted' | 'denied';
}

