import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/Navbar/Navbar.module.css";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store/hook";
import { setUserDetails, clearUserDetails } from "../../redux/slices/userSlice";
import logo from "../../assets/Home/logo.png"
const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for token in localStorage when component mounts
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        dispatch(setUserDetails(parsedUserData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        dispatch(clearUserDetails());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the menu and hamburger button
      if (
        menuRef.current && 
        hamburgerRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    // Add click event listener to the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Toggle menu for mobile
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Define the nav items for reuse in desktop and mobile
  const navItems = (
    <>
      {/* <Link to="/" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>Home</div>
      </Link>
      <Link to="/discover" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>Discover</div>
      </Link>
      <Link to="/bookings" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>My Bookings</div>
      </Link>
      <Link to="/location" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>Location</div>
      </Link> */}
      {isAuthenticated ? (
        <div className={styles.account_section}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <div className={styles.item}>Dashboard</div>
          </Link>
        </div>
      ) : (
        <Link to="/login" onClick={() => setMenuOpen(false)}>
          <div className={styles.item}>Login</div>
        </Link>
      )}
    </>
  );

  return (
    <div className={styles.comp_body}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link to="/">
            {/* <div className={styles.logobox}> */}
                <img src={logo} width="100%" style={{paddingTop:"8px"}} />
            {/* </div> */}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktop_nav}>{navItems}</div>

        {/* Hamburger icon for mobile */}
        <div 
          ref={hamburgerRef}
          className={styles.hamburger} 
          onClick={toggleMenu}
        >
          <span>&#9776;</span>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div ref={menuRef} className={styles.mobile_menu}>
          {navItems}
        </div>
      )}
    </div>
  );
};


export default Navbar;

