import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css';
import Navbar from "../../Navbar/Navbar";

const ReservationAnalytics = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:8002/reservations/all',
        { withCredentials: true }
      );
      setReservations(response.data);
      console.log({response})
      setError(null);
    } catch (err) {
      setError('Failed to fetch reservation data');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter reservations based on selected time period
  const filterReservationsByTime = (reservations) => {
    const now = new Date();
    let startDate;
    
    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return reservations;
    }
    
    return reservations.filter(res => new Date(res.timestamp) >= startDate);
  };

const calculateGrowthRate = (data) => {
  const now = new Date();

  if (timeFilter === 'week') {
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const currentWeek = data.filter(r => new Date(r.timestamp) >= startDate).length;
    const prevWeek = data.filter(r => new Date(r.timestamp) >= prevStartDate && new Date(r.timestamp) < startDate).length;
    if (prevWeek === 0) return currentWeek > 0 ? 100 : 0;
    return (((currentWeek - prevWeek) / prevWeek) * 100).toFixed(1);

  } else if (timeFilter === 'month') {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonth = data.filter(r => new Date(r.timestamp) >= startDate).length;
    const prevMonth = data.filter(r => new Date(r.timestamp) >= prevStartDate && new Date(r.timestamp) < startDate).length;
    if (prevMonth === 0) return currentMonth > 0 ? 100 : 0;
    return (((currentMonth - prevMonth) / prevMonth) * 100).toFixed(1);

  } else if (timeFilter === 'all') {
    // Trend generale: confronta metà iniziale e metà finale dei dati
    if (data.length < 2) return 0;
    const sorted = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const mid = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, mid).length;
    const secondHalf = sorted.slice(mid).length;
    if (firstHalf === 0) return secondHalf > 0 ? 100 : 0;
    return (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1);
  }

  return 0;
};

  
  // Calculate statistics
  const calculateStats = (data) => {
    const filteredData = filterReservationsByTime(data);
    const total = filteredData.length;
    const fulfilled = filteredData.filter(r => r.fulfilled).length;
    const cancelled = filteredData.filter(r => r.cancelled).length;
    const ready = filteredData.filter(r => r.ready_for_pickup && !r.fulfilled).length;
    const active = filteredData.filter(r => !r.fulfilled && !r.cancelled).length;
    const growthRate = calculateGrowthRate(reservations);

    return {
      total,
      fulfilled,
      cancelled,
      ready,
      active,
      fulfillmentRate: total > 0 ? ((fulfilled / total) * 100).toFixed(1) : 0,
      growthRate,
    };
  };
  
  // Prepare data for visualizations
  const prepareChartData = (data) => {
    const filteredData = filterReservationsByTime(data);
    
    // Status data
    const statusData = [
      { name: 'Total', count: filteredData.length },
      { name: 'Fulfilled', count: filteredData.filter(r => r.fulfilled).length },
      { name: 'Cancelled', count: filteredData.filter(r => r.cancelled).length },
      { name: 'Ready', count: filteredData.filter(r => r.ready_for_pickup && !r.fulfilled).length },
      { name: 'Active', count: filteredData.filter(r => !r.fulfilled && !r.cancelled).length },
    ];
    
    // Daily data for timeline
    const dailyData = {};
    filteredData.forEach(res => {
      const date = new Date(res.timestamp).toLocaleDateString();
      dailyData[date] = (dailyData[date] || 0) + 1;
    });
    
    const timelineData = Object.keys(dailyData).map(date => ({
      date,
      reservations: dailyData[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return { statusData, timelineData };
  };

  const stats = calculateStats(reservations);
  const chartData = prepareChartData(reservations);
  const displayedReservations = showAll ? reservations : reservations.slice(0, 10);

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading reservation data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <p>{error}</p>
        <button onClick={fetchReservations}>Retry</button>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <Navbar/>
      <div className="analytics-header">
        <h1 className="BookCatalog-title">Library Reservation Analytics</h1>
        <div className="time-filter">
          <button 
            className={timeFilter === 'all' ? 'active' : ''}
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </button>
          <button 
            className={timeFilter === 'month' ? 'active' : ''}
            onClick={() => setTimeFilter('month')}
          >
            This Month
          </button>
          <button 
            className={timeFilter === 'week' ? 'active' : ''}
            onClick={() => setTimeFilter('week')}
          >
            This Week
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Reservations</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Fulfilled</h3>
          <div className="stat-value">{stats.fulfilled}</div>
        </div>
        <div className="stat-card">
          <h3>Cancelled</h3>
          <div className="stat-value">{stats.cancelled}</div>
        </div>
        <div className="stat-card">
          <h3>Ready for Pickup</h3>
          <div className="stat-value">{stats.ready}</div>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <div className="stat-value">{stats.active}</div>
        </div>
        <div className="stat-card">
          <h3>Fulfillment Rate</h3>
          <div className="stat-value">{stats.fulfillmentRate}%</div>
        </div>
        <div className="stat-card">
          <h3>Growth Rate</h3>
          <div className="stat-value">{stats.growthRate}%</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Reservation Status Distribution</h3>
          <div className="bar-chart">
            {chartData.statusData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.name}</div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${(item.count / Math.max(...chartData.statusData.map(d => d.count)) * 100)}%`,
                      backgroundColor: `hsl(17, 100%, ${70 - index * 12}%)`
                    }}
                  ></div>
                </div>
                <div className="bar-value">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Reservations Timeline</h3>
          <div className="timeline-chart">
            {chartData.timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-date">{item.date}</div>
                <div className="timeline-bar">
                  <div 
                    className="timeline-fill" 
                    style={{ 
                      height: `${(item.reservations / Math.max(...chartData.timelineData.map(d => d.reservations)) * 100)}%`
                    }}
                  ></div>
                </div>
                <div className="timeline-value">{item.reservations}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="raw-data">
        <h3>All Reservation Details ({reservations.length} records)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Book ISBN</th>
                <th>Status</th>
                <th>Position</th>
                <th>Reservation Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedReservations.map(res => {
                console.log("Row data:", res);
                return (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>{res.user}</td>
                    <td>{res.book}</td>
                    <td>
                      <span className={`status-badge ${
                        res.fulfilled ? 'fulfilled' : 
                        res.cancelled ? 'cancelled' : 
                        res.ready_for_pickup ? 'ready' : 'active'
                      }`}>
                        {res.fulfilled ? 'Fulfilled' : 
                        res.cancelled ? 'Cancelled' : 
                        res.ready_for_pickup ? 'Ready' : 'Active'}
                      </span>
                    </td>
                    <td>{res.position || '0'}</td>
                    <td>{new Date(res.timestamp).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
        {reservations.length > 10 && (
        <div 
          className="show-more" 
          onClick={() => setShowAll(!showAll)}
        >
          <span>
            {showAll 
              ? `Showing all ${reservations.length} records` 
              : `Showing 10 of ${reservations.length} records`}
          </span>
          <span className={`arrow ${showAll ? "up" : "down"}`}>▼</span>
        </div>
      )}
    </div>
  </div>
  );
};

export default ReservationAnalytics;