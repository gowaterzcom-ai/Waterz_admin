import React from "react";
import Navbar from "../Navbar/Navbar";
import styles from "../../styles/Layouts/MainLayout.module.css"

type MainLayoutProps = {
    children: React.ReactNode; 
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return(
        <div className={styles.comp_body}>
            <Navbar/>
            {children}
        </div>
    )
}

export default MainLayout;