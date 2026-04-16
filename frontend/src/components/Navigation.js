import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>🌍 CarbonTrace AI</h2>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard" className={isActive('/dashboard')}>
          Dashboard
        </Link>
        <Link to="/activities" className={isActive('/activities')}>
          Activities
        </Link>
        <Link to="/add-activity" className={isActive('/add-activity')}>
          Add Activity
        </Link>
        <Link to="/reports" className={isActive('/reports')}>
          Reports
        </Link>
      </div>

      <div className="nav-user">
        <span className="user-name">{user?.name || user?.email}</span>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
