import React from "react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="admin-home">
      <h1>Welcome to St. Joseph Shrine Admin Dashboard</h1>
      
      <div className="admin-stats-overview">
        <div className="admin-stat-card">
          <h3>Announcements</h3>
          <p className="admin-stat-number">4</p>
          <Link to="/admin-dashboard/announcements" className="admin-card-link">
            Manage Announcements
          </Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Contents</h3>
          <p className="admin-stat-number">12</p>
          <Link to="/admin-dashboard/contents" className="admin-card-link">
            Manage Contents
          </Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Donations</h3>
          <p className="admin-stat-number">8</p>
          <Link to="/admin-dashboard/donations" className="admin-card-link">
            View Donations
          </Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Inquiries</h3>
          <p className="admin-stat-number">3</p>
          <Link to="/admin-dashboard/inquiries" className="admin-card-link">
            Respond to Inquiries
          </Link>
        </div>
      </div>
      
      <div className="admin-recent-activity">
        <h2>Recent Activity</h2>
        <div className="admin-activity-list">
          <div className="admin-activity-item">
            <p className="admin-activity-time">Today, 10:30 AM</p>
            <p className="admin-activity-text">New donation received</p>
          </div>
          <div className="admin-activity-item">
            <p className="admin-activity-time">Yesterday, 3:45 PM</p>
            <p className="admin-activity-text">Announcement updated: "Mass Schedule Update"</p>
          </div>
          <div className="admin-activity-item">
            <p className="admin-activity-time">Yesterday, 11:20 AM</p>
            <p className="admin-activity-text">New inquiry from visitor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;