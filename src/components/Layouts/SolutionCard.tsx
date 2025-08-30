import React from "react";
import styles from "../../styles/Layouts/SolutionCard.module.css"

interface SolutionCardProps{
    heading: string;
    subheading: string;
}

const SolutionCard: React.FC<SolutionCardProps> = ({heading, subheading}) => {
    return(
        <div className={styles.card}>
            <div className={styles.circleBox}>
               <div className={styles.circle}></div>
            </div>
            <div className={styles.head}>{heading}</div>
            <div className={styles.subHead}>{subheading}</div>
        </div>
    )
} 

export default SolutionCard;