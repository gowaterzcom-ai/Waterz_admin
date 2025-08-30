import React from 'react';
import styles from '../../styles/LoginSignup/Login.module.css';
import googleIcon from '../../assets/LoginSignUp/google.svg';

interface GoogleAuthButtonProps {
  text: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ text }) => {
  const handleGoogleAuth = () => {
  // // Redirect to the backend Google auth endpoint
    // const redirectUri = window.location.origin; // Will be https://www.agent.wavezgoa.com
    // window.location.href = `http://localhost:8000/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Use this for production:
    const redirectUri = window.location.origin; // Will be https://www.agent.wavezgoa.com

    window.location.href = `https://www.backend.wavezgoa.com/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <button 
      type="button" 
      className={styles.googleButton}
      onClick={handleGoogleAuth}
    >
      <img src={googleIcon} alt="Google" />
      {text}
    </button>
  );
};

export default GoogleAuthButton;
