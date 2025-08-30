import styles from "../../styles/LoginSignup/welcome.module.css";
import welcmPic from "../../assets/LoginSignUp/welcome.webp";

const Welcome = ({ setType }: { setType: (type: string) => void }) => {
  return (
    <div className={styles.container_body}>
      <div className={styles.container}>
        <div className={styles.contentSection}>
          <h1 className={styles.title}>Welcome To Waterz</h1>
          
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => setType('customer')}>
              Continue as a Customer
            </button>
            <button className={styles.button} onClick={() => setType('yacht-owner')}>
              Continue as a Yacht Owner
            </button>
            <button className={styles.button} onClick={() => setType('agent')}>
              Continue as an Agent
            </button>
            <button className={styles.button} onClick={() => setType('super-agent')}>
              Continue as a Super Agent
            </button>
            <button className={styles.button} onClick={() => setType('admin')}>
              Continue as an Admin
            </button>
          </div>
        </div>
        
        <div className={styles.imageSection}>
          <img 
            src={welcmPic}
            alt="Yacht in calm waters"
            className={styles.yachtImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;