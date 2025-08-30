import React, { useState } from 'react';
import styles from "../../styles/LoginSignup/welcome.module.css";


interface OTPVerificationProps {
    email: string;
    onVerify: (otp: string) => Promise<void>;
    onBack: () => void;
  }
  
  const OTPVerification = ({ email, onVerify, onBack }: OTPVerificationProps) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
  
      if (!otp) {
        setError('Please enter the OTP');
        return;
      }
  
      try {
        setIsLoading(true);
        await onVerify(otp);
      } catch (err: any) {
        setError(err.message || 'Invalid OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className={styles.container_body}>
        <div className={styles.container}>
          <div className={styles.contentSection}>
            <h1 className={styles.title}>Verify Your Email</h1>
            <p>We've sent a verification code to {email}</p>
            
            {error && (
              <p className={styles.error}>{error}</p>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.OTPinput}
                />
              </div>
              
              <div className={styles.buttonContainer}>
                <button 
                  type="submit" 
                  className={styles.button}
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <button 
                  type="button" 
                  className={styles.button} 
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

export default OTPVerification;