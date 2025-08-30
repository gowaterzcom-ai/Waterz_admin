import { useState, useEffect } from 'react';
import styles from "../../styles/LoginSignup/verified.module.css";
import { CheckCircle } from "lucide-react";

const SuccessScreen = () => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className={styles.container_body}>
      <div className={styles.container}>
        <div className={styles.contentSection}>
          <div className={`${styles.successContent} ${show ? styles.show : ''}`}>
            <div className={styles.iconWrapper}>
              <CheckCircle className={styles.icon} />
            </div>
            <h1 className={styles.title}>Account Created Successfully!</h1>
            <p className={styles.message}>
              You will be redirected to login page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;