import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- New import for navigation
import { adminAPI, AgentData } from "../../api/admin";
import styles from "../../styles/Agent/Agent.module.css";
import { Search, SlidersHorizontal } from "lucide-react";

interface ComponentFilters {
  type: "all" | "withBookings" | "withoutBookings";
}

const Agent: React.FC = () => {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComponentFilters>({ type: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate(); // <-- New hook

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getAgents({
        type: filters.type,
        searchQuery: searchQuery,
      });
      setAgents(response.agents || []);
    } catch (err) {
      setError("Failed to fetch agents");
      console.error("Error fetching agents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAgents();
  };

  // Updated view profile handler to pass the full agent data via state
  const handleViewProfile = (agent: AgentData) => {
    navigate(`/agent-profile/${agent._id}`, { state: { agent } });
  };

  // New function to handle booking navigation (same as before)
  const handleBookingNavigation = (agent: AgentData) => {
    navigate(
      `/booking?searchName=${encodeURIComponent(
        agent.email
      )}&displayName=${encodeURIComponent(agent.name)}`
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading agents...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.agentContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Agent</h1>

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
        className={`${styles.filterTabs} ${
          showMobileFilters ? styles.showMobile : ""
        }`}
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
        <table className={styles.agentTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Id</th>
              <th>Contact</th>
              <th>No. of Bookings</th>
              <th>Status</th>
              {/* <th>Super Agent</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id}>
                <td>{agent.name}</td>
                <td>{agent.email}</td>
                <td>{agent.phone}</td>
                <td>
                  {agent.bookings.length > 0 ? (
                    <a
                      href="#"
                      className={styles.viewLink}
                      onClick={(e) => {
                        e.preventDefault();
                        handleBookingNavigation(agent);
                      }}
                    >
                      {agent.bookings.length} ( view details )
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {agent.isVerifiedByAdmin === 'requested' ? (
                    
                    <span className={styles.requested}>Requested</span>
                  ) : agent.isVerifiedByAdmin === 'accepted' ? (
                    <span className={styles.accepted}>Accepted({agent.commissionRate}%) </span>
                  ) : (
                    <span className={styles.denied}>Denied</span>
                  )}
                </td>
                {/* <td>{agent.superagentName || "-"}</td> */}
                <td>
                  <button
                    className={styles.viewProfileButton}
                    onClick={() => handleViewProfile(agent)}
                  >
                    View Profile
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

export default Agent;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // <-- New import
// import { adminAPI, AgentData } from "../../api/admin";
// import styles from "../../styles/Agent/Agent.module.css";
// import { Search, SlidersHorizontal } from "lucide-react";

// interface ComponentFilters {
//   type: "all" | "withBookings" | "withoutBookings";
// }

// const Agent: React.FC = () => {
//   const [agents, setAgents] = useState<AgentData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filters, setFilters] = useState<ComponentFilters>({ type: "all" });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   const navigate = useNavigate(); // <-- New hook

//   const fetchAgents = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await adminAPI.getAgents({
//         type: filters.type,
//         searchQuery: searchQuery,
//       });
//       setAgents(response.agents || []);
//     } catch (err) {
//       setError("Failed to fetch agents");
//       console.error("Error fetching agents:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAgents();
//   }, [filters]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchAgents();
//   };

//   const handleViewProfile = (agentId: string) => {
//     // Implement view profile logic
//     console.log("Viewing profile:", agentId);
//   };

//   // New function to handle booking navigation
//   const handleBookingNavigation = (agent: AgentData) => {
//     navigate(
//       `/booking?searchName=${encodeURIComponent(
//         agent.email
//       )}&displayName=${encodeURIComponent(agent.name)}`
//     );
//   };

//   if (isLoading) {
//     return <div className={styles.loading}>Loading agents...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.agentContainer}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>Agent</h1>

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

//       <div
//         className={`${styles.filterTabs} ${
//           showMobileFilters ? styles.showMobile : ""
//         }`}
//       >
//         <button
//           className={`${styles.filterTab} ${
//             filters.type === "all" ? styles.activeFilterTab : ""
//           }`}
//           onClick={() => setFilters({ type: "all" })}
//         >
//           All
//         </button>
//         <button
//           className={`${styles.filterTab} ${
//             filters.type === "withBookings" ? styles.activeFilterTab : ""
//           }`}
//           onClick={() => setFilters({ type: "withBookings" })}
//         >
//           With Bookings
//         </button>
//         <button
//           className={`${styles.filterTab} ${
//             filters.type === "withoutBookings" ? styles.activeFilterTab : ""
//           }`}
//           onClick={() => setFilters({ type: "withoutBookings" })}
//         >
//           Without Bookings
//         </button>
//       </div>

//       <div className={styles.tableWrapper}>
//         <table className={styles.agentTable}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email Id</th>
//               <th>Contact</th>
//               <th>No. of Bookings</th>
//               <th>Super Agent</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agents.map((agent) => (
//               <tr key={agent._id}>
//                 <td>{agent.name}</td>
//                 <td>{agent.email}</td>
//                 <td>{agent.phone}</td>
//                 <td>
//                   {agent.bookings.length > 0 ? (
//                     <a
//                       href="#"
//                       className={styles.viewLink}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleBookingNavigation(agent);
//                       }}
//                     >
//                       {agent.bookings.length} ( view details )
//                     </a>
//                   ) : (
//                     "-"
//                   )}
//                 </td>
//                 <td>{agent.superagentName || "-"}</td>
//                 <td>
//                   <button
//                     className={styles.viewProfileButton}
//                     onClick={() => handleViewProfile(agent._id)}
//                   >
//                     View Profile
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

// export default Agent;
