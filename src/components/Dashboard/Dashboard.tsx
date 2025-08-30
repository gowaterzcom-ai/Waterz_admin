import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { adminAPI, DashboardResponse, DistributionData, DashboardFilters } from '../../api/admin';
import styles from '../../styles/Dashboard/Dashboard.module.css';

const COLORS = ['#8884d8', '#82ca9d'];

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse['dashboard'] | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    bookingView: 'thisYear',
    earningView: 'thisYear',
    distributionView: 'thisYear'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getDashboardData(filters);
      setDashboardData(response.dashboard); // Updated to match new response structure
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Updated helper function to handle zero/null percentages:
  const formatDistributionData = (distribution: DistributionData) => {
    if (
      (distribution.customerPercentage === 0 && distribution.agentPercentage === 0) ||
      (distribution.customerPercentage === null && distribution.agentPercentage === null)
    ) {
      return [{ name: 'No Data', value: 100 }];
    }
    return [
      { name: 'Customer', value: distribution.customerPercentage ?? 0 },
      { name: 'Agent', value: distribution.agentPercentage ?? 0 }
    ];
  };

  if (isLoading) return <div className={styles.loading}>Loading dashboard...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!dashboardData) return null;

  // Prepare distribution data for both charts
  const bookingDistributionData = formatDistributionData(dashboardData.distribution.bookings);
  const isBookingDistEmpty = bookingDistributionData.length === 1 && bookingDistributionData[0].name === 'No Data';
  
  const earningsDistributionData = formatDistributionData(dashboardData.distribution.earnings);
  const isEarningsDistEmpty = earningsDistributionData.length === 1 && earningsDistributionData[0].name === 'No Data';

  return (
    <div className={styles.dashboardContainer}>
      {/* Bookings Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2>Bookings</h2>
          <select 
            value={filters.bookingView}
            onChange={(e) => setFilters(prev => ({ ...prev, bookingView: e.target.value as 'thisYear' | 'overall' }))}
            className={styles.filterSelect}
          >
            <option value="thisYear">This Year</option>
            <option value="overall">Overall</option>
          </select>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.bookings.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalBookings" stroke="#8884d8" name="Total Bookings" />
              <Line type="monotone" dataKey="customerBookings" stroke="#82ca9d" name="Customer Bookings" />
              <Line type="monotone" dataKey="agentBookings" stroke="#ffc658" name="Agent Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span>Total Bookings</span>
            <strong>{dashboardData.bookings.total}</strong>
          </div>
          <div className={styles.statItem}>
            <span>Customer Bookings</span>
            <strong>{dashboardData.bookings.byCustomer}</strong>
          </div>
          <div className={styles.statItem}>
            <span>Agent Bookings</span>
            <strong>{dashboardData.bookings.byAgent}</strong>
          </div>
        </div>
      </div>

      {/* Booking Distribution */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2>Booking Distribution</h2>
          <select 
            value={filters.distributionView}
            onChange={(e) => setFilters(prev => ({ ...prev, distributionView: e.target.value as 'thisYear' | 'thisMonth' }))}
            className={styles.filterSelect}
          >
            <option value="thisYear">This Year</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label={({ percent }) => percent ? `${(percent * 100).toFixed(1)}%` : '0%'}
              >
                {isBookingDistEmpty 
                  ? <Cell fill="#D3D3D3" /> 
                  : COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2>Earnings</h2>
          <select 
            value={filters.earningView}
            onChange={(e) => setFilters(prev => ({ ...prev, earningView: e.target.value as 'thisYear' | 'overall' }))}
            className={styles.filterSelect}
          >
            <option value="thisYear">This Year</option>
            <option value="overall">Overall</option>
          </select>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.earnings.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Earnings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.totalEarnings}>
          <span>Total Earnings</span>
          <strong>{formatCurrency(dashboardData.earnings.total)}</strong>
        </div>
      </div>

      {/* Earnings Distribution */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2>Earnings Distribution</h2>
          <select 
            value={filters.distributionView}
            onChange={(e) => setFilters(prev => ({ ...prev, distributionView: e.target.value as 'thisYear' | 'thisMonth' }))}
            className={styles.filterSelect}
          >
            <option value="thisYear">This Year</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={earningsDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label={({ percent }) => percent ? `${(percent * 100).toFixed(1)}%` : '0%'}
              >
                {isEarningsDistEmpty 
                  ? <Cell fill="#D3D3D3" /> 
                  : COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;