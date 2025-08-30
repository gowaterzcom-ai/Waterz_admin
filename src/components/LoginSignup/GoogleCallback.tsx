import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store/hook';
import { setUserDetails } from '../../redux/slices/userSlice';
import styles from '../../styles/LoginSignup/Login.module.css';

const GoogleCallback: React.FC = () => {
  const [message, setMessage] = useState<string>('Processing your login...');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setMessage('Authentication failed: No token received');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
  
        // Verify if this is a redirect to complete profile
        // You need to extract the needsProfileUpdate from the token
        try {
          // Decode the token to check if it has the needsProfileUpdate flag
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          
          if (decodedToken.needsProfileUpdate) {
            // Store the token and redirect
            console.log('Profile needs to be completed, storing token:', token);
            localStorage.setItem('tempToken', token);
            navigate('/complete-profile');
            return;
          }
        } catch (err) {
          console.error('Error decoding token:', err);
        }
  
        // Regular successful login
        localStorage.setItem('token', token);
        
        // Decode token to get basic user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const { id, email, role } = JSON.parse(jsonPayload);
        
        // Set user details in Redux store
        dispatch(setUserDetails({
          id,
          email,
          role,
        }));
        
        // Redirect to appropriate page
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } catch (error) {
        console.error('Error processing Google auth callback:', error);
        setMessage('Authentication error occurred. Redirecting to login page...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
  
    handleCallback();
  }, [location.search, navigate, dispatch])

  return (
    <div className={styles.container_body}>
      <div className={styles.callbackContainer}>
        <h1>Google Authentication</h1>
        <p>{message}</p>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
};

export default GoogleCallback;

// // src/components/LoginSignup/GoogleCallback.tsx
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch } from '../../redux/store/hook';
// import { setUserDetails } from '../../redux/slices/userSlice';

// const GoogleCallback = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     // Get token from URL params
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get('token');

//     if (token) {
//       // Store token
//       localStorage.setItem('token', token);

//       // Fetch user profile using the token
//       const fetchUserProfile = async () => {
//         try {
//           const response = await fetch('https://backend.wavezgoa.com/customer/me', {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
//           const userData = await response.json();

//           // Update Redux state
//           dispatch(setUserDetails({
//             id: userData.id,
//             email: userData.email,
//             name: userData.name,
//             role: 'customer'
//           }));

//           // Navigate to home page
//           navigate('/discover');
//         } catch (error) {
//           console.error('Error fetching user profile:', error);
//           navigate('/login');
//         }
//       };

//       fetchUserProfile();
//     } else {
//       navigate('/login');
//     }
//   }, [navigate, dispatch]);

//   return (
//     <div>Processing login...</div>
//   );
// };

// export default GoogleCallback;