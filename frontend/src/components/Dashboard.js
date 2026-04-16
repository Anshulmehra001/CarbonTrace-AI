import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Dashboard.css';

const API_URL = 'http://localhost:8000';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, activitiesRes] = await Promise.all([
        axios.get(`${API_URL}/api/dashboard/summary`, { headers }),
        axios.get(`${API_URL}/api/activities`, { headers })
      ]);

      setSummary(summaryRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const pieData = summary?.by_type ? Object.entries(summary.by_type).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2))
  })) : [];

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Carbon Footprint Dashboard</h1>
        <p>Real-time insights into your environmental impact</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <h3>Total Emissions</h3>
            <p className="stat-value">{summary?.total_emissions_kg?.toFixed(2) || 0} kg</p>
            <span className="stat-label">CO₂ Equivalent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Activities</h3>
            <p className="stat-value">{summary?.total_activities || 0}</p>
            <span className="stat-label">Tracked Events</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>30-Day Trend</h3>
            <p className={`stat-value ${summary?.trend_percentage < 0 ? 'positive' : 'negative'}`}>
              {summary?.trend_percentage > 0 ? '+' : ''}{summary?.trend_percentage?.toFixed(1) || 0}%
            </p>
            <span className="stat-label">vs Previous Period</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <h3>Tree Equivalent</h3>
            <p className="stat-value">{Math.round((summary?.total_emissions_kg || 0) / 20)}</p>
            <span className="stat-label">Trees Needed to Offset</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Emissions by Type</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>

        <div className="chart-card">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-info">
                    <span className="activity-type">{activity.type}</span>
                    <span className="activity-desc">{activity.description || activity.category}</span>
                  </div>
                  <div className="activity-emission">
                    <span className="emission-value">{activity.co2_kg.toFixed(2)} kg</span>
                    <span className="emission-label">CO₂</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No activities yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="insights-card">
        <h2>💡 Quick Insights</h2>
        <div className="insights-grid">
          <div className="insight-item">
            <span className="insight-icon">🚗</span>
            <p>Your emissions equal driving {Math.round((summary?.total_emissions_kg || 0) / 0.2)} km in an average car</p>
          </div>
          <div className="insight-item">
            <span className="insight-icon">💰</span>
            <p>Carbon offset cost: ${((summary?.total_emissions_kg || 0) / 1000 * 15).toFixed(2)}</p>
          </div>
          <div className="insight-item">
            <span className="insight-icon">⚡</span>
            <p>Equivalent to {Math.round((summary?.total_emissions_kg || 0) / 0.385)} kWh of electricity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
