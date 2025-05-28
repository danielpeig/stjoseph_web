import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Swal from "sweetalert2";

const firebaseConfig = {
  apiKey: "AIzaSyBfjYMkYdCPTKb0FyGIvKB2fVlbTdobi1s",
  authDomain: "stjoseph-website.firebaseapp.com",
  projectId: "stjoseph-website",
  storageBucket: "stjoseph-website.firebasestorage.app",
  messagingSenderId: "480997652051",
  appId: "1:480997652051:web:6421e76f23ed708fa5b8a6",
  measurementId: "G-PBK6DPK9Z7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [archivedInquiries, setArchivedInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const snapshot = await getDocs(collection(db, "contactSubmissions"));
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Separate active and archived inquiries
      const active = allData.filter(inquiry => !inquiry.archived);
      const archived = allData.filter(inquiry => inquiry.archived);
      
      setInquiries(sortInquiries(active, sortOption));
      setArchivedInquiries(sortInquiries(archived, sortOption));
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setError("Failed to load inquiries");
    } finally {
      setIsLoading(false);
    }
  };

  const sortInquiries = (data, option) => {
    const sortedData = [...data];
    switch(option) {
      case "newest":
        return sortedData.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.seconds - a.timestamp.seconds;
        });
      case "oldest":
        return sortedData.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return a.timestamp.seconds - b.timestamp.seconds;
        });
      case "unread":
        return sortedData.sort((a, b) => {
          if (a.read === b.read) {
            // If read status is the same, sort by timestamp (newest first)
            if (!a.timestamp || !b.timestamp) return 0;
            return b.timestamp.seconds - a.timestamp.seconds;
          }
          // Unread first
          return a.read ? 1 : -1;
        });
      default:
        return sortedData;
    }
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    setInquiries(sortInquiries([...inquiries], option));
    setArchivedInquiries(sortInquiries([...archivedInquiries], option));
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "contactSubmissions", id), { read: true });
      fetchInquiries();
      Swal.fire("Success", "Inquiry marked as read", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update inquiry status", "error");
    }
  };

  const archiveInquiry = async (id) => {
    const result = await Swal.fire({
      title: "Archive this inquiry?",
      text: "You can view it later in the archived section",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, archive it!"
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, "contactSubmissions", id), { archived: true });
        fetchInquiries();
        Swal.fire("Archived", "Inquiry has been archived", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to archive inquiry", "error");
      }
    }
  };

  const restoreInquiry = async (id) => {
    try {
      await updateDoc(doc(db, "contactSubmissions", id), { archived: false });
      fetchInquiries();
      Swal.fire("Restored", "Inquiry has been restored", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to restore inquiry", "error");
    }
  };

  const permanentlyDeleteInquiry = async (id) => {
    const result = await Swal.fire({
      title: "Permanently delete?",
      text: "This action cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete permanently!"
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "contactSubmissions", id));
        fetchInquiries();
        Swal.fire("Deleted", "Inquiry has been permanently removed", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete inquiry", "error");
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderInquiryList = (inquiryList, isArchived = false) => {
    if (inquiryList.length === 0) {
      return <p>No inquiries found.</p>;
    }

    return (
      <div className="inquiry-list">
        {inquiryList.map((inquiry) => (
          <div key={inquiry.id} className={`inquiry-card ${!inquiry.read ? 'unread' : ''}`}>
            <div className="inquiry-header">
              <div className="inquiry-info">
                <h3>{inquiry.name}</h3>
                <div className="inquiry-meta">
                  <span className="inquiry-email">{inquiry.email}</span>
                  <span className="inquiry-date">{formatDate(inquiry.timestamp)}</span>
                  {!inquiry.read && <span className="unread-badge">New</span>}
                </div>
              </div>
            </div>
            
            <div className="inquiry-content">
              <p>{inquiry.message}</p>
            </div>
            
            <div className="inquiry-actions">
              {isArchived ? (
                <>
                  <button 
                    className="btn-restore" 
                    onClick={() => restoreInquiry(inquiry.id)}
                  >
                    Restore
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => permanentlyDeleteInquiry(inquiry.id)}
                  >
                    Delete Permanently
                  </button>
                </>
              ) : (
                <>
                  {!inquiry.read && (
                    <button 
                      className="btn-mark-read" 
                      onClick={() => markAsRead(inquiry.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button 
                    className="btn-archive" 
                    onClick={() => archiveInquiry(inquiry.id)}
                  >
                    Archive
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-section">
      <h1>Manage Inquiries</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="inquiry-controls">
        <div className="sort-control">
          <label htmlFor="sort-select">Sort by: </label>
          <select 
            id="sort-select" 
            value={sortOption} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="unread">Unread First</option>
          </select>
        </div>

        <div className="tab-controls">
          <button 
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Inquiries
          </button>
          <button 
            className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived Inquiries
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : activeTab === 'active' ? (
        <>
          <h4 className="admin-subtitle">Visitor Inquiries</h4>
          {renderInquiryList(inquiries)}
        </>
      ) : (
        <>
          <h4 className="admin-subtitle">Archived Inquiries</h4>
          {renderInquiryList(archivedInquiries, true)}
        </>
      )}
    </div>
  );
};

export default AdminInquiries;