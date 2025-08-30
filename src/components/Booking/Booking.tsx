import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminAPI, BookingData, BookingFilters } from "../../api/admin";
import BookedCard from "../Layouts/BookedCard";
import styles from "../../styles/Booking/Booking.module.css";
import { Search } from "lucide-react";

const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearchName = searchParams.get("searchName") || "";
  const initialDisplayName = searchParams.get("displayName") || "";

  // displayName is what appears in the search input.
  // searchName is what is used in the API call.
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [searchName, setSearchName] = useState(initialSearchName || initialDisplayName);

  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({
    status: "all",
    bookedBy: "all",
  });

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getBookings({
        ...filters,
        searchName: searchName, // will be the customer's email if provided via URL
      });
      // @ts-ignore
      setBookings(response.bookings || []);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  return (
    <div className={styles.bookingContainer}>
      <h1 className={styles.title}>Bookings</h1>

      <div className={styles.statusTabs}>
        <button
          className={`${styles.tab} ${filters.status === "all" ? styles.activeTab : ""}`}
          onClick={() => setFilters({ ...filters, status: "all" })}
        >
          All
        </button>
        <button
          className={`${styles.tab} ${filters.status === "upcoming" ? styles.activeTab : ""}`}
          onClick={() => setFilters({ ...filters, status: "upcoming" })}
        >
          Upcoming
        </button>
        <button
          className={`${styles.tab} ${filters.status === "previous" ? styles.activeTab : ""}`}
          onClick={() => setFilters({ ...filters, status: "previous" })}
        >
          Past Bookings
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.bookingTabs}>
          <button
            className={`${styles.filterTab} ${filters.bookedBy === "all" ? styles.activeFilterTab : ""}`}
            onClick={() => setFilters({ ...filters, bookedBy: "all" })}
          >
            All
          </button>
          <button
            className={`${styles.filterTab} ${filters.bookedBy === "agent" ? styles.activeFilterTab : ""}`}
            onClick={() => setFilters({ ...filters, bookedBy: "agent" })}
          >
            Agent
          </button>
          <button
            className={`${styles.filterTab} ${filters.bookedBy === "customer" ? styles.activeFilterTab : ""}`}
            onClick={() => setFilters({ ...filters, bookedBy: "customer" })}
          >
            Customer
          </button>
        </div>

        <form onSubmit={handleSearch} className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setSearchName(e.target.value);
            }}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <Search size={20} />
          </button>
        </form>
      </div>

      <div className={styles.bookingsGrid}>
        {bookings.map((booking) => (
          <BookedCard
            key={booking._id}
            name={booking.name}
            capacity={booking.capacity}
            startingPrice={booking.startingPrice}
            imageUrl={booking.images[0]}
            bookingId={booking._id}
            booking={booking}
          />
        ))}
      </div>
    </div>
  );
};

export default Booking;




// import React, { useEffect, useState } from "react";
// import { adminAPI, BookingData, BookingFilters } from "../../api/admin";
// import BookedCard from "../Layouts/BookedCard";
// import styles from "../../styles/Booking/Booking.module.css";
// import { Search } from "lucide-react";

// const Booking: React.FC = () => {
//   const [bookings, setBookings] = useState<BookingData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filters, setFilters] = useState<BookingFilters>({
//     status: 'all',
//     bookedBy: 'all'
//   });
//   const [searchName, setSearchName] = useState('');

//   const fetchBookings = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await adminAPI.getBookings({
//         ...filters,
//         searchName: searchName
//       });
//       // Access the bookings array from the response
//       // @ts-ignore
//       setBookings(response.bookings || []);
//     } catch (err) {
//       setError('Failed to fetch bookings');
//       console.error('Error fetching bookings:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [filters]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchBookings();
//   };

//   if (isLoading) {
//     return <div className={styles.loading}>Loading bookings...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.bookingContainer}>
//       <h1 className={styles.title}>Bookings</h1>
      
//       <div className={styles.statusTabs}>
//         <button 
//           className={`${styles.tab} ${filters.status === 'all' ? styles.activeTab : ''}`}
//           onClick={() => setFilters({ ...filters, status: 'all' })}
//         >
//           All
//         </button>
//         <button 
//           className={`${styles.tab} ${filters.status === 'upcoming' ? styles.activeTab : ''}`}
//           onClick={() => setFilters({ ...filters, status: 'upcoming' })}
//         >
//           Upcoming
//         </button>
//         <button 
//           className={`${styles.tab} ${filters.status === 'previous' ? styles.activeTab : ''}`}
//           onClick={() => setFilters({ ...filters, status: 'previous' })}
//         >
//           Past Bookings
//         </button>
//       </div>

//       <div className={styles.filterBar}>
//         <div className={styles.bookingTabs}>
//           <button 
//             className={`${styles.filterTab} ${filters.bookedBy === 'all' ? styles.activeFilterTab : ''}`}
//             onClick={() => setFilters({ ...filters, bookedBy: 'all' })}
//           >
//             All
//           </button>
//           <button 
//             className={`${styles.filterTab} ${filters.bookedBy === 'agent' ? styles.activeFilterTab : ''}`}
//             onClick={() => setFilters({ ...filters, bookedBy: 'agent' })}
//           >
//             Superagent / Agent
//           </button>
//           <button 
//             className={`${styles.filterTab} ${filters.bookedBy === 'customer' ? styles.activeFilterTab : ''}`}
//             onClick={() => setFilters({ ...filters, bookedBy: 'customer' })}
//           >
//             Customer
//           </button>
//         </div>

//         <form onSubmit={handleSearch} className={styles.searchBox}>
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//             className={styles.searchInput}
//           />
//           <button type="submit" className={styles.searchButton}>
//             <Search size={20} />
//           </button>
//         </form>
//       </div>

//       <div className={styles.bookingsGrid}>
//         {bookings.map((booking) => (
//           <BookedCard
//             key={booking._id}
//             name={booking.name}
//             capacity={booking.capacity}
//             startingPrice={booking.startingPrice}
//             imageUrl={booking.images[0]}
//             bookingId={booking._id}
//             booking={booking}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Booking;