import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store/hook';
import { setUserDetails } from '../../redux/slices/userSlice';
import styles from '../../styles/LoginSignup/Login.module.css';
import { apiClient } from '../../api/apiClient';
import { authAPI } from '../../api/auth';

const CompleteProfile: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      console.log('Token found in URL:', tokenFromUrl);
      localStorage.setItem('tempToken', tokenFromUrl);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!phone) {
      setError('Phone number is required');
      return;
    }
  
    try {
      setIsLoading(true);
  
      const token = localStorage.getItem('tempToken');
      if (!token) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
  
      // Temporarily set the token for this request
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      // Use the authAPI to update the user profile
      const response = await authAPI.completeGoogleProfile({ phone, role });
  
      // Remove the temp token and set the new one
      localStorage.removeItem('tempToken');
      const newToken = response.token;
      localStorage.setItem('token', newToken);
  
      // Update user details in Redux
      const user = response.user;
      dispatch(setUserDetails({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }));
  
      // Redirect after success
      navigate('/dashboard');
  
    } catch (error) {
      console.error('Error completing profile:', error);
      setError('Failed to complete your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container_body}>
      <div className={styles.container}>
        <div className={styles.contentSection}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Complete Your Profile</h1>
            <p className={styles.formSubtitle}>We need a bit more information to set up your account</p>
          </div>
          
          {error && (
            <p className={styles.error}>{error}</p>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Account Type</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
              >
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;