

export interface SuperAgentData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    agents: string[];
    isVerifiedByAdmin?: 'requested' | 'accepted' | 'denied';
    createdAt: string;
    commissionRate: number;
    imgUrl: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
}