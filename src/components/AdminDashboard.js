import React from "react";
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from "react-router-dom";
import "./AdminDashboard.css";
import "./navigation.css"; // Import the navigation styles
import AdminAnnouncements from "./admin/AdminAnnouncements";
import AdminContents from "./admin/AdminContents";
import AdminDonations from "./admin/AdminDonations";
import AdminInquiries from "./admin/AdminInquiries";
import AdminHome from "./admin/AdminHome";

const AdminDashboard = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Add logout logic here
    // For now, just redirect to home page
    history.push("/");
  };

  return (
    <div className="admin-dashboard">
      <nav id="menu" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand page-scroll">
              St. Joseph Shrine Admin
            </a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li>
                <Link to="/admin-dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin-dashboard/announcements">Announcements</Link>
              </li>
              <li>
                <Link to="/admin-dashboard/contents">Contents</Link>
              </li>
              <li>
                <Link to="/admin-dashboard/donations">Donations</Link>
              </li>
              <li>
                <Link to="/admin-dashboard/inquiries">Inquiries</Link>
              </li>
              <li>
                <a onClick={handleLogout} style={{ cursor: 'pointer' }}><strong>Logout</strong></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="admin-content">
        <Switch>
          <Route exact path="/admin-dashboard" component={AdminHome} />
          <Route path="/admin-dashboard/announcements" component={AdminAnnouncements} />
          <Route path="/admin-dashboard/contents" component={AdminContents} />
          <Route path="/admin-dashboard/donations" component={AdminDonations} />
          <Route path="/admin-dashboard/inquiries" component={AdminInquiries} />
        </Switch>
      </div>
    </div>
  );
};

export default AdminDashboard;
