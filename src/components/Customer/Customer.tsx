import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, CustomerData } from "../../api/admin";
import styles from "../../styles/Customer/Customer.module.css";
import { Search, SlidersHorizontal } from "lucide-react";

interface ComponentFilters {
  type: "all" | "withBookings" | "withoutBookings";
}

const Customer: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComponentFilters>({ type: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getCustomers({
        type: filters.type,
        searchQuery: searchQuery,
      });

      if (response && response.customers) {
        setCustomers(response.customers);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to fetch customers");
      console.error("Error fetching customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleRemoveCustomer = async (customerId: string) => {
    const customerToRemove = customers.find((c) => c._id === customerId);
    if (!customerToRemove) {
      alert("Customer not found");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to remove customer "${customerToRemove.name}" (${customerToRemove.email})? This action cannot be undone.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await adminAPI.deleteCustomer(customerId);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );
      alert(`Customer "${customerToRemove.name}" has been removed successfully`);
    } catch (err) {
      console.error("Error removing customer:", err);
      alert(`Failed to remove customer "${customerToRemove.name}". Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Updated function: pass email as searchName and name as displayName
  const handleBookingNavigation = (customer: CustomerData) => {
    navigate(
      `/booking?searchName=${encodeURIComponent(
        customer.email
      )}&displayName=${encodeURIComponent(customer.name)}`
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading customers...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.customerContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customer</h1>

        <div className={styles.filterSection}>
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <Search size={20} />
            </button>
          </form>

          <button
            className={styles.mobileFilterButton}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div
        className={`${styles.filterTabs} ${showMobileFilters ? styles.showMobile : ""}`}
      >
        <button
          className={`${styles.filterTab} ${
            filters.type === "all" ? styles.activeFilterTab : ""
          }`}
          onClick={() => setFilters({ type: "all" })}
        >
          All
        </button>
        <button
          className={`${styles.filterTab} ${
            filters.type === "withBookings" ? styles.activeFilterTab : ""
          }`}
          onClick={() => setFilters({ type: "withBookings" })}
        >
          With Bookings
        </button>
        <button
          className={`${styles.filterTab} ${
            filters.type === "withoutBookings" ? styles.activeFilterTab : ""
          }`}
          onClick={() => setFilters({ type: "withoutBookings" })}
        >
          Without Bookings
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.customerTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Id</th>
              <th>Contact</th>
              <th>Bookings</th>
              {/* <th>Queries</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  {customer.bookings.length > 0 ? (
                    <a
                      href="#"
                      className={styles.viewLink}
                      onClick={(e) => {
                        e.preventDefault();
                        handleBookingNavigation(customer);
                      }}
                    >
                      {customer.bookings.length} ( view details )
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                {/* <td>
                  {customer.bookings.length > 0 ? (
                    <a href="#" className={styles.viewLink}>
                      ( view query )
                    </a>
                  ) : (
                    "-"
                  )}
                </td> */}
                <td>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveCustomer(customer._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Removing..." : "Remove Customer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customer;



// import React, { useEffect, useState } from "react";
// import { adminAPI, CustomerData } from "../../api/admin";
// import styles from "../../styles/Customer/Customer.module.css";
// import { Search, SlidersHorizontal } from "lucide-react";

// interface ComponentFilters {
//   type: 'all' | 'withBookings' | 'withoutBookings';
// }

// const Customer: React.FC = () => {
//   const [customers, setCustomers] = useState<CustomerData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filters, setFilters] = useState<ComponentFilters>({ type: 'all' });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const fetchCustomers = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await adminAPI.getCustomers({
//         type: filters.type,
//         searchQuery: searchQuery
//       });
      
//       // Ensure we have the customers array with proper typing
//       if (response && response.customers) {
//         setCustomers(response.customers);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (err) {
//       setError('Failed to fetch customers');
//       console.error('Error fetching customers:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, [filters]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchCustomers();
//   };

//   const handleRemoveCustomer = async (customerId: string) => {
//     // Verify the customer exists
//     const customerToRemove = customers.find(c => c._id === customerId);
//     if (!customerToRemove) {
//       alert("Customer not found");
//       return;
//     }

//     // Show confirmation dialog with customer details
//     const isConfirmed = window.confirm(
//       `Are you sure you want to remove customer "${customerToRemove.name}" (${customerToRemove.email})? This action cannot be undone.`
//     );

//     if (!isConfirmed) {
//       return;
//     }

//     try {
//       setIsDeleting(true);
      
//       // Call the API to delete the customer
//       await adminAPI.deleteCustomer(customerId);
      
//       // Update the local state to remove the customer
//       setCustomers(prevCustomers => 
//         prevCustomers.filter(customer => customer._id !== customerId)
//       );
      
//       // Show success message with customer name
//       alert(`Customer "${customerToRemove.name}" has been removed successfully`);
      
//     } catch (err) {
//       console.error('Error removing customer:', err);
//       alert(`Failed to remove customer "${customerToRemove.name}". Please try again.`);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   if (isLoading) {
//     return <div className={styles.loading}>Loading customers...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.customerContainer}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>Customer</h1>
        
//         <div className={styles.filterSection}>
//           <form onSubmit={handleSearch} className={styles.searchBox}>
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={styles.searchInput}
//             />
//             <button type="submit" className={styles.searchButton}>
//               <Search size={20} />
//             </button>
//           </form>

//           <button 
//             className={styles.mobileFilterButton}
//             onClick={() => setShowMobileFilters(!showMobileFilters)}
//           >
//             <SlidersHorizontal size={20} />
//           </button>
//         </div>
//       </div>

//       <div className={`${styles.filterTabs} ${showMobileFilters ? styles.showMobile : ''}`}>
//         <button 
//           className={`${styles.filterTab} ${filters.type === 'all' ? styles.activeFilterTab : ''}`}
//           onClick={() => setFilters({ type: 'all' })}
//         >
//           All
//         </button>
//         <button 
//           className={`${styles.filterTab} ${filters.type === 'withBookings' ? styles.activeFilterTab : ''}`}
//           onClick={() => setFilters({ type: 'withBookings' })}
//         >
//           With Bookings
//         </button>
//         <button 
//           className={`${styles.filterTab} ${filters.type === 'withoutBookings' ? styles.activeFilterTab : ''}`}
//           onClick={() => setFilters({ type: 'withoutBookings' })}
//         >
//           Without Bookings
//         </button>
//       </div>

//       <div className={styles.tableWrapper}>
//         <table className={styles.customerTable}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email Id</th>
//               <th>Contact</th>
//               <th>Bookings</th>
//               <th>Queries</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer) => (
//               <tr key={customer._id}>
//                 <td>{customer.name}</td>
//                 <td>{customer.email}</td>
//                 <td>{customer.phone}</td>
//                 <td>
//                   {customer.bookings.length > 0 ? (
//                     <a href="#" className={styles.viewLink}>
//                       {customer.bookings.length} ( view details )
//                     </a>
//                   ) : (
//                     '-'
//                   )}
//                 </td>
//                 <td>
//                   {customer.bookings.length > 0 ? (
//                     <a href="#" className={styles.viewLink}>
//                       ( view query )
//                     </a>
//                   ) : (
//                     '-'
//                   )}
//                 </td>
//                 <td>
//                   <button 
//                     className={styles.removeButton}
//                     onClick={() => handleRemoveCustomer(customer._id)}
//                     disabled={isDeleting}
//                   >
//                     {isDeleting ? 'Removing...' : 'Remove Customer'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Customer;