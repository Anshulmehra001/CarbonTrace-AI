import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Activities.css';

const API_URL = 'http://localhost:8000';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(activities.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h1>All Activities</h1>
        <p>View and manage your carbon footprint activities</p>
      </div>

      {activities.length === 0 ? (
        <div className="no-activities">
          <p>No activities recorded yet</p>
          <a href="/add-activity" className="btn-primary">Add Your First Activity</a>
        </div>
      ) : (
        <div className="activities-table-container">
          <table className="activities-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>CO₂ Emissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{formatDate(activity.date)}</td>
                  <td>
                    <span className={`badge badge-${activity.type}`}>
                      {activity.type}
                    </span>
                  </td>
                  <td>{activity.category}</td>
                  <td>{activity.description || '-'}</td>
                  <td>{activity.quantity} {activity.unit}</td>
                  <td className="emission-cell">
                    <strong>{activity.co2_kg.toFixed(2)} kg</strong>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(activity.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="activities-summary">
        <h3>Summary</h3>
        <p>Total Activities: <strong>{activities.length}</strong></p>
        <p>Total Emissions: <strong>{activities.reduce((sum, a) => sum + a.co2_kg, 0).toFixed(2)} kg CO₂</strong></p>
      </div>
    </div>
  );
}

export default Activities;
