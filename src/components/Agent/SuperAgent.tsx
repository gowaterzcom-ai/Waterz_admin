import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, SuperAgentData } from "../../api/admin";
import styles from "../../styles/Agent/SuperAgent.module.css";
import { Search } from "lucide-react";

const SuperAgent: React.FC = () => {
  const [superAgents, setSuperAgents] = useState<SuperAgentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchSuperAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getSuperAgents({
        searchQuery: searchQuery
      });
      setSuperAgents(response.superAgents || []);
    } catch (err) {
      setError('Failed to fetch super agents');
      console.error('Error fetching super agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAgents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuperAgents();
  };

  const handleViewProfile = (superAgent: SuperAgentData) => {
    navigate(`/super-agent-profile/${superAgent._id}`, { state: { superAgentData: superAgent } });
  };

  // const handleAgentNavigation = (superAgent: SuperAgentData) => {
  //   navigate(`/agents?searchName=${encodeURIComponent(superAgent.email)}`);
  // };

  if (isLoading) {
    return <div className={styles.loading}>Loading super agents...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.superAgentContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Super Agent</h1>
        
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
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.superAgentTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Id</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {superAgents.map((superAgent) => (
              <tr key={superAgent._id}>
                <td>{superAgent.name}</td>
                <td>{superAgent.email}</td>
                <td>{superAgent.phone}</td>
                <td>
                  {superAgent.isVerifiedByAdmin === 'requested' ? (
                    
                    <span className={styles.requested}>Requested</span>
                  ) : superAgent.isVerifiedByAdmin === 'accepted' ? (
                    <span className={styles.accepted}>Accepted({superAgent.commissionRate}%)</span>
                  ) : (
                    <span className={styles.denied}>Denied</span>
                  )}
                </td>
                <td>
                  <button 
                    className={styles.viewProfileButton}
                    onClick={() => handleViewProfile(superAgent)}
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

export default SuperAgent;



// import React, { useEffect, useState } from "react";
// import { adminAPI, SuperAgentData } from "../../api/admin";
// import styles from "../../styles/Agent/SuperAgent.module.css";
// import { Search } from "lucide-react";

// const SuperAgent: React.FC = () => {
//   const [superAgents, setSuperAgents] = useState<SuperAgentData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchSuperAgents = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await adminAPI.getSuperAgents({
//         searchQuery: searchQuery
//       });
//       setSuperAgents(response.superAgents || []);
//     } catch (err) {
//       setError('Failed to fetch super agents');
//       console.error('Error fetching super agents:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSuperAgents();
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchSuperAgents();
//   };

//   const handleViewProfile = (superAgentId: string) => {
//     // Implement view profile logic
//     console.log('Viewing profile:', superAgentId);
//   };

//   if (isLoading) {
//     return <div className={styles.loading}>Loading super agents...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.superAgentContainer}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>Super Agent</h1>
        
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
//         </div>
//       </div>

//       <div className={styles.tableWrapper}>
//         <table className={styles.superAgentTable}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email Id</th>
//               <th>Contact</th>
//               <th>Agents Count</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {superAgents.map((superAgent) => (
//               <tr key={superAgent._id}>
//                 <td>{superAgent.name}</td>
//                 <td>{superAgent.email}</td>
//                 <td>{superAgent.phone}</td>
//                 <td>
//                   {superAgent.agents.length > 0 ? (
//                     <a href="#" className={styles.viewLink}>
//                       {superAgent.agents.length} ( view details )
//                     </a>
//                   ) : (
//                     '-'
//                   )}
//                 </td>
//                 <td>
//                   <button 
//                     className={styles.viewProfileButton}
//                     onClick={() => handleViewProfile(superAgent._id)}
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

// export default SuperAgent;