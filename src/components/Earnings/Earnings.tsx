import React, { useEffect, useState } from "react";
import { adminAPI, PaymentData } from "../../api/admin";
import styles from "../../styles/Earnings/Earnings.module.css";
import { IndianRupee } from "lucide-react";

const Earnings: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log('Hey buddy');
  const [selectedPeriod, setSelectedPeriod] = useState<'total' | 'today' | 'lastWeek' | 'lastMonth'>('total');

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getPayments({
        period: selectedPeriod
      });
      setPayments(response.allEarnings || null);
    } catch (err) {
      setError('Failed to fetch earnings data');
      console.error('Error fetching earnings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedPeriod]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading earnings data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const totalAmt = payments?.totalEarning || 0
  const totalGst = totalAmt*0.28;

  return (
    <div className={styles.earningsContainer}>
      <h1 className={styles.title}>Earnings</h1>

      <div className={styles.filterTabs}>
        <button 
          className={`${styles.filterTab} ${selectedPeriod === 'total' ? styles.activeFilterTab : ''}`}
          onClick={() => setSelectedPeriod('total')}
        >
          Total
        </button>
        <button 
          className={`${styles.filterTab} ${selectedPeriod === 'today' ? styles.activeFilterTab : ''}`}
          onClick={() => setSelectedPeriod('today')}
        >
          Today
        </button>
        <button 
          className={`${styles.filterTab} ${selectedPeriod === 'lastWeek' ? styles.activeFilterTab : ''}`}
          onClick={() => setSelectedPeriod('lastWeek')}
        >
          Last Week
        </button>
        <button 
          className={`${styles.filterTab} ${selectedPeriod === 'lastMonth' ? styles.activeFilterTab : ''}`}
          onClick={() => setSelectedPeriod('lastMonth')}
        >
          Last Month
        </button>
      </div>

      {payments && (
        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3>Total Bookings</h3>
            </div>
            <div className={styles.statsValue}>
              {payments.totalBookings}
            </div>
            <div className={styles.statsPeriod}>
              {selectedPeriod === 'total' ? 'All Time' : 
               selectedPeriod === 'today' ? 'Today' :
               selectedPeriod === 'lastWeek' ? 'Last 7 Days' : 'Last 30 Days'}
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3>Total Earnings</h3>
            </div>
            <div className={styles.statsValue}>
              <IndianRupee className={styles.currencyIcon} size={24} />
              {formatCurrency(payments.totalEarning).replace('₹', '')}
            </div>
            <div className={styles.statsPeriod}>
              {selectedPeriod === 'total' ? 'All Time' : 
               selectedPeriod === 'today' ? 'Today' :
               selectedPeriod === 'lastWeek' ? 'Last 7 Days' : 'Last 30 Days'}
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3>Total GST</h3>
            </div>
            <div className={styles.statsValue}>
              <IndianRupee className={styles.currencyIcon} size={24} />
              {formatCurrency(totalGst).replace('₹', '')}
            </div>
            <div className={styles.statsPeriod}>
              {selectedPeriod === 'total' ? 'All Time' : 
               selectedPeriod === 'today' ? 'Today' :
               selectedPeriod === 'lastWeek' ? 'Last 7 Days' : 'Last 30 Days'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;

// import React, { useEffect, useState } from "react";
// import { adminAPI, PaymentData } from "../../api/admin";
// import styles from "../../styles/Earnings/Earnings.module.css";
// import { IndianRupee } from "lucide-react";

// const Earnings: React.FC = () => {
//   const [payments, setPayments] = useState<PaymentData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   console.log('Hey buddy');
//   const [selectedPeriod, setSelectedPeriod] = useState<'total' | 'today' | 'lastWeek' | 'lastMonth'>('total');

//   const fetchPayments = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await adminAPI.getPayments({
//         period: selectedPeriod
//       });
//       setPayments(response.allEarnings || null);
//     } catch (err) {
//       setError('Failed to fetch earnings data');
//       console.error('Error fetching earnings:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, [selectedPeriod]);


//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   if (isLoading) {
//     return <div className={styles.loading}>Loading earnings data...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.earningsContainer}>
//       <h1 className={styles.title}>Earnings</h1>

//       <div className={styles.filterTabs}>
//         <button 
//           className={`${styles.filterTab} ${selectedPeriod === 'total' ? styles.activeFilterTab : ''}`}
//           onClick={() => setSelectedPeriod('total')}
//         >
//           Total
//         </button>
//         <button 
//           className={`${styles.filterTab} ${selectedPeriod === 'today' ? styles.activeFilterTab : ''}`}
//           onClick={() => setSelectedPeriod('today')}
//         >
//           Today
//         </button>
//         <button 
//           className={`${styles.filterTab} ${selectedPeriod === 'lastWeek' ? styles.activeFilterTab : ''}`}
//           onClick={() => setSelectedPeriod('lastWeek')}
//         >
//           Last Week
//         </button>
//         <button 
//           className={`${styles.filterTab} ${selectedPeriod === 'lastMonth' ? styles.activeFilterTab : ''}`}
//           onClick={() => setSelectedPeriod('lastMonth')}
//         >
//           Last Month
//         </button>
//       </div>

//       {payments && (
//         <div className={styles.statsGrid}>
//           <div className={styles.statsCard}>
//             <div className={styles.statsHeader}>
//               <h3>Total Bookings</h3>
//             </div>
//             <div className={styles.statsValue}>
//               {payments.totalBookings}
//             </div>
//             <div className={styles.statsPeriod}>
//               {selectedPeriod === 'total' ? 'All Time' : 
//                selectedPeriod === 'today' ? 'Today' :
//                selectedPeriod === 'lastWeek' ? 'Last 7 Days' : 'Last 30 Days'}
//             </div>
//           </div>

//           <div className={styles.statsCard}>
//             <div className={styles.statsHeader}>
//               <h3>Total Earnings</h3>
//             </div>
//             <div className={styles.statsValue}>
//               <IndianRupee className={styles.currencyIcon} size={24} />
//               {formatCurrency(payments.totalEarning).replace('₹', '')}
//             </div>
//             <div className={styles.statsPeriod}>
//               {selectedPeriod === 'total' ? 'All Time' : 
//                selectedPeriod === 'today' ? 'Today' :
//                selectedPeriod === 'lastWeek' ? 'Last 7 Days' : 'Last 30 Days'}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Earnings;