import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Add/Add.module.css';
import addY from "../../assets/Yatch/addY.svg";
import addA from "../../assets/Yatch/addA.svg";
import addSA from "../../assets/Yatch/addSA.svg";
const Add: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.addContainer}>
      <h1 className={styles.title}>Add Yachts, Agents, Super Agents</h1>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <img 
            src={addY}
            alt="Yacht Management" 
            className={styles.cardImage}
          />
          <p className={styles.cardDescription}>
            Manage yacht listings, including details, pricing, and availability.
          </p>
          <button 
            className={styles.addButton}
            onClick={() => navigate('/add-yacht')}
          >
            Add Yacht
          </button>
        </div>

        <div className={styles.card}>
          <img 
            src={addA}
            alt="Agent Management" 
            className={styles.cardImage}
          />
          <p className={styles.cardDescription}>
            Add and manage agent profiles to streamline operations.
          </p>
          <button 
            className={styles.addButton}
            onClick={() => navigate('/add-agent')}
          >
            Add Agents
          </button>
        </div>

        <div className={styles.card}>
          <img 
            src={addSA} 
            alt="Super Agent Management" 
            className={styles.cardImage}
          />
          <p className={styles.cardDescription}>
            Create and manage super agent profiles with advanced permissions.
          </p>
          <button 
            className={styles.addButton}
            onClick={() => navigate('/add-superagent')}
          >
            Add Superagents
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;