import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Layouts/YatchCard.module.css';
import { Yacht } from '../../types/yachts';
import { getYachtPrice } from '../../types/pricing';

interface YachtCardProps {
  yacht: Yacht;
  showLoc: boolean;
}

const YachtCard: React.FC<YachtCardProps> = ({ yacht, showLoc=false }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/yacht/${yacht._id}`, { state: { yacht } });
  };

  // Get the current sailing price based on IST time
  const currentSailingPrice = getYachtPrice(yacht, 'sailing');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{yacht.name}</h2>
        {
          showLoc ? <p className={styles.capacity}>Location: {yacht.location}</p> :
          <p className={styles.capacity}>Capacity: {yacht.capacity} people</p>
        }
        
      </div>
      <div className={styles.imageContainer}>
        <img 
          src={yacht.images[0]} 
          alt={yacht.name} 
          className={styles.image} 
        />
        <div className={styles.priceTag}>
          Sailing at ₹{currentSailingPrice}/hour
        </div>
      </div>
      <button className={styles.bookButton} onClick={handleBookNow}>
        View Details
      </button>
    </div>
  );
};

export default YachtCard;
