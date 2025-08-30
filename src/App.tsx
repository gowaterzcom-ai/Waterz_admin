// import './App.css';
// // import Home from './components/Home/Home';
// // import MainLayout from './components/Layouts/MainLayout';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MainLayout from './components/Layouts/MainLayout';
// import Home from './components/Home/Home';
// import Discover from './components/Discover/Discover';
// import Booking from './components/Booking/Booking';
// import Location from './components/Location/Location';
// import Choose from './components/Choose/Choose';
// import Details from './components/YachtDetails/YachtDetails';
// import BookingDetails from './components/Booking/BookingDetails';
// import Total from './components/Total/Total';
// import SignUp from './components/LoginSignup/SignUp';
// import Login from './components/LoginSignup/Login';
// import { ToastContainer } from 'react-toastify';
// function App() {
//   return (
//     <Router> 
//       <Routes>
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<MainLayout><Home/></MainLayout>} />
//         <Route path="/discover" element={<MainLayout><Discover/></MainLayout>} />
//         <Route path="/bookings" element={<MainLayout><Booking/></MainLayout>} />
//         <Route path="/location" element={<MainLayout><Location/></MainLayout>} />
//         <Route path="/choose" element={<MainLayout><Choose/></MainLayout>} />
//         <Route path="/details" element={<MainLayout><Details/></MainLayout>} />
//         <Route path="/booking-details" element={<MainLayout><BookingDetails/></MainLayout>} />
//         <Route path="/to-pay" element={<MainLayout><Total/></MainLayout>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import './App.css';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MainLayout from './components/Layouts/MainLayout';
import AdminLayout from './components/Layouts/AdminLayout';
import Home from './components/Home/Home';
// import Discover from './components/Discover/Discover';
import Booking from './components/Booking/Booking';
// import Location from './components/Location/Location';
import Choose from './components/Choose/Choose';
import Details from './components/YachtDetails/YachtDetails';
import BookingDetails from './components/Booking/BookingDetails';
// import Total from './components/Total/Total';
import SignUp from './components/LoginSignup/SignUp';
import Login from './components/LoginSignup/Login';
// import PaymentSuccess from './components/Payment/PaymentSuccess';
// import PaymentFailed from './components/Payment/PaymentFailed'; 
import Yachts from './components/YachtDetails/Yachts';
import Customer from './components/Customer/Customer';
import Agent from './components/Agent/Agent';
import SuperAgent from './components/Agent/SuperAgent';
import Earnings from './components/Earnings/Earnings';
import Add from './components/Add/Add';
import Dashboard from './components/Dashboard/Dashboard';
import YachtForm from './components/YatchForm/YatchForm';
import Review from './components/YachtDetails/YatchReview';
import AgentDetails from './components/Agent/AgentDetails';
import SuperAgentDetails from './components/Agent/SuperAgentDetails';
import AgentForm from './components/Agent/AgentFrom';
import SuperAgentSignupForm from './components/Agent/SuperAgentForm';
import Query from './components/Query/Query';
import PromoCodePage from './components/PromoCode/PromoCode';
import GoogleCallback from './components/LoginSignup/GoogleCallback';
import CompleteProfile from './components/LoginSignup/CompleteProfile';

function App() {
  const location = useLocation();
  // const token = localStorage.getItem('token');
  // console.log(token);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/auth-callback" element={<GoogleCallback />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout><Home/></MainLayout>} />
        <Route path="/booking" element={<AdminLayout><Booking/></AdminLayout>} />
        <Route path="/choose" element={<MainLayout><Choose/></MainLayout>} />
        <Route path="/yachts" element={<AdminLayout><Yachts/></AdminLayout>} />
        <Route path="/yacht/:id" element={<AdminLayout><Details/></AdminLayout>} />
        <Route path="/booking-details/:id" element={<AdminLayout><BookingDetails/></AdminLayout>} />
        <Route path="/customer" element={<AdminLayout><Customer/></AdminLayout>} />
        <Route path="/agent" element={<AdminLayout><Agent/></AdminLayout>} />
        <Route path="/agent-profile/:id" element={<AdminLayout><AgentDetails/></AdminLayout>} />
        <Route path="/superagent" element={<AdminLayout><SuperAgent/></AdminLayout>} />
        <Route path="/super-agent-profile/:id" element={<AdminLayout><SuperAgentDetails/></AdminLayout>} />
        <Route path="/earnings" element={<AdminLayout><Earnings/></AdminLayout>} />
        <Route path="/add" element={<AdminLayout><Add/></AdminLayout>} />
        <Route path="/add-agent" element={<AdminLayout><AgentForm/></AdminLayout>} />
        <Route path="/add-superagent" element={<AdminLayout><SuperAgentSignupForm/></AdminLayout>} />
        <Route path="/add-yacht" element={<AdminLayout><YachtForm/></AdminLayout>} />
        <Route path="/yatch-review" element={<AdminLayout><Review/></AdminLayout>} />
        <Route path="/dashboard" element={<AdminLayout><Dashboard/></AdminLayout>} />
        <Route path="/queries" element={<AdminLayout><Query/></AdminLayout>} />
        <Route path="/promo-codes" element={<AdminLayout><PromoCodePage/></AdminLayout>} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;