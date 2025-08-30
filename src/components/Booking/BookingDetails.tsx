import React, { useEffect, useState } from "react";
import styles from "../../styles/Booking/BookingDetails.module.css";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from "../../api/admin";

const BookingDetail: React.FC = () => {
    const location = useLocation();
    const bookingId = location.state.booking._id || '';
    console.log("id", bookingId);
    console.log("statee", location.state);
    const booking = location.state.booking
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [agentCommission, setAgentCommission] = useState<number>(0);
    const [superAgentCommission, setSuperAgentCommission] = useState<number>(0);

    useEffect(() => {
        const getBooking = async () => {
            // Add validation to ensure bookingId exists and is valid
            if (!bookingId || bookingId.trim() === '') {
                setError("No booking ID provided");
                return;
            }

            try {
                setLoading(true);
                setError(null);
                console.log("Making API call with bookingId:", bookingId); // Debug log
                const response = await adminAPI.getBookingDetails(bookingId);
                console.log("API response:", response); // Debug log
                // setBooking(response.booking);
                setAgentCommission(response?.booking?.agentCommission || 0);
                setSuperAgentCommission(response?.booking?.superAgentCommission || 0);
            } catch (err) {
                console.error("Error fetching booking details:", err);
                setError("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        }
        
        getBooking();
    }, [bookingId]);

    // Add early return if no booking state was passed
    if (!location.state?.booking) {
        return (
            <div className={styles.comp_body}>
                <div className={styles.errorContainer}>
                    No booking information available. Please navigate from the bookings list.
                </div>
            </div>
        );
    }

    console.log("booking", booking)

    // if (!booking) {
    //     return <div>No booking details available</div>;
    // }

    useEffect(() => {
      if (!booking?.images?.length) return;
      const handle = setInterval(() => {
        setCurrentIndex(prev =>
          prev === booking.images.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(handle);
    }, [booking]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const parsePackageDuration = (packageStr: string) => {
      if (!packageStr) return { total: 0, sailing: 0, anchorage: 0 };
    
      const lowercaseStr = packageStr.toLowerCase();
      
      // now match 1, 1.5, 2.5, etc.
      const sailingMatch   = lowercaseStr.match(/(\d+(?:\.\d+)?)_hours?_sailing/);
      const anchorageMatch = lowercaseStr.match(/(\d+(?:\.\d+)?)_hours?_anchorage/);
      
      const sailingHours   = sailingMatch   ? parseFloat(sailingMatch[1])   : 0;
      const anchorageHours = anchorageMatch ? parseFloat(anchorageMatch[1]) : 0;
      
      return {
        sailing:   sailingHours,
        anchorage: anchorageHours,
        total:     sailingHours + anchorageHours
      };
    };

  // Helper to prettify package type stringAdd commentMore actions
  function formatPackageType(pkg: string) {
    // Example: 1.5_hours_sailing_0.5_hour_anchorage
    const regex = /^([\d.]+)_hours?_sailing_([\d.]+)_hour?_anchorage$/;
    const match = pkg.match(regex);
    if (match) {
      const sailing = match[1];
      const anchorage = match[2];
      return `${sailing} hour${sailing !== "1" ? "s" : ""} sailing, ${anchorage} hour${anchorage !== "1" ? "s" : ""} anchorage`;
    }
    return pkg.replace(/_/g, " ");
  }

//   function capatalize(str: String) {
//     if(!str) return "";
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   }


    const duration = parsePackageDuration(booking?.packages);

    if (loading) {
      return (
        <div className={styles.comp_body}>
          <div className={styles.loadingContainer}>Loading booking details...</div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className={styles.comp_body}>
          <div className={styles.errorContainer}>{error}</div>
        </div>
      );
    }



    return (
        <div className={styles.comp_body}>
            <div className={styles.yatchBox}>
                <div className={styles.section_head}>Booking #{bookingId}</div>
                <div className={styles.section_head2}>Yacht Booking Details</div>
            </div>
            <div
              className={styles.image_box}
              style={{ overflow: 'hidden', position: 'relative' }}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={booking.images[currentIndex]}
                  src={booking.images[currentIndex]}
                  alt={`Yacht ${currentIndex + 1}`}
                  className={styles.Y2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </AnimatePresence>
            </div>
            <div className={styles.yacht_details_box}>
                <div className={styles.details}>
                    <div className={styles.prices}>
                        {/* <div className={styles.left}>
                            <div className={styles.price_head}>Booking Details</div>
                            <div className={styles.price_box}>
                                <div className={styles.pricess}>
                                    <div className={styles.price_type}>Start Date</div>
                                    <div className={styles.price_value}>{booking.startDate} hours</div>
                                </div>
                                <div className={styles.pricess2}>
                                    <div className={styles.price_type}>Still Time</div>
                                    <div className={styles.price_value}>{booking.stillTime} hours</div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className={styles.about}>
                        <h3>Booking Status</h3>
                        <p><b>Payment Status:</b> {booking.paymentStatus}</p>
                        <p><b>Booking Status:</b> {booking.status}</p>
                        <p><b>Ride Status:</b> {booking.rideStatus}</p>
                    </div>
                    <div className={styles.summary}>
                        <h3>Booking Summary</h3>
                        <p><b>Total Amount:</b> ₹{booking.totalAmount}</p>
                        <p><b>Package:</b> {formatPackageType(booking?.packages)}</p>
                        <p>
                          <b>Addon Service:</b>{" "}
                          {booking.addonServices && booking.addonServices.length
                            ? booking.addonServices.join(", ")
                            : "No Addon Services"}
                        </p>
                        <p><b>Number of People:</b> {booking.PeopleNo}</p>
                        <p><b>Location:</b> {booking.location}</p>
                    </div>
                    {agentCommission !=0 ?
                        <div className={styles.meetingPoint}>
                            <h3>Commission Details</h3>
                            <p><b>Agent Commission:</b> ₹{agentCommission}</p>
                            {superAgentCommission && <p><b>SuperAgent Commission</b> ₹{superAgentCommission}</p>}
                        </div> :
                        <></>
                    }   
                    <div className={styles.summary}>
                        <h3>Booked By</h3>
                        <p><b>Name:</b> {booking.customerName}</p>
                        <p><b>Email:</b> {booking.customerEmail}</p>
                        <p><b>Contact:</b> {booking.location == "Mumbai" || "Goa" ? `+91 ${booking.customerPhone}`: `+971 ${booking.customerPhone}` }</p>
                    </div>  
               
                    <div className={styles.schedule}>
                        <h3>Time Schedule</h3>
                        <ul>
                            <li>
                                <b>Start Date & Time:</b> {formatDate(booking.startDate)}
                            </li>
                            <li>
                                <b>End Date & Time:</b> {formatDate(booking.endDate)}
                            </li>
                            <li>
                                <b>Total Duration:</b> {duration.total} hours (Sailing: {duration.sailing}h, Anchorage: {duration.anchorage}h)
                            </li>
                        </ul>
                    </div>
                    {/* <div className={styles.specifications}>
                        <h3>Special Requests</h3>
                        <p>{booking.specialRequest || "No special requests"}</p>
                    </div> */}
                    <div className={styles.meetingPoint}>
                        <h3>Booking Information</h3>
                        <p><b>Booking ID:</b> {bookingId}</p>
                        <p><b>Created At:</b> {formatDate(booking.createdAt)}</p>
                        <p><b>Last Updated:</b> {formatDate(booking.updatedAt)}</p>
                    </div>
                    
                    
                    <div className={styles.guidelines}>
                        <h3>Important Guidelines</h3>
                        <ul>
                            <li><b>Swimming Not Required:</b> Life jackets are provided, so swimming skills are not mandatory.</li>
                            <li><b>Weather Preparedness:</b> Sailing depends on wind, tides, and clear conditions, which may cause slight schedule and route changes.</li>
                            <li><b>Advisory Cancellations:</b> Trips can be canceled by authorities; pre-payment is refundable or re-scheduled.</li>
                            <li><b>Stop Policy:</b> Wind-up time is included in your tour time.</li>
                            <li><b>Respect Policy:</b> Weather changes during the trip may need your cooperation.</li>
                        </ul>
                    </div>
                    <div className={styles.cancellation}>
                        <h3>Cancellation & Refund Policy</h3>
                        <p><b>Private Cancellations:</b> A refund is allowed if the booking is canceled due to unforeseeable weather, technical issues, or security protocols.</p>
                        <p><b>Customer Cancellations:</b> No refunds will be provided for cancellations made by the customer.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;
