// import React, { useEffect, useState } from "react";
// import { adminAPI, PromoCode, PromoCodeResponse } from "../../api/admin";
// import styles from "../../styles/PromoCode/PromoCode.module.css";
// import { toast } from "react-toastify";

// interface Agent {
//   _id: string;
//   name: string;
// }

// interface Customer {
//   _id: string;
//   name: string;
// }

// const PromoCodePage: React.FC = () => {
//   const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);

//   const [formData, setFormData] = useState({
//     _id: "",
//     code: "",
//     description: "",
//     validFor: "all", // options: all, agent, customer
//     discountType: "PERCENTAGE", // options: PERCENTAGE, FIXED
//     discountValue: "",
//     maxUsagePerUser: "1",
//     totalUsageLimit: "",
//     expiryDate: "",
//     targetedUserIds: [] as string[],
//   });

//   // Fetch existing promo codes
//   const fetchPromoCodes = async () => {
//     try {
//       setIsLoading(true);
//       const data: PromoCodeResponse = await adminAPI.getAllPromoCodes();
//       setPromoCodes(data.promoCodes);
//     } catch (error) {
//       toast.error("Failed to fetch promo codes");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch agents list when needed
//   const fetchAgents = async () => {
//     try {
//       const res = await adminAPI.getAllAgents();
//       // Assuming the response contains a field `agents`
//       setAgents(res.agents);
//     } catch (error) {
//       toast.error("Failed to fetch agents");
//     }
//   };

//   // Fetch customers list when needed
//   const fetchCustomers = async () => {
//     try {
//       const res = await adminAPI.getAllCustomers();
//       // Assuming the response contains a field `customers`
//       setCustomers(res.customers);
//     } catch (error) {
//       toast.error("Failed to fetch customers");
//     }
//   };

//   useEffect(() => {
//     fetchPromoCodes();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // When validFor changes, fetch the appropriate list and reset targeted users
//     if (name === "validFor") {
//       if (value === "agent") {
//         fetchAgents();
//         setFormData((prev) => ({ ...prev, targetedUserIds: [] }));
//       } else if (value === "customer") {
//         fetchCustomers();
//         setFormData((prev) => ({ ...prev, targetedUserIds: [] }));
//       } else {
//         setFormData((prev) => ({ ...prev, targetedUserIds: [] }));
//       }
//     }
//   };

//   // Handle multi-select for targeted users including an "All" option
//   const handleTargetedUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const options = e.target.options;
//     let selected: string[] = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     // If "all" is selected, keep it as ["all"]
//     if (selected.includes("all")) {
//       selected = ["all"];
//     }
//     setFormData((prev) => ({ ...prev, targetedUserIds: selected }));
//   };

//   // Submit the new promo code form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Validate promo code format
//     const promoCodeRegex = /^[A-Z0-9]{6,12}$/;
//     if (!promoCodeRegex.test(formData.code)) {
//       toast.error(
//         "Invalid promo code format. Must be 6-12 characters long, only uppercase letters (A-Z) and numbers (0-9) allowed."
//       );
//       return;
//     }
//     // Validate discount value if percentage
//     if (formData.discountType === "PERCENTAGE") {
//       const discount = Number(formData.discountValue);
//       if (discount < 0 || discount > 100) {
//         toast.error("Percentage discount must be between 0 and 100");
//         return;
//       }
//     }
    
//     // Build targetedUsers payload
//     let targetedUsers;
//     if (formData.validFor === "all") {
//       targetedUsers = { userIds: [] as string[], userType: "all", userModel: "" };
//     } else if (formData.validFor === "agent") {
//       targetedUsers = {
//         userIds:
//           formData.targetedUserIds.length === 1 && formData.targetedUserIds[0] === "all"
//             ? "allAgent"
//             : formData.targetedUserIds,
//         userType: "agent",
//         userModel: "User",
//       };
//     } else if (formData.validFor === "customer") {
//       targetedUsers = {
//         userIds:
//           formData.targetedUserIds.length === 1 && formData.targetedUserIds[0] === "all"
//             ? "allCustomer"
//             : formData.targetedUserIds,
//         userType: "customer",
//         userModel: "Agent",
//       };
//     } else {
//       targetedUsers = null;
//     }

//     // Build the payload
//     const payload = {
//       code: formData.code,
//       description: formData.description,
//       validFor: formData.validFor,
//       discountType: formData.discountType,
//       discountValue: Number(formData.discountValue),
//       maxUsagePerUser: Number(formData.maxUsagePerUser),
//       totalUsageLimit: Number(formData.totalUsageLimit),
//       totalUsageCount: 0,
//       maxDiscountAmount:
//         formData.discountType === "FIXED"
//           ? Number(formData.discountValue)
//           : undefined,
//       startDate: new Date().toISOString(),
//       expiryDate: new Date(formData.expiryDate).toISOString(),
//       isActive: true,
//       userUsage: [],
//       targetedUsers,
//     };

//     try {
//       // @ts-ignore
//       await adminAPI.createPromoCode(payload);
//       toast.success("Promo code created successfully");
//       setShowForm(false);
//       fetchPromoCodes();
//     } catch (error) {
//       toast.error("Failed to create promo code");
//     }
//   };

//   // Deactivate an active promo code by sending a payload with isActive false
//   const handleDeactivate = async (promo: PromoCode) => {
//     try {
//       await adminAPI.deactivateCode(promo._id!);
//       toast.success("Promo code deactivated");
//       fetchPromoCodes();
//     } catch (error) {
//       toast.error("Failed to deactivate promo code");
//     }
//   };

//   return (
//     <div className={styles.promoContainer}>
//       <h1 className={styles.title}>Promo Codes</h1>
//       <button className={styles.newCodeButton} onClick={() => setShowForm(!showForm)}>
//         {showForm ? "Close Form" : "Generate New Code"}
//       </button>

//       {showForm && (
//         <form className={styles.promoForm} onSubmit={handleSubmit}>
//           <div className={styles.formGroup}>
//             <label>Code</label>
//             <input
//               type="text"
//               name="code"
//               value={formData.code}
//               onChange={handleInputChange}
//               required
//             />
//             <small className={styles.helperText}>
//               Must be 6-12 characters long. Can only contain uppercase letters (A-Z) and numbers (0-9). No special characters or spaces allowed.
//             </small>
//           </div>
//           <div className={styles.formGroup}>
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Valid For</label>
//             <select name="validFor" value={formData.validFor} onChange={handleInputChange}>
//               <option value="all">All</option>
//               <option value="agent">Agent</option>
//               <option value="customer">Customer</option>
//             </select>
//           </div>
//           {formData.validFor !== "all" && (
//             <div className={styles.formGroup}>
//               <label>
//                 Select {formData.validFor === "agent" ? "Agents" : "Customers"} (hold Cmd key on Mac to select multiple)
//               </label>
//               <select
//                 multiple
//                 onChange={handleTargetedUserChange}
//                 value={formData.targetedUserIds}
//               >
//                 <option value="all">
//                   All {formData.validFor === "agent" ? "Agents" : "Customers"}
//                 </option>
//                 {formData.validFor === "agent" &&
//                   agents.map((agent) => (
//                     <option key={agent._id} value={agent._id}>
//                       {agent.name}
//                     </option>
//                   ))}
//                 {formData.validFor === "customer" &&
//                   customers.map((customer) => (
//                     <option key={customer._id} value={customer._id}>
//                       {customer.name}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           )}
//           <div className={styles.formGroup}>
//             <label>Discount Type</label>
//             <select
//               name="discountType"
//               value={formData.discountType}
//               onChange={handleInputChange}
//             >
//               <option value="PERCENTAGE">PERCENTAGE</option>
//               <option value="FIXED">FIXED</option>
//             </select>
//           </div>
//           <div className={styles.formGroup}>
//             <label>
//               Discount Value {formData.discountType === "PERCENTAGE" && "(0-100)"}
//             </label>
//             <input
//               type="number"
//               name="discountValue"
//               value={formData.discountValue}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Max Usage Per User</label>
//             <input
//               type="number"
//               name="maxUsagePerUser"
//               value={formData.maxUsagePerUser}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Total Usage Limit</label>
//             <input
//               type="number"
//               name="totalUsageLimit"
//               value={formData.totalUsageLimit}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Expiry Date</label>
//             <input
//               type="datetime-local"
//               name="expiryDate"
//               value={formData.expiryDate}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <button type="submit" className={styles.submitButton}>
//             Create Promo Code
//           </button>
//         </form>
//       )}

//       {isLoading ? (
//         <div className={styles.loading}>Loading promo codes...</div>
//       ) : (
//         <div className={styles.promoList}>
//           {promoCodes.map((promo) => (
//             <div key={promo._id} className={styles.promoCard}>
//               <div className={styles.promoHeader}>
//                 <h3>{promo.code}</h3>
//                 <p>{promo.description}</p>
//               </div>
//               <div className={styles.promoDetails}>
//                 <p>
//                   <strong>Valid For:</strong> {promo.validFor}
//                 </p>
//                 <p>
//                   <strong>Discount:</strong> {promo.discountType} - {promo.discountValue}
//                 </p>
//                 <p>
//                   <strong>Usage:</strong> {promo.totalUsageCount}/{promo.totalUsageLimit}
//                 </p>
//                 <p>
//                   <strong>Expiry:</strong> {new Date(promo.expiryDate).toLocaleString()}
//                 </p>
//                 <p>
//                   <strong>Status:</strong> {promo.isActive ? "Active" : "Inactive"}
//                 </p>
//               </div>
//               {promo.isActive && (
//                 <button className={styles.deactivateButton} onClick={() => handleDeactivate(promo)}>
//                   Deactivate
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PromoCodePage;
// ```// filepath: /Users/arbajalam/Documents/Yacht/Waterz_admin/src/components/PromoCode/PromoCode.tsx
import React, { useEffect, useState } from "react";
import { adminAPI, PromoCode, PromoCodeResponse } from "../../api/admin";
import styles from "../../styles/PromoCode/PromoCode.module.css";
import { toast } from "react-toastify";

interface Agent {
  _id: string;
  name: string;
}

interface Customer {
  _id: string;
  name: string;
}

const PromoCodePage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [formData, setFormData] = useState({
    _id: "",
    code: "",
    description: "",
    validFor: "all", // options: all, agent, customer
    discountType: "PERCENTAGE", // options: PERCENTAGE, FIXED
    discountValue: "",
    maxUsagePerUser: "1",
    totalUsageLimit: "",
    expiryDate: "",
    targetedUserIds: [] as string[],
  });

  // Fetch existing promo codes
  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true);
      const data: PromoCodeResponse = await adminAPI.getAllPromoCodes();
      setPromoCodes(data.promoCodes);
    } catch (error) {
      toast.error("Failed to fetch promo codes");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch agents list when needed
  const fetchAgents = async () => {
    try {
      const res = await adminAPI.getAllAgents();
      // Assuming the response contains a field `agents`
      setAgents(res.agents);
    } catch (error) {
      toast.error("Failed to fetch agents");
    }
  };

  // Fetch customers list when needed
  const fetchCustomers = async () => {
    try {
      const res = await adminAPI.getAllCustomers();
      // Assuming the response contains a field `customers`
      setCustomers(res.customers);
    } catch (error) {
      toast.error("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // When validFor changes, fetch the appropriate list and reset targeted users
    if (name === "validFor") {
      if (value === "agent") {
        fetchAgents();
        setFormData((prev) => ({ ...prev, targetedUserIds: [] }));
      } else if (value === "customer") {
        fetchCustomers();
        setFormData((prev) => ({ ...prev, targetedUserIds: [] }));
      } else {
        setFormData((prev) => ({ ...prev, targetedUserIds: [] }));
      }
    }
  };

  // Handle multi-select for targeted users including an "All" option
  const handleTargetedUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    let selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    // If "all" is selected, keep it as ["all"]
    if (selected.includes("all")) {
      selected = ["all"];
    }
    setFormData((prev) => ({ ...prev, targetedUserIds: selected }));
  };

  // Submit the new promo code form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate promo code format
    const promoCodeRegex = /^[A-Z0-9]{6,12}$/;
    if (!promoCodeRegex.test(formData.code)) {
      toast.error(
        "Invalid promo code format. Must be 6-12 characters long, only uppercase letters (A-Z) and numbers (0-9) allowed."
      );
      return;
    }
    // Validate discount value if percentage
    if (formData.discountType === "PERCENTAGE") {
      const discount = Number(formData.discountValue);
      if (discount < 0 || discount > 100) {
        toast.error("Percentage discount must be between 0 and 100");
        return;
      }
    }
    
    // Build targetedUsers payload
    let targetedUsers;
    if (formData.validFor === "all") {
      targetedUsers = { userIds: [] as string[], userType: "all", userModel: "" };
    } else if (formData.validFor === "agent") {
      targetedUsers = {
        userIds: [],
        userType: "agent",
        userModel: "Agent",
      };
    } else if (formData.validFor === "customer") {
      targetedUsers = {
        userIds: [],
        userType: "customer",
        userModel: "User",
      };
    } else {
      targetedUsers = null;
    }

    // Build the payload
    const payload = {
      code: formData.code,
      description: formData.description,
      validFor: formData.validFor,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      maxUsagePerUser: Number(formData.maxUsagePerUser),
      totalUsageLimit: Number(formData.totalUsageLimit),
      totalUsageCount: 0,
      maxDiscountAmount:
        formData.discountType === "FIXED"
          ? Number(formData.discountValue)
          : undefined,
      startDate: new Date().toISOString(),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      isActive: true,
      userUsage: [],
      targetedUsers,
    };

    try {
      // @ts-ignore
      await adminAPI.createPromoCode(payload);
      toast.success("Promo code created successfully");
      setShowForm(false);
      fetchPromoCodes();
    } catch (error) {
      toast.error("Failed to create promo code");
    }
  };

  // Deactivate an active promo code by sending a payload with isActive false
  const handleDeactivate = async (promo: PromoCode) => {
    try {
      await adminAPI.deactivateCode(promo._id!);
      toast.success("Promo code deactivated");
      fetchPromoCodes();
    } catch (error) {
      toast.error("Failed to deactivate promo code");
    }
  };

  return (
    <div className={styles.promoContainer}>
      <h1 className={styles.title}>Promo Codes</h1>
      <button className={styles.newCodeButton} onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Generate New Code"}
      </button>

      {showForm && (
        <form className={styles.promoForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
            <small className={styles.helperText}>
              Must be 6-12 characters long. Can only contain uppercase letters (A-Z) and numbers (0-9). No special characters or spaces allowed.
            </small>
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Valid For</label>
            <select name="validFor" value={formData.validFor} onChange={handleInputChange}>
              <option value="all">All</option>
              <option value="agent">Agent</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          {formData.validFor !== "all" && (
            <div className={styles.formGroup}>
              <label>
                Select {formData.validFor === "agent" ? "Agents" : "Customers"} (hold Cmd key on Mac to select multiple)
              </label>
              <select
                multiple
                onChange={handleTargetedUserChange}
                value={formData.targetedUserIds}
              >
                <option value="all">
                  All {formData.validFor === "agent" ? "Agents" : "Customers"}
                </option>
                {formData.validFor === "agent" &&
                  agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                {formData.validFor === "customer" &&
                  customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Discount Type</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
            >
              <option value="PERCENTAGE">PERCENTAGE</option>
              <option value="FIXED">FIXED</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>
              Discount Value {formData.discountType === "PERCENTAGE" && "(0-100)"}
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Max Usage Per User</label>
            <input
              type="number"
              name="maxUsagePerUser"
              value={formData.maxUsagePerUser}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Total Usage Limit</label>
            <input
              type="number"
              name="totalUsageLimit"
              value={formData.totalUsageLimit}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Expiry Date</label>
            <input
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Create Promo Code
          </button>
        </form>
      )}

      {isLoading ? (
        <div className={styles.loading}>Loading promo codes...</div>
      ) : (
        <div className={styles.promoList}>
          {promoCodes.map((promo) => (
            <div key={promo._id} className={styles.promoCard}>
              <div className={styles.promoHeader}>
                <h3>{promo.code}</h3>
                <p>{promo.description}</p>
              </div>
              <div className={styles.promoDetails}>
                <p>
                  <strong>Valid For:</strong> {promo.validFor}
                </p>
                <p>
                  <strong>Discount:</strong> {promo.discountType} - {promo.discountValue}
                </p>
                <p>
                  <strong>Usage:</strong> {promo.totalUsageCount}/{promo.totalUsageLimit}
                </p>
                <p>
                  <strong>Expiry:</strong> {new Date(promo.expiryDate).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {promo.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              {promo.isActive && (
                <button className={styles.deactivateButton} onClick={() => handleDeactivate(promo)}>
                  Deactivate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoCodePage;