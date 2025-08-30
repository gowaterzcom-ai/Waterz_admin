import React, { useEffect, useState } from "react";
import styles from "../../styles/Agent/SuperAgentDetails.module.css";
import { useLocation,  useParams } from "react-router-dom";
import superAgentPlaceholder from "../../assets/Yatch/agentt.jpg";
import { SuperAgentData } from "../../types/superAgent";
import { adminAPI } from "../../api/admin";

export interface superAgentPayments{
  payStatus: boolean;
  bookingId: string;
  bookingDate: string;
  commissionAmount: number;
}

const SuperAgentDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();
  const [superAgentData, setSuperAgentData] = useState<SuperAgentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCommissionPanel, setShowCommissionPanel] = useState(false);
  const [commissionInput, setCommissionInput] = useState<string>("");
  const [superAgentPayments, setSuperAgentPayments] = useState<superAgentPayments[]>([]);
  const [paymentUpdateLoading, setPaymentUpdateLoading] = useState<string | null>(null);

  const isPrev = location.state ? location.state.isPrev : false;

  const superAgent = location.state ? location.state.superAgent : null;
  console.log("superAgnt", superAgent)

  useEffect(() => {
    const fetchSuperAgentDetails = async () => {
      if (location.state?.superAgent) {
        setSuperAgentData(location.state.superAgent);
        setCommissionInput(location.state.superAgent.commissionRate.toString());
        return;
      }

      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        // Assume getSuperAgentById exists similar to getAgentById
        const response = await adminAPI.getSuperAgentById(id);
        console.log("superAgent", response.superAgent)
        if (response.superAgent) {
          setSuperAgentData(response.superAgent);
          setCommissionInput(response.superAgent.commissionRate.toString());
        }
      } catch (err) {
        console.error("Error fetching super agent details:", err);
        setError("Failed to load super agent details");
      } finally {
        setLoading(false);
      }
    };

    fetchSuperAgentDetails();
  }, [id, location.state]);

  useEffect(() => {
    const getSuperAgentPayment = async () => {
      try{
        const superAgentId = superAgent?._id || id;
        setLoading(true);
        setError(null);
        const response = await adminAPI.getSuperAgentPayments(superAgentId);
        setSuperAgentPayments(response.superAgentPayments || [])
        console.log(response);
      }
      catch(err){
        console.error("Error fetching super agent payment details:", err);
        setError("Failed to load super agent payment details");
      } finally {
        setLoading(false);
      }
    }
    getSuperAgentPayment();
  }, [id, superAgent]);

  const updateSuperAgentPayStatus = async (bookingId: string) => {
    try{
      setPaymentUpdateLoading(bookingId);
      const response = await adminAPI.superAgentPayStatus(bookingId);
      console.log(response);
      
      // Update the local state to reflect the change
      // Access the status from the nested statusUpdate object
      if (response.statusUpdate && typeof response.statusUpdate.status === 'boolean') {
        setSuperAgentPayments(prevPayments => 
          prevPayments.map(payment => 
            payment.bookingId === bookingId 
              ? { ...payment, payStatus: response.statusUpdate.status }
              : payment
          )
        );
      }
    }
    catch(err){
      console.error("Error updating super agent payment status:", err);
      setError("Failed to update super agent payment status");
    } finally {
      setPaymentUpdateLoading(null);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Approve super agent with commission (requested status)
  const handleApproveSuperAgent = async () => {
    if (!superAgentData) return;
    const commission = parseFloat(commissionInput);
    if (isNaN(commission) || commission <= 0) {
      alert("Please enter a valid commission percentage.");
      return;
    }

    try {
      setCommissionLoading(true);
      await adminAPI.approveSuperAgent({
        id: superAgentData._id,
        approved: "accepted",
        commision: commission,
      });
      setSuperAgentData({ ...superAgentData, commissionRate: commission, isVerifiedByAdmin: "accepted" } as any);
      setShowCommissionPanel(false);
      alert("Super Agent approved successfully.");
    } catch (err) {
      console.error("Error approving super agent:", err);
      alert("Failed to approve super agent. Please try again.");
    } finally {
      setCommissionLoading(false);
    }
  };

  // Reject super agent (requested status)
  const handleRejectSuperAgent = async () => {
    if (!superAgentData) return;
    if (!window.confirm("Are you sure you want to reject this super agent?")) {
      return;
    }
    try {
      setCommissionLoading(true);
      await adminAPI.approveSuperAgent({
        id: superAgentData._id,
        approved: "denied",
        commision: 0,
      });
      setSuperAgentData({ ...superAgentData, isVerifiedByAdmin: "denied" } as any);
      setShowCommissionPanel(false);
      alert("Super Agent rejected successfully.");
    } catch (err) {
      console.error("Error rejecting super agent:", err);
      alert("Failed to reject super agent. Please try again.");
    } finally {
      setCommissionLoading(false);
    }
  };

  // Update commission for an already approved super agent
  const handleUpdateCommission = async () => {
    if (!superAgentData) return;
    const commission = parseFloat(commissionInput);
    if (isNaN(commission) || commission <= 0) {
      alert("Please enter a valid commission percentage.");
      return;
    }
    try {
      setCommissionLoading(true);
      await adminAPI.updateSuperAgentCommison({
        id: superAgentData._id,
        approved: "accepted",
        commision: commission,
      });
      setSuperAgentData({ ...superAgentData, commissionRate: commission });
      setShowCommissionPanel(false);
      alert("Commission updated successfully.");
    } catch (err) {
      console.error("Error updating commission:", err);
      alert("Failed to update commission. Please try again.");
    } finally {
      setCommissionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.comp_body}>
        <div className={styles.loadingContainer}>Loading super agent details...</div>
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

  if (!superAgentData) {
    return (
      <div className={styles.comp_body}>
        <div className={styles.errorContainer}>Super Agent not found</div>
      </div>
    );
  }

  const renderCommissionActions = () => {
    if (superAgentData.isVerifiedByAdmin === "denied") return null;

    if (superAgentData.isVerifiedByAdmin === "requested") {
      return (
        <div className={styles.commissionSection}>
          {!showCommissionPanel ? (
            <button
              className={styles.commissionButton}
              onClick={() => setShowCommissionPanel(true)}
            >
              Set Commission
            </button>
          ) : (
            <div className={styles.commissionPanel}>
              <label>
                Commission Percentage (%):
                <input
                  type="number"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(e.target.value)}
                  placeholder="Enter commission %"
                />
              </label>
              <div className={styles.commissionActions}>
                <button
                  className={styles.approveButton}
                  onClick={handleApproveSuperAgent}
                  disabled={commissionLoading}
                >
                  {commissionLoading ? "Approving..." : "Approve"}
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={handleRejectSuperAgent}
                  disabled={commissionLoading}
                >
                  Reject
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowCommissionPanel(false)}
                  disabled={commissionLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (superAgentData.isVerifiedByAdmin === "accepted") {
      return (
        <div className={styles.commissionSection}>
          {!showCommissionPanel ? (
            <button
              className={styles.commissionButton}
              onClick={() => setShowCommissionPanel(true)}
            >
              Edit Commission
            </button>
          ) : (
            <div className={styles.commissionPanel}>
              <label>
                Commission Percentage (%):
                <input
                  type="number"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(e.target.value)}
                  placeholder="Enter commission %"
                />
              </label>
              <div className={styles.commissionActions}>
                <button
                  className={styles.updateButton}
                  onClick={handleUpdateCommission}
                  disabled={commissionLoading}
                >
                  {commissionLoading ? "Updating..." : "Update Commission"}
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowCommissionPanel(false)}
                  disabled={commissionLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.comp_body}>
      <div className={styles.agentBox}>
        <div className={styles.section_head2}>Super Agent Profile</div>
        <div className={styles.section_head}>{superAgentData.name}</div>
      </div>
      <div className={styles.profile_container}>
        <div className={styles.image_box}>
          <img
            src={superAgentData.imgUrl.length ? superAgentData.imgUrl : superAgentPlaceholder}
            alt={superAgentData.name}
            className={styles.profile_image}
          />
        </div>
        <div className={styles.quick_info}>
          <div className={styles.info_item}>
            <span className={styles.label}>Commission Rate</span>
            <span className={styles.value}>{superAgentData.commissionRate}%</span>
          </div>
        </div>
      </div>

      <div className={styles.action_buttons}>
        {!isPrev && (
          <>
            {renderCommissionActions()}
          </>
        )}
      </div>

      <div className={styles.details_section}>
        <h3>Personal Information</h3>
        <div className={styles.info_grid}>
          <div className={styles.info_row}>
            <span className={styles.info_label}>Name:</span>
            <span className={styles.info_value}>{superAgentData.name}</span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.info_label}>Email:</span>
            <span className={styles.info_value}>{superAgentData.email}</span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.info_label}>Phone:</span>
            <span className={styles.info_value}>{superAgentData.phone}</span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.info_label}>Commission Rate:</span>
            <span className={styles.info_value}>{superAgentData.commissionRate}%</span>
          </div>
        </div>
      </div>

      <div className={styles.details_section}>
        <h3>Bank Details</h3>
        <div className={styles.info_grid}>
          <div className={styles.info_row}>
            <span className={styles.info_label}>Account Holder:</span>
            <span className={styles.info_value}>{superAgentData.accountHolderName}</span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.info_label}>Account Number:</span>
            <span className={styles.info_value}>{superAgentData.accountNumber}</span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.info_label}>Bank Name:</span>
            <span className={styles.info_value}>{superAgentData.bankName}</span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.info_label}>IFSC Code:</span>
            <span className={styles.info_value}>{superAgentData.ifscCode}</span>
          </div>
        </div>
      </div>

      <div className={styles.details_section}>
        <h3>Payments</h3>
        {superAgentPayments.length > 0 ? (
          <div className={styles.payments_table_container}>
            <div className={styles.payments_table}>
              <div className={styles.table_header}>
                <div className={styles.table_cell}>Booking ID</div>
                <div className={styles.table_cell}>Date</div>
                <div className={styles.table_cell}>Commission</div>
                <div className={styles.table_cell}>Status</div>
              </div>
              {superAgentPayments.map((payment) => (
                <div key={payment.bookingId} className={styles.table_row}>
                  <div className={styles.table_cell} data-label="Booking ID">
                    {payment.bookingId}
                  </div>
                  <div className={styles.table_cell} data-label="Date">
                    {formatDate(payment.bookingDate)}
                  </div>
                  <div className={styles.table_cell} data-label="Commission">
                    ₹{payment.commissionAmount.toLocaleString()}
                  </div>
                  <div className={styles.table_cell} data-label="Status">
                    <div className={styles.status_container}>
                      <label className={styles.toggle_switch}>
                        <input
                          type="checkbox"
                          checked={payment.payStatus}
                          onChange={() => updateSuperAgentPayStatus(payment.bookingId)}
                          disabled={paymentUpdateLoading === payment.bookingId}
                        />
                        <span className={styles.slider}></span>
                      </label>
                      <span className={`${styles.status_text} ${payment.payStatus ? styles.paid : styles.unpaid}`}>
                        {paymentUpdateLoading === payment.bookingId ? 'Updating...' : payment.payStatus ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.no_payments}>
            <p>No payment records found for this super agent.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAgentDetails;

// import React, { useEffect, useState } from "react";
// import styles from "../../styles/Agent/SuperAgentDetails.module.css";
// import { useLocation,  useParams } from "react-router-dom";
// import superAgentPlaceholder from "../../assets/Yatch/agent.svg";
// import { SuperAgentData } from "../../types/superAgent";
// import { adminAPI } from "../../api/admin";

// const SuperAgentDetails: React.FC = () => {
//   const location = useLocation();
//   const { id } = useParams();
//   const [superAgentData, setSuperAgentData] = useState<SuperAgentData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [commissionLoading, setCommissionLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showCommissionPanel, setShowCommissionPanel] = useState(false);
//   const [commissionInput, setCommissionInput] = useState<string>("");

//   const isPrev = location.state ? location.state.isPrev : false;

//   const superAgent = location.state ? location.state.superAgent : null;
//   console.log("superAgnt", superAgent)

//   useEffect(() => {
//     const fetchSuperAgentDetails = async () => {
//       if (location.state?.superAgent) {
//         setSuperAgentData(location.state.superAgent);
//         setCommissionInput(location.state.superAgent.commissionRate.toString());
//         return;
//       }

//       if (!id) return;

//       try {
//         setLoading(true);
//         setError(null);
//         // Assume getSuperAgentById exists similar to getAgentById
//         const response = await adminAPI.getSuperAgentById(id);
//         console.log("superAgent", response.superAgent)
//         if (response.superAgent) {
//           setSuperAgentData(response.superAgent);
//           setCommissionInput(response.superAgent.commissionRate.toString());
//         }
//       } catch (err) {
//         console.error("Error fetching super agent details:", err);
//         setError("Failed to load super agent details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSuperAgentDetails();
//   }, [id, location.state]);



//   // Approve super agent with commission (requested status)
//   const handleApproveSuperAgent = async () => {
//     if (!superAgentData) return;
//     const commission = parseFloat(commissionInput);
//     if (isNaN(commission) || commission <= 0) {
//       alert("Please enter a valid commission percentage.");
//       return;
//     }

//     try {
//       setCommissionLoading(true);
//       await adminAPI.approveSuperAgent({
//         id: superAgentData._id,
//         approved: "accepted",
//         commision: commission,
//       });
//       setSuperAgentData({ ...superAgentData, commissionRate: commission, isVerifiedByAdmin: "accepted" } as any);
//       setShowCommissionPanel(false);
//       alert("Super Agent approved successfully.");
//     } catch (err) {
//       console.error("Error approving super agent:", err);
//       alert("Failed to approve super agent. Please try again.");
//     } finally {
//       setCommissionLoading(false);
//     }
//   };

//   // Reject super agent (requested status)
//   const handleRejectSuperAgent = async () => {
//     if (!superAgentData) return;
//     if (!window.confirm("Are you sure you want to reject this super agent?")) {
//       return;
//     }
//     try {
//       setCommissionLoading(true);
//       await adminAPI.approveSuperAgent({
//         id: superAgentData._id,
//         approved: "denied",
//         commision: 0,
//       });
//       setSuperAgentData({ ...superAgentData, isVerifiedByAdmin: "denied" } as any);
//       setShowCommissionPanel(false);
//       alert("Super Agent rejected successfully.");
//     } catch (err) {
//       console.error("Error rejecting super agent:", err);
//       alert("Failed to reject super agent. Please try again.");
//     } finally {
//       setCommissionLoading(false);
//     }
//   };

//   // Update commission for an already approved super agent
//   const handleUpdateCommission = async () => {
//     if (!superAgentData) return;
//     const commission = parseFloat(commissionInput);
//     if (isNaN(commission) || commission <= 0) {
//       alert("Please enter a valid commission percentage.");
//       return;
//     }
//     try {
//       setCommissionLoading(true);
//       await adminAPI.updateSuperAgentCommison({
//         id: superAgentData._id,
//         approved: "accepted",
//         commision: commission,
//       });
//       setSuperAgentData({ ...superAgentData, commissionRate: commission });
//       setShowCommissionPanel(false);
//       alert("Commission updated successfully.");
//     } catch (err) {
//       console.error("Error updating commission:", err);
//       alert("Failed to update commission. Please try again.");
//     } finally {
//       setCommissionLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className={styles.comp_body}>
//         <div className={styles.loadingContainer}>Loading super agent details...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.comp_body}>
//         <div className={styles.errorContainer}>{error}</div>
//       </div>
//     );
//   }

//   if (!superAgentData) {
//     return (
//       <div className={styles.comp_body}>
//         <div className={styles.errorContainer}>Super Agent not found</div>
//       </div>
//     );
//   }

//   const renderCommissionActions = () => {
//     if (superAgentData.isVerifiedByAdmin === "denied") return null;

//     if (superAgentData.isVerifiedByAdmin === "requested") {
//       return (
//         <div className={styles.commissionSection}>
//           {!showCommissionPanel ? (
//             <button
//               className={styles.commissionButton}
//               onClick={() => setShowCommissionPanel(true)}
//             >
//               Set Commission
//             </button>
//           ) : (
//             <div className={styles.commissionPanel}>
//               <label>
//                 Commission Percentage (%):
//                 <input
//                   type="number"
//                   value={commissionInput}
//                   onChange={(e) => setCommissionInput(e.target.value)}
//                   placeholder="Enter commission %"
//                 />
//               </label>
//               <div className={styles.commissionActions}>
//                 <button
//                   className={styles.approveButton}
//                   onClick={handleApproveSuperAgent}
//                   disabled={commissionLoading}
//                 >
//                   {commissionLoading ? "Approving..." : "Approve"}
//                 </button>
//                 <button
//                   className={styles.rejectButton}
//                   onClick={handleRejectSuperAgent}
//                   disabled={commissionLoading}
//                 >
//                   {commissionLoading ? "Rejecting..." : "Reject"}
//                 </button>
//                 <button
//                   className={styles.cancelButton}
//                   onClick={() => setShowCommissionPanel(false)}
//                   disabled={commissionLoading}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     }

//     if (superAgentData.isVerifiedByAdmin === "accepted") {
//       return (
//         <div className={styles.commissionSection}>
//           {!showCommissionPanel ? (
//             <button
//               className={styles.commissionButton}
//               onClick={() => setShowCommissionPanel(true)}
//             >
//               Edit Commission
//             </button>
//           ) : (
//             <div className={styles.commissionPanel}>
//               <label>
//                 Commission Percentage (%):
//                 <input
//                   type="number"
//                   value={commissionInput}
//                   onChange={(e) => setCommissionInput(e.target.value)}
//                   placeholder="Enter commission %"
//                 />
//               </label>
//               <div className={styles.commissionActions}>
//                 <button
//                   className={styles.updateButton}
//                   onClick={handleUpdateCommission}
//                   disabled={commissionLoading}
//                 >
//                   {commissionLoading ? "Updating..." : "Update Commission"}
//                 </button>
//                 <button
//                   className={styles.cancelButton}
//                   onClick={() => setShowCommissionPanel(false)}
//                   disabled={commissionLoading}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className={styles.comp_body}>
//       <div className={styles.agentBox}>
//         <div className={styles.section_head2}>Super Agent Profile</div>
//         <div className={styles.section_head}>{superAgentData.name}</div>
//       </div>
//       <div className={styles.profile_container}>
//         <div className={styles.image_box}>
//           <img
//             src={superAgentData.imgUrl || superAgentPlaceholder}
//             alt={superAgentData.name}
//             className={styles.profile_image}
//           />
//         </div>
//         <div className={styles.quick_info}>
//           {/* <div className={styles.info_item}>
//             <span className={styles.label}>Name</span>
//             <span className={styles.value}>{superAgentData.name}</span>
//           </div>
//           <div className={styles.info_item}>
//             <span className={styles.label}>Email</span>
//             <span className={styles.value}>{superAgentData.email}</span>
//           </div>
//           <div className={styles.info_item}>
//             <span className={styles.label}>Phone</span>
//             <span className={styles.value}>{superAgentData.phone}</span>
//           </div> */}
//           <div className={styles.info_item}>
//             <span className={styles.label}>Commisio Rate</span>
//             <span className={styles.value}>{superAgentData.commissionRate}%</span>
//           </div>
//         </div>
//       </div>

//       <div className={styles.action_buttons}>
//         {!isPrev && (
//           <>
//             {renderCommissionActions()}
//           </>
//         )}
//       </div>

//       <div className={styles.details_section}>
//         <h3>Personal Information</h3>
//         <div className={styles.info_grid}>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>Name:</span>
//             <span className={styles.info_value}>{superAgentData.name}</span>
//           </div>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>Email:</span>
//             <span className={styles.info_value}>{superAgentData.email}</span>
//           </div>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>Phone:</span>
//             <span className={styles.info_value}>{superAgentData.phone}</span>
//           </div>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>Commision Rate:</span>
//             <span className={styles.info_value}>{superAgentData.commissionRate}</span>
//           </div>
//         </div>
//       </div>

//       <div className={styles.details_section}>
//         <h3>Bank Details</h3>
//         <div className={styles.info_grid}>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>Account Holder:</span>
//             <span className={styles.info_value}>{superAgentData.accountHolderName}</span>
//           </div>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>Account Number:</span>
//             <span className={styles.info_value}>{superAgentData.accountNumber}</span>
//           </div>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>Bank Name:</span>
//             <span className={styles.info_value}>{superAgentData.bankName}</span>
//           </div>
//           <div className={styles.info_row}>
//             <span className={styles.info_label}>IFSC Code:</span>
//             <span className={styles.info_value}>{superAgentData.ifscCode}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAgentDetails;
