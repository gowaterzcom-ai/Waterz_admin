import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/Navbar/AdminNav.module.css';
import {  useAppDispatch } from '../../redux/store/hook';
import { clearUserDetails } from '../../redux/slices/userSlice';
import {
  Menu,
  X,
  LayoutDashboard,
  BadgePercent,
  LogOut,
  Ship,
  Calendar,
  Users,
  MessageCircleQuestion,
  UserCircle,
  DollarSign,
  PlusCircle,
  House
} from 'lucide-react';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Remove token and user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    dispatch(clearUserDetails());
    // Optionally, dispatch any logout actions if using Redux
    // Then navigate to login page
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: House },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/yachts', label: 'Yachts', icon: Ship },
    { path: '/booking', label: 'Booking', icon: Calendar },
    { path: '/customer', label: 'Customer', icon: Users },
    { path: '/agent', label: 'Agent', icon: UserCircle },
    { path: '/superagent', label: 'Superagent', icon: UserCircle },
    { path: '/earnings', label: 'Earnings', icon: DollarSign },
    { path: '/add', label: 'Add', icon: PlusCircle },
    { path: '/queries', label: 'Queries', icon: MessageCircleQuestion },
    { path: '/promo-codes', label: 'Promo Code', icon: BadgePercent },
    // Logout will be handled with a custom click function instead of a Link
    { path: '/logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <>
      <button 
        className={styles.menuButton} 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.navContent}>
          {navItems.map((item) => {
            const Icon = item.icon;
            // If the item is Logout, override onClick with handleLogout.
            if (item.label === "Logout") {
              return (
                <button
                  key={item.path}
                  className={styles.navItem2} 
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <Link
                to={item.path}
                key={item.path}
                className={`${styles.navItem} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
