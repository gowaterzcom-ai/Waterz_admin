// import { DashboardResponse } from '../../api/admin';

// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// const years = ['2024', '2025', '2026', '2027'];

// export const generateMockData = (filters: {
//   bookingView: 'thisYear' | 'overall';
//   earningView: 'thisYear' | 'overall';
//   distributionView: 'thisYear' | 'thisMonth';
// }): DashboardResponse => {
//   // Generate booking data
//   const bookingData = filters.bookingView === 'thisYear' 
//     ? months.map(month => ({
//         month,
//         totalBookings: Math.floor(Math.random() * 100) + 50,
//         customerBookings: Math.floor(Math.random() * 60) + 20,
//         agentBookings: Math.floor(Math.random() * 40) + 30,
//       }))
//     : years.flatMap(year => 
//         months.map(month => ({
//           month: `${month} ${year}`,
//           totalBookings: Math.floor(Math.random() * 100) + 50,
//           customerBookings: Math.floor(Math.random() * 60) + 20,
//           agentBookings: Math.floor(Math.random() * 40) + 30,
//           year
//         }))
//       );

//   // Generate earning data
//   const earningData = filters.earningView === 'thisYear'
//     ? months.map(month => ({
//         month,
//         amount: Math.floor(Math.random() * 400000) + 100000,
//       }))
//     : years.flatMap(year =>
//         months.map(month => ({
//           month: `${month} ${year}`,
//           amount: Math.floor(Math.random() * 400000) + 100000,
//           year
//         }))
//       );

//   // Calculate totals
//   const totalBookings = bookingData.reduce((sum, item) => sum + item.totalBookings, 0);
//   const totalCustomerBookings = bookingData.reduce((sum, item) => sum + item.customerBookings, 0);
//   const totalAgentBookings = bookingData.reduce((sum, item) => sum + item.agentBookings, 0);
//   const totalEarnings = earningData.reduce((sum, item) => sum + item.amount, 0);

//   // Calculate percentages for current period
//   const customerBookingPercentage = (totalCustomerBookings / totalBookings) * 100;
//   const agentBookingPercentage = (totalAgentBookings / totalBookings) * 100;

//   // Random distribution for earnings
//   const customerEarningPercentage = 42.1; // Fixed as per UI
//   const agentEarningPercentage = 57.9; // Fixed as per UI

//   return {
//     bookings: {
//       data: bookingData,
//       total: totalBookings,
//       byCustomer: totalCustomerBookings,
//       byAgent: totalAgentBookings
//     },
//     earnings: {
//       data: earningData,
//       total: totalEarnings
//     },
//     distribution: {
//       bookings: {
//         customerPercentage: customerBookingPercentage,
//         agentPercentage: agentBookingPercentage,
//         customerValue: totalCustomerBookings,
//         agentValue: totalAgentBookings
//       },
//       earnings: {
//         customerPercentage: customerEarningPercentage,
//         agentPercentage: agentEarningPercentage,
//         customerValue: Math.floor(totalEarnings * (customerEarningPercentage / 100)),
//         agentValue: Math.floor(totalEarnings * (agentEarningPercentage / 100))
//       }
//     }
//   };
// };