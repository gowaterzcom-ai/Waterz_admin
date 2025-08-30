import { apiClient, nonAuthApiClient } from './apiClient';
import paths from './paths';
import { UserDetails } from '../types/user';

const GOOGLE_REDIRECT_URI = 'https://www.wavezgoa.com/auth/google/callback';

interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  agreeToTerms: boolean;
}

interface OTPData {
  otp: string;
  token: string;
  role: string;
}

interface EmailData {
  otp: string;
}

interface Registration {
  // name: string;
  dateOfBirth: string;
  // contactNumber: string;
  // email: string;
  address: string;
  username: string;
  experience: number;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  commissionRate: number;
  imgUrl: string;
  age: number;
  id: string;
}

interface GoogleProfileData {
  phone: string;
  role: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await nonAuthApiClient.post(paths.login, credentials);
    return response.data;
  },

  signup: async (userData: SignupData) => {
    const response = await nonAuthApiClient.post(paths.signupAdmin, userData);
    return response.data;
  },

  signupAgent: async (userData: SignupData) => {
    const response = await nonAuthApiClient.post(`${paths.signup}/agent`, userData);
    return response.data;
  },

  signupSuperAgent: async (userData: SignupData) => {
    const response = await nonAuthApiClient.post(`${paths.signup}/super-agent`, userData);
    return response.data;
  },

  generateOTP: async (email: EmailData) => {
    const response = await nonAuthApiClient.post(paths.generateOtp, email);
    return response.data;
  },

  verifyOTP: async (otp: OTPData) => {
    const response = await nonAuthApiClient.post(paths.verifyOtp, otp);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(paths.logout);
    return response.data;
  },

  getUserProfile: async (): Promise<UserDetails> => {
    const response = await apiClient.get(paths.getUserProfile);
    return response.data;
  },

  updateUserProfile: async (userData: Partial<UserDetails>) => {
    const response = await apiClient.put(paths.updateUserProfile, userData);
    return response.data;
  },

  registerAgent: async (userData: Registration) => {
    const response = await apiClient.post(`${paths.registerAgent}/${userData.id}`, userData);
    return response.data;
  },

  registerSuperAgent: async (userData: Registration) => {
    const response = await apiClient.post(`${paths.registerSuperAgent}/${userData.id}`, userData);
    return response.data;
  },

  initiateGoogleAuth: () => {
    window.location.href = `${paths.googleAuth}?redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}`;
  },
  // Google authentication
  completeGoogleProfile: async (data: GoogleProfileData) => {
    const response = await apiClient.post('/auth/complete-profile', data);
    return response.data;
  },
  
  checkGoogleAuth: async (email: string) => {
    const response = await nonAuthApiClient.post('/auth/check-google-auth', { email });
    return response.data;
  },

};