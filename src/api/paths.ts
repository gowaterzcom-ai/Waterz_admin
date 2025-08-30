const URL = "https://www.backend.wavezgoa.com"; 
// const URL = "http://localhost:8000"; //local server
const userBaseURL = URL + "/user";
const signUp = URL + "/auth";
const booking = URL + "/booking";
const customer = URL + "/customer";
const admin = URL + "/admin";
const owner = URL + "/owner";
const superagent = URL + "/superagent";

export const paths = {
  // Auth endpoints
  login: `${signUp}/signin`,
  signupAdmin: `${signUp}/signup/admin`,
  generateOtp: `${signUp}/generate-otp`,
  verifyOtp: `${signUp}/verify-otp`,
  logout: `${userBaseURL}/logout`,
  googleAuth: `${userBaseURL}/google`,
  signup: `${signUp}/signup`,

  
  // User endpoints
  getUserProfile: `${userBaseURL}/profile`,
  updateUserProfile: `${userBaseURL}/profile/update`,
  
  // yacht
  getYachtList: `${customer}/listAll`,
  getTopYachts: `${customer}/topYatch`,
  getYachtById: `${customer}/yatch-detail`,

  // query
  userQuery: `${URL}/query`,

  // filter
  locationFilter: `${booking}/idealYatchs`,
  bookYacht: `${booking}/create`,

  // Booking endpoints
    currentRides: `${customer}/current/rides`,
    prevRides: `${customer}/prev/rides`,
    prevRidesId: `${customer}/rides`,

  // owner
  createYacht: `${owner}/create`,
  updateYacht: `${owner}/update`,

  // superagent
  getAgent:`${superagent}/agent-detail`,
  getSuperAgent:`${admin}/superAgent-detail`,
  removeAgent:`${superagent}/remove-agent`,
  removeYacht:`${admin}/delete-yatch`,


  // Admin endpoints
  getAllYatchs: `${admin}/filtered-yatchs`,
  getAllOwners: `${admin}/getAllOwners`,
  getCustomers: `${admin}/getAllCustomers`,
  getAllCustomers: `${admin}/filtered-customers`,
  getAllBookings: `${admin}/filtered-bookings`,
  getBookingDetails: `${admin}/bookingDetails`,
  getAllQueries: `${admin}/getAllQueries`,
  queryResponse: `${admin}/queryResponse`,
  getAllPayments: `${admin}/filtered-Earning`,
  getAllSuperAgents: `${admin}/getFilteredSuperAgents`,
  getAllAgents: `${admin}/filtered-agent`,
  getAgents: `${admin}/getAllAgents`,
  getOwners: `${admin}/getAllOwners`,
  getYatchOwner: `${admin}/yatchOwner`,
  getAllBookingByOwner: `${admin}/owners-Booking`,
  getAnalytics: `${admin}/analytics`,
  getYatchDetail: `${admin}/getYatchDetail`,
  getDashboardData: `${admin}/getAdminDashboard`,
  deleteCustomer: `${admin}/delete-customer`,

  isApproved: `${admin}/isApproved`,
  updateAgentCommison: `${admin}/update-agent-comission`,
  updateSuperAgentCommison: `${admin}/update-superAgent-comission`,
  updatePricing: `${admin}/updatePricing`,
  registerAgent: `${admin}/updateAgentProfile`,
  registerSuperAgent: `${admin}/updateSuperAgentProfile`,

  getAllPromoCodes: `${admin}/getAllPromoCodes`,
  generatePromoCode: `${admin}/generate-promo-code`,
  deactivatePromoCode: `${admin}/deactivate-promo-code`,
  createAdminYacht: `${admin}/createAdminYacht`,
  getAgentPayments: `${admin}/getAgentPayments`,
  agentPayStatus: `${admin}/agentPayStatus`,
  getSuperAgentPayments: `${admin}/getSuperAgentPayments`,
  superAgentPayStatus: `${admin}/superAgentPayStatus`,
};



export default paths;
