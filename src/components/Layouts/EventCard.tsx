import React from "react";
import styles from "../../styles/Layouts/EventCard.module.css"

interface EventCardProps{
    imgUrl: string;
    event: string;
}

const EventCard: React.FC<EventCardProps> = ({imgUrl, event}) => {
    return(
        <div className={styles.card}>
            <div className={styles.imgBox}>
                <img src={imgUrl} className={styles.eventImg} />
            </div>
            <div className={styles.event}>{event}</div>
        </div>
    )
} 

export default EventCard;