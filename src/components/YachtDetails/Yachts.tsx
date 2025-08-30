import React, { useEffect, useState } from "react";
import { adminAPI, BookingData } from "../../api/admin";
import styles from "../../styles/YachtDetails/Yachts.module.css";
import { Search } from "lucide-react";
import YachtCard from "../Layouts/YatchCard";

interface ComponentFilters {
  type: 'search' | 'listing';
  listingStatus: 'all' | 'recent' | 'requested' | 'denied';
}

const Yachts: React.FC = () => {
  const [yachts, setYachts] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComponentFilters>({
    type: 'search',
    listingStatus: 'all'
  });
  const [searchName, setSearchName] = useState('');

  const fetchYachts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getYachts({
        status: filters.listingStatus,
        searchName: searchName
      });
      // Access the yachts array from the response
      // @ts-ignore
      setYachts(response.yatchs || []);
    } catch (err) {
      setError('Failed to fetch yachts');
      console.error('Error fetching yachts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYachts();
  }, [filters]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchYachts();
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading yachts...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.yachtsContainer}>
      <h1 className={styles.title}>Yachts</h1>
      
      <div className={styles.statusTabs}>
        <button 
          className={`${styles.tab} ${filters.type === 'search' ? styles.activeTab : ''}`}
          onClick={() => setFilters({ ...filters, type: 'search' })}
        >
          Search for Yachts
        </button>
        <button 
          className={`${styles.tab} ${filters.type === 'listing' ? styles.activeTab : ''}`}
          onClick={() => setFilters({ ...filters, type: 'listing' })}
        >
          Yacht Listing
        </button>
      </div>

      {filters.type === 'search' ? (
        <form onSubmit={handleSearch} className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <Search size={20} />
          </button>
        </form>
      ) : (
        <div className={styles.filterBar}>
          <div className={styles.listingTabs}>
            <button 
              className={`${styles.filterTab} ${filters.listingStatus === 'all' ? styles.activeFilterTab : ''}`}
              onClick={() => setFilters({ ...filters, listingStatus: 'all' })}
            >
              All
            </button>
            <button 
              className={`${styles.filterTab} ${filters.listingStatus === 'recent' ? styles.activeFilterTab : ''}`}
              onClick={() => setFilters({ ...filters, listingStatus: 'recent' })}
            >
              Recently Listed
            </button>
            <button 
              className={`${styles.filterTab} ${filters.listingStatus === 'requested' ? styles.activeFilterTab : ''}`}
              onClick={() => setFilters({ ...filters, listingStatus: 'requested' })}
            >
              Listing Requests
            </button>
            <button 
              className={`${styles.filterTab} ${filters.listingStatus === 'denied' ? styles.activeFilterTab : ''}`}
              onClick={() => setFilters({ ...filters, listingStatus: 'denied' })}
            >
              Denied Requests
            </button>
          </div>
        </div>
      )}

      <div className={styles.yachtsGrid}>
        {yachts.map((yacht) => (
          // @ts-ignore
          <YachtCard showLoc={true} key={yacht._id} yacht={yacht} />
        ))}
      </div>
    </div>
  );
};

export default Yachts;