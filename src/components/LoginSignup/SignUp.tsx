import React, { useState, useEffect } from "react";
import styles from "../../styles/LoginSignup/Signup.module.css";
import signPic from "../../assets/LoginSignUp/signup.webp";
// import googleIcon from "../../assets/LoginSignUp/google.svg";
import OTPVerification from "./OTP";
import { authAPI } from "../../api/auth";
import SuccessScreen from "./OTPVerified";
import { useNavigate, useParams } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuth";

type ViewState = 'signup' | 'otp' | 'success';

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  agreeToTerms: boolean;
}

interface ErrorState {
  name: string;
  email: string;
  phone: string;
  password: string;
  terms: string;
  general: string;
}

interface SignupResponse {
  token: string;
}

// Validation functions

// General email validation function
const validateEmail = (email: string): boolean => {
  console.log("email validating")
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  console.log(emailRegex.test(email))
  return emailRegex.test(email);
};


// Validate that the email is a properly formatted Gmail address (case-insensitive)
const isValidGmail = (email: string): boolean => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  return gmailRegex.test(email);
};

// Check if email contains a likely mistyped Gmail variant
const isLikelyMispelledGmail = (email: string): boolean => {
  const lowerEmail = email.toLowerCase();
  return lowerEmail.includes('@gmail') && !lowerEmail.endsWith('@gmail.com');
};

const validatePassword = (password: string): boolean => {
  // Password must contain at least one uppercase letter and one special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
  return passwordRegex.test(password);
};

const validatePhone = (phone: string): boolean => {
  // Basic phone validation (can be adjusted to your specific requirements)
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/[-()\s]/g, ''));
};

const SignupForm = ({ onSubmit }: { onSubmit: (formData: SignupData) => Promise<void>; }) => {
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin', 
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<ErrorState>({
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: '',
    general: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ ...formData, name });
    
    if (name.trim() === '') {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    
    if (email) {
      if (!validateEmail(email)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else if (isLikelyMispelledGmail(email)) {
        setErrors(prev => ({ ...prev, email: 'Did you mean to type @gmail.com?' }));
      } else if (!isValidGmail(email)) {
        // If you want to enforce Gmail addresses only, you can enable the below error.
        // Otherwise, remove or comment out this block.
        // setErrors(prev => ({ ...prev, email: 'Email must be a valid Gmail address (@gmail.com)' }));
        setErrors(prev => ({ ...prev, email: '' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });
    
    if (phone && !validatePhone(phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    
    if (password && !validatePassword(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter and one special character' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const agreeToTerms = e.target.checked;
    setFormData({ ...formData, agreeToTerms });
    
    if (!agreeToTerms) {
      setErrors(prev => ({ ...prev, terms: 'You must agree to the terms and conditions' }));
    } else {
      setErrors(prev => ({ ...prev, terms: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset all errors
    setErrors({
      name: '',
      email: '',
      phone: '',
      password: '',
      terms: '',
      general: ''
    });
    
    // Validate all fields
    let hasError = false;
    
    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      hasError = true;
    }

    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasError = true;
    } else if (isLikelyMispelledGmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Did you mean to type @gmail.com?' }));
      hasError = true;
    } else if (!isValidGmail(formData.email)) {
      // Uncomment the next two lines to enforce Gmail addresses only
      // setErrors(prev => ({ ...prev, email: 'Email must be a valid Gmail address (@gmail.com)' }));
      // hasError = true;
      setErrors(prev => ({ ...prev, email: '' }));
    }

    if(!validateEmail(formData.email)) {
      console.log("invalid email")
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      hasError = true;
    }

    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      hasError = true;
    } else if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
      hasError = true;
    }

    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      hasError = true;
    } else if (!validatePassword(formData.password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter and one special character' }));
      hasError = true;
    }

    if (!formData.agreeToTerms) {
      setErrors(prev => ({ ...prev, terms: 'You must agree to the terms and conditions' }));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formData);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, general: err.message || 'Failed to sign up. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container_body}>
      <div className={styles.container}>
        <div className={styles.contentSection}>
          {errors.general && <p className={styles.error}>{errors.general}</p>}
          <div className={styles.formHeader}>
            <span className={styles.userType}>Admin</span>
            <h1 className={styles.formTitle}>Get Started Now</h1>
            <p className={styles.formSubtitle}>Enter your Credentials to get access to your account</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleNameChange}
                disabled={isLoading}
              />
              {errors.name && <p className={styles.error}>{errors.name}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handlePhoneChange}
                disabled={isLoading}
              />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
              {errors.password && <p className={styles.error}>{errors.password}</p>}
            </div>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={handleTermsChange}
                disabled={isLoading}
              />
              <label htmlFor="terms">
                I agree to the <a href="#" className={styles.link}>terms & conditions</a>
              </label>
            </div>
            {errors.terms && <p className={styles.error}>{errors.terms}</p>}
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
            <div className={styles.divider}><span>or</span></div>
            <GoogleAuthButton text="Sign in with Google" />
            <p className={styles.loginPrompt}>
              Already have an account? <a href="/login" className={styles.link}>Log in</a>
            </p>
          </form>
        </div>
        <div className={styles.imageSection}>
          <img src={signPic} alt="People enjoying on yacht" className={styles.SyachtImage} />
        </div>
      </div>
    </div>
  );
};

const SignUp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('signup');
  const [formData, setFormData] = useState<SignupData | null>(null);
  const [signupToken, setSignupToken] = useState<string>('');
  const navigate = useNavigate();
  const { referralCode } = useParams();

  useEffect(() => {
    if (currentView === 'success') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentView, navigate]);

  const handleSignupComplete = async (data: SignupData) => {
    try {
      // @ts-ignore
      const response: SignupResponse = await authAPI.signup(data, referralCode);
      setFormData(data);
      setSignupToken(response.token);
      setCurrentView('otp');
    } catch (err: any) {
      throw err;
    }
  };

  const handleOTPVerify = async (otp: number) => {
    try {
      if (!formData || !signupToken) {
        throw new Error('Missing required data for verification');
      }
      // @ts-ignore
      await authAPI.verifyOTP({ otp, token: signupToken, role: formData.role });
      setCurrentView('success');
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <>
      {currentView === 'signup' && <SignupForm onSubmit={handleSignupComplete} />}
      {/* @ts-ignore */}
      {currentView === 'otp' && formData && <OTPVerification email={formData.email} onVerify={handleOTPVerify} onBack={() => setCurrentView('signup')} />}
      {currentView === 'success' && <SuccessScreen />}
    </>
  );
};

export default SignUp;



// import React, { useState, useEffect } from "react";
// import styles from "../../styles/LoginSignup/Signup.module.css";
// import signPic from "../../assets/LoginSignUp/signup.webp";
// import googleIcon from "../../assets/LoginSignUp/google.svg";
// import OTPVerification from "./OTP";
// import { authAPI } from "../../api/auth";
// import SuccessScreen from "./OTPVerified";
// import { useNavigate, useParams } from "react-router-dom";

// type ViewState = 'signup' | 'otp' | 'success';

// interface SignupData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   role: string;
//   agreeToTerms: boolean;
// }

// interface SignupResponse {
//   token: string;
// }

// const SignupForm = ({ onSubmit }: { onSubmit: (formData: SignupData) => Promise<void>; }) => {
//   const [formData, setFormData] = useState<SignupData>({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     role: 'admin', 
//     agreeToTerms: false
//   });

//   const [error, setError] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.agreeToTerms) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await onSubmit(formData);
//     } catch (err: any) {
//       setError(err.message || 'Failed to sign up. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container_body}>
//       <div className={styles.container}>
//         <div className={styles.contentSection}>
//           {error && <p>{error}</p>}
//           <div className={styles.formHeader}>
//             <span className={styles.userType}>Admin</span>
//             <h1 className={styles.formTitle}>Get Started Now</h1>
//             <p className={styles.formSubtitle}>Enter your Credentials to get access to your account</p>
//           </div>
//           <form onSubmit={handleSubmit} className={styles.form}>
//             <div className={styles.formGroup}>
//               <label>Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email address"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>Phone Number</label>
//               <input
//                 type="tel"
//                 placeholder="Enter your phone number"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//               />
//             </div>
//             <div className={styles.checkboxGroup}>
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={formData.agreeToTerms}
//                 onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
//               />
//               <label htmlFor="terms">
//                 I agree to the <a href="#" className={styles.link}>terms & conditions</a>
//               </label>
//             </div>
//             <button type="submit" className={styles.submitButton} disabled={isLoading}>
//               {isLoading ? 'Signing up...' : 'Sign Up'}
//             </button>
//             <div className={styles.divider}><span>or</span></div>
//             <button type="button" className={styles.googleButton}>
//               <img src={googleIcon} alt="Google" />
//               Sign Up with Google
//             </button>
//             <p className={styles.loginPrompt}>
//               Already have an account? <a href="/login" className={styles.link}>Log in</a>
//             </p>
//           </form>
//         </div>
//         <div className={styles.imageSection}>
//           <img src={signPic} alt="People enjoying on yacht" className={styles.SyachtImage} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const SignUp: React.FC = () => {
//   const [currentView, setCurrentView] = useState<ViewState>('signup');
//   const [formData, setFormData] = useState<SignupData | null>(null);
//   const [signupToken, setSignupToken] = useState<string>('');
//   const navigate = useNavigate();
//   const { referralCode } = useParams();

//   useEffect(() => {
//     if (currentView === 'success') {
//       const timer = setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentView, navigate]);

//   const handleSignupComplete = async (data: SignupData) => {
//     try {
//       // @ts-ignore
//       const response: SignupResponse = await authAPI.signup(data, referralCode);
//       setFormData(data);
//       setSignupToken(response.token);
//       setCurrentView('otp');
//     } catch (err: any) {
//       throw err;
//     }
//   };

//   const handleOTPVerify = async (otp: number) => {
//     try {
//       if (!formData || !signupToken) {
//         throw new Error('Missing required data for verification');
//       }
//       // @ts-ignore
//       await authAPI.verifyOTP({ otp, token: signupToken, role: formData.role });
//       setCurrentView('success');
//     } catch (err: any) {
//       throw err;
//     }
//   };

//   return (
//     <>
//       {currentView === 'signup' && <SignupForm onSubmit={handleSignupComplete} />}
//        {/* @ts-ignore */}
//       {currentView === 'otp' && formData && <OTPVerification email={formData.email} onVerify={handleOTPVerify} onBack={() => setCurrentView('signup')} />}
//       {currentView === 'success' && <SuccessScreen />}
//     </>
//   );
// };

// export default SignUp;