import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from "react-router-dom";
import "./AdminDashboard.css";
import "./navigation.css"; // Import the navigation styles
import AdminAnnouncements from "./admin/AdminAnnouncements";
import AdminPriest from "./admin/AdminPriest";
import AdminGallery from "./admin/AdminGallery";
import AdminContents from "./admin/AdminContents";
import AdminDonations from "./admin/AdminDonations";
import AdminInquiries from "./admin/AdminInquiries";
import AdminHome from "./admin/AdminHome";
import { initializeApp } from "firebase/app";
import { updateDoc } from 'firebase/firestore';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";
import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBfjYMkYdCPTKb0FyGIvKB2fVlbTdobi1s",
  authDomain: "stjoseph-website.firebaseapp.com",
  projectId: "stjoseph-website",
  storageBucket: "stjoseph-website.firebasestorage.app",
  messagingSenderId: "480997652051",
  appId: "1:480997652051:web:6421e76f23ed708fa5b8a6",
  measurementId: "G-PBK6DPK9Z7"
};

let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const AdminDashboard = () => {
  const history = useHistory();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);

  const handleLogout = () => {
    // Add logout logic here
    history.push("/");
  };

  const handleSaveAnnouncement = async (announcementData) => {
    try {
      await addDoc(collection(db, 'announcements'), {
        ...announcementData,
        author: currentAdmin?.username || 'Admin', // Use logged-in admin's username or fallback
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
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
                <Link to="/admin-dashboard/priest">Priest</Link>
              </li>
              <li>
                <Link to="/admin-dashboard/gallery">Gallery</Link>
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
          <Route 
            path="/admin-dashboard/announcements" 
            render={(props) => (
              <AdminAnnouncements 
                {...props}
                onSave={handleSaveAnnouncement}
                isEditing={isEditing}
                editingDocId={editingDocId}
              />
            )}
          />
          <Route path="/admin-dashboard/priest" component={AdminPriest} />
          <Route path="/admin-dashboard/gallery" component={AdminGallery} />
          <Route path="/admin-dashboard/donations" component={AdminDonations} />
          <Route path="/admin-dashboard/inquiries" component={AdminInquiries} />
        </Switch>
      </div>
    </div>
  );
};

export default AdminDashboard;