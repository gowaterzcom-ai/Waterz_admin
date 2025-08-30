import { useEffect, useState } from 'react';
import type { Analytics } from '../../api/admin';
import { adminAPI } from '../../api/admin';
import styles from '../../styles/Analytics/Analytics.module.css';
import { Calendar } from 'lucide-react';

interface AnalyticsBoxProps {
  title: string;
  count: number;
  change: number | null;
  comparison: string;
}

const AnalyticsBox = ({ title, count, change, comparison }: AnalyticsBoxProps) => {
  const formatChange = (change: number | null): string => {
    if (change === null) return 'N/A';
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  return (
    <div className={styles.analyticsBox}>
      <div className={styles.analyticsContent}>
        <div className={styles.iconWrapper}>
          <Calendar size={20} />
        </div>
        <div className={styles.count}>
          {count.toLocaleString()}
        </div>
        <div className={styles.title}>
          {title}
        </div>
      </div>
      <div className={styles.analyticsContent}>
        <div 
          className={styles.changeIndicator} 
          style={{
            color: change === null ? '#666' : change >= 0 ? '#22c55e' : '#ef4444'
          }}
        >
          {formatChange(change)}
        </div>
        <div className={styles.vsText}>
          {comparison}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await adminAPI.getAnalytics();
        setAnalyticsData(response.analytics);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!analyticsData) {
    return null;
  }

  const analyticsBoxes = [
    {
      title: "Today's Bookings",
      count: analyticsData.today.count,
      change: analyticsData.today.percentageChange,
      comparison: 'vs yesterday'
    },
    {
      title: "This Week's Bookings",
      count: analyticsData.weekly.current,
      change: analyticsData.weekly.percentageChange,
      comparison: 'vs last week'
    },
    {
      title: "This Month's Bookings",
      count: analyticsData.monthly.current,
      change: analyticsData.monthly.percentageChange,
      comparison: 'vs last month'
    },
    {
      title: "This Year's Bookings",
      count: analyticsData.yearly.current,
      change: analyticsData.yearly.percentageChange,
      comparison: 'vs last year'
    }
  ];

  return (
    <div className={styles.analyticsWrapper}>
      <div className={styles.analyticsContainer}>
        {analyticsBoxes.map((box, index) => (
          <AnalyticsBox
            key={index}
            title={box.title}
            count={box.count}
            change={box.change}
            comparison={box.comparison}
          />
        ))}
      </div>
    </div>
  );
};

export default Analytics;