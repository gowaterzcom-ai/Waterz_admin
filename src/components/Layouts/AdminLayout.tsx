import React from "react";
import AdminNavbar from "../Navbar/AdminNav";
import Analytics from "../Analytics/Analytics";
import styles from "../../styles/Layouts/AdminLayout.module.css";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className={styles.adminLayout}>
            <AdminNavbar />
            <div className={styles.mainContent}>
                <Analytics />
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;