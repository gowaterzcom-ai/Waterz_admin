import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/YachtDetails/YachtDetails.module.css";
// import Y2 from "../../assets/Yatch/Y2.svg";
import { yachtAPI } from "../../api/yachts";
import { ownerAPI } from "../../api/owner";
import { motion, AnimatePresence } from 'framer-motion';

interface AddonService {
  service: string;
  pricePerHour: number;
}

const Review: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { yachtData, isEdit, yachtId } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // console.log("uachtData", yachtData)
  // Prepare fallback or formatted values for new data
  const peakSailing = yachtData?.price?.sailing?.peakTime
    ? `₹${Number(yachtData.price.sailing.peakTime).toLocaleString()}`
    : "N/A";

  const nonPeakSailing = yachtData?.price?.sailing?.nonPeakTime
    ? `₹${Number(yachtData.price.sailing.nonPeakTime).toLocaleString()}`
    : "N/A";

  const peakAnchoring = yachtData?.price?.anchoring?.peakTime
    ? `₹${Number(yachtData.price.anchoring.peakTime).toLocaleString()}`
    : "N/A";

  const nonPeakAnchoring = yachtData?.price?.anchoring?.nonPeakTime
    ? `₹${Number(yachtData.price.anchoring.nonPeakTime).toLocaleString()}`
    : "N/A";

  // Old fallback for "Sailing Price" / "Still Price" 
  // (Kept for reference; if not needed, remove or repurpose)

  // Convert add-on services
  const addonServices: AddonService[] = yachtData?.addonServices || [];
  // Convert packages
  const selectedPackages: string[] = yachtData?.packageTypes || [];

  // console.log("yachtData", yachtData)

  // Static data structure with dynamic values where available
  const yachtDetails = {
    name: yachtData?.name || "Luxury Yacht",
    description:
      yachtData?.description || "The Luxury Yacht is one of the most popular choices...",
    summary: {
      idealFor: "Friends, Family, Couples, Groups, Tourists",
      For: `${yachtData?.capacity || 6} people`,
      location: yachtData?.pickupat || "Gateway of India, Mumbai and Goa",
      duration: "According to preference",
      note: "This is an exclusive private sailing experience...",
    },
    specifications: {
      length: yachtData?.dimensions?.length || "65 feet",
      capacity: `${yachtData?.capacity || "10-15"} people`,
      crew: yachtData?.crewCount || "3",
    },
    meetingPoint: yachtData?.pickupat || "XYZ beach, Goa, India",
  };

  const handleEditYacht = () => {
    navigate("/yatch-form", {
      state: {
        isEdit: true,
        yachtId: yachtId,
      },
    });
  };

  const handleCharterYacht = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit && yachtId) {
        // Update existing yacht
        await ownerAPI.updateYacht(yachtId, yachtData);
      } else {
        // Create new yacht
        await yachtAPI.createYacht(yachtData);
      }
      // Navigate to success page
      navigate("/yachts");
    } catch (error) {
      console.error("Failed to process yacht:", error);
      setError("Failed to process yacht. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  function capitalize(str: String){
    if(!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    if (!yachtData?.images?.length) return;
    const handle = setInterval(() => {
      setCurrentIndex(prev =>
        prev === yachtData.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(handle);
  }, [yachtData?.images]);

  return (
    <div className={styles.comp_body}>
      {error && <div>{error}</div>}

      <div className={styles.yatchBox}>
        <div className={styles.section_head}>{yachtDetails.name}</div>
        <div className={styles.section_head2}>
          Explore options to craft a unique yachting experience.
        </div>
      </div>

      <div
        className={styles.image_box}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={yachtData.images[currentIndex]}
            src={yachtData.images[currentIndex]}
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
          {/* Old "Prices" Section (optional / for reference) */}
          <div className={styles.prices}>
            {/* <div className={styles.left}>
              <div className={styles.price_head}>Basic Prices</div>
              <div className={styles.price_box}>
                <div className={styles.pricess}>
                  <div className={styles.price_type}>Sailing Price</div>
                  <div className={styles.price_value}>{oldSailingPrice}</div>
                </div>
                <div className={styles.pricess2}>
                  <div className={styles.price_type}>Still/Anchorage Price</div>
                  <div className={styles.price_value}>{oldStillPrice}</div>
                </div>
              </div>
            </div> */}
            <div className={styles.Right2}>
              <button
                className={styles.bookButton}
                onClick={handleCharterYacht}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEdit
                  ? "Update Yacht"
                  : "Charter Yacht"}
              </button>
              {isEdit && (
                <button className={styles.bookButton} onClick={handleEditYacht}>
                  Edit Details
                </button>
              )}
            </div>
          </div>

          {/* New Detailed Pricing Section (Peak / Non-Peak) */}
          <div className={styles.detailedPricing}>
            <h3>Peak / Non-Peak Pricing</h3>
            <div className={styles.price_block}>
              <p>
                <b>Peak Hours Sailing:</b> {peakSailing}
              </p>
              <p>
                <b>Peak Hours Anchorage:</b> {peakAnchoring}
              </p>
            </div>
            <div className={styles.price_block}>
              <p>
                <b>Non-Peak Hours Sailing:</b> {nonPeakSailing}
              </p>
              <p>
                <b>Non-Peak Hours Anchorage:</b> {nonPeakAnchoring}
              </p>
            </div>
          </div>

          {/* About Yacht */}
          <div className={styles.addonSection}>
            <h3>Peak & Non-peak Hours</h3>
            <p>Peak Hours: 5:00 PM to 8:00 AM</p>
            <p>Non Peak Hours: 8:00 AM to 5:00 PM</p>
          </div>


          {/* Add-On Services Section */}
          {addonServices.length > 0 && (
            <div className={styles.addonSection}>
              <h3>Add-On Services</h3>
              <ul>
                {addonServices.map((serviceObj: AddonService, idx: number) => (
                  <li key={idx}>
                    <b>{serviceObj.service}:</b> ₹
                    {Number(serviceObj.pricePerHour).toLocaleString()} per hour
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Packages Section */}
          {selectedPackages.length > 0 && (
            <div className={styles.packageSection}>
              <h3>Packages</h3>
              <ul>
                {selectedPackages.map((pkg: string, idx: number) => (
                  <li key={idx}>{formatPackageType(pkg)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* About */}
          <div className={styles.about}>
            <h3>About {yachtDetails.name}</h3>
            <p>{yachtDetails.description}</p>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h3>Summary</h3>
            <p>
              <b>Ideal for:</b> {yachtDetails.summary.idealFor}
            </p>
            <p>
              <b>For:</b> {yachtDetails.summary.For}
            </p>
            <p>
              <b>Location:</b> {capitalize(yachtDetails.summary.location)}
            </p>
            <p>
              <b>Duration:</b> {yachtDetails.summary.duration}
            </p>
            {/* <p>
              <b>Note:</b> {yachtDetails.summary.note}
            </p> */}
          </div>

          {/* Schedule */}
          <div className={styles.schedule}>
            <h3>Sailing Schedule</h3>
            <ul>
              <li>
                <b>15 Minutes:</b> Arrive at the designated starting point as
                instructed by the captain. Safety instructions prior to
                departure.
              </li>
              <li>
                <b>15 Minutes:</b> The yacht journey is anchored away from the
                shore. You’ll be taken to a serene natural spot.
              </li>
              <li>
                <b>15 Minutes:</b> Conclude your journey with a scenic return
                yacht ride back to the shore.
              </li>
            </ul>
          </div>

          {/* Specifications */}
          <div className={styles.specifications}>
            <h3>Specifications</h3>
            {/* <p>
              <b>Length:</b> {yachtDetails.specifications.length}
            </p> */}
            <p>
              <b>Passenger Capacity:</b> {yachtDetails.specifications.capacity}
            </p>
            <p>
              <b>Crew:</b> {yachtDetails.specifications.crew}
            </p>
          </div>

          {/* Meeting Point */}
          {/* <div className={styles.meetingPoint}>
            <h3>Meeting Point Address</h3>
            <p>{yachtDetails.meetingPoint}</p>
          </div> */}

          {/* Guidelines */}
          <div className={styles.guidelines}>
            <h3>Important Guidelines</h3>
            <ul>
              <li>
                <b>Swimming Not Required:</b> Life jackets are provided, so
                swimming skills are not mandatory.
              </li>
              <li>
                <b>Weather Preparedness:</b> Sailing depends on wind, tides, and
                clear conditions, which may cause slight schedule and route
                changes.
              </li>
              <li>
                <b>Advisory Cancellations:</b> Trips from Gateway of India can
                be canceled by authorities; pre-payment is refundable or
                re-scheduled.
              </li>
              <li>
                <b>Stop Policy:</b> Wind-up time is included in your tour time.
              </li>
              <li>
                <b>Respect Policy:</b> Weather changes during the trip may need
                your cooperation.
              </li>
            </ul>
          </div>

          {/* FAQs */}
          <div className={styles.faqs}>
            <h3>FAQs</h3>
            <p>
              <b>Do you provide catering or food on the boat?</b>
              <br />
              No, we provide snacks and soft drinks without other personal
              requests. You are allowed to carry your own food and soft drinks
              or water. (We recommend sweet yogurt as a complimentary by Goa).
            </p>
            <p>
              <b>Can I add decorations like balloons, or cake on board?</b>
              <br />
              Yes. All private yacht decorations can be directly availed.
            </p>
            <p>
              <b>Can you make special arrangements for birthdays/anniversaries?</b>
              <br />
              Yes. We have an optional arrangement service. Make sure you confirm
              answers early by contacting our staff.
            </p>
            <p>
              <b>Is it a fixed location tour and will I describe the tour on my own?</b>
              <br />
              Yes. It is included and can be based on healthy weather discovery
              material that you may want to try!
            </p>
          </div>

          {/* Cancellation */}
          <div className={styles.cancellation}>
            <h3>Cancellation & Refund Policy</h3>
            <p>
              <b>Private Cancellations:</b> A refund is allowed if the booking is
              canceled due to unforeseeable weather, technical issues, or
              security protocols.
            </p>
            <p>
              <b>Customer Cancellations:</b> No refunds will be provided for
              cancellations made by the customer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;