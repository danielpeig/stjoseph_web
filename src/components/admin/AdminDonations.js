import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
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

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDonation, setExpandedDonation] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const snapshot = await getDocs(collection(db, "donations"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(sortDonations(data, sortOption));
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to load donations");
    } finally {
      setIsLoading(false);
    }
  };

  const sortDonations = (data, option) => {
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
      case "pending":
        return sortedData.sort((a, b) => {
          const statusA = a.status || "pending";
          const statusB = b.status || "pending";
          if (statusA === "pending" && statusB !== "pending") return -1;
          if (statusA !== "pending" && statusB === "pending") return 1;
          // If both have the same status (both pending or both not pending), sort by date
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.seconds - a.timestamp.seconds;
        });
      case "verified":
        return sortedData.sort((a, b) => {
          const statusA = a.status || "pending";
          const statusB = b.status || "pending";
          if (statusA === "verified" && statusB !== "verified") return -1;
          if (statusA !== "verified" && statusB === "verified") return 1;
          // If both have the same status, sort by date
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.seconds - a.timestamp.seconds;
        });
      case "completed":
        return sortedData.sort((a, b) => {
          const statusA = a.status || "pending";
          const statusB = b.status || "pending";
          if (statusA === "completed" && statusB !== "completed") return -1;
          if (statusA !== "completed" && statusB === "completed") return 1;
          // If both have the same status, sort by date
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.seconds - a.timestamp.seconds;
        });
      case "amount-high":
        return sortedData.sort((a, b) => {
          const amountA = parseFloat(a.donationAmount) || 0;
          const amountB = parseFloat(b.donationAmount) || 0;
          return amountB - amountA;
        });
      case "amount-low":
        return sortedData.sort((a, b) => {
          const amountA = parseFloat(a.donationAmount) || 0;
          const amountB = parseFloat(b.donationAmount) || 0;
          return amountA - amountB;
        });
      default:
        return sortedData;
    }
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    setDonations(sortDonations([...donations], option));
  };

  const updateDonationStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "donations", id), { status: newStatus });
      fetchDonations();
      Swal.fire("Success", `Donation status updated to ${newStatus}`, "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update donation status", "error");
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

  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return `₱${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const toggleExpandDonation = (id) => {
    setExpandedDonation(expandedDonation === id ? null : id);
  };

  return (
    <div className="admin-section">
      <h1>Manage Donations</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="donation-controls">
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
            <option value="pending">Pending First</option>
            <option value="verified">Verified First</option>
            <option value="completed">Completed First</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
          </select>
        </div>
      </div>

      <h4 className="admin-subtitle">Donation Records</h4>
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="donation-list">
          {donations.map((donation) => (
            <div key={donation.id} className="donation-card">
              <div className="donation-header">
                <div className="donation-info">
                  <h3>{donation.name}</h3>
                  <div className="donation-meta">
                    <span className="donation-date">{formatDate(donation.timestamp)}</span>
                    <span className={`donation-status status-${donation.status || 'pending'}`}>
                      {donation.status || 'pending'}
                    </span>
                  </div>
                </div>
                <div className="donation-amount">
                  {formatCurrency(donation.donationAmount)}
                </div>
              </div>
              
              <div className="donation-details">
                <div className="detail-row">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">{donation.contactNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Method:</span>
                  <span className="detail-value">{donation.modeOfPayment}</span>
                </div>
                {donation.referenceNumber && (
                  <div className="detail-row">
                    <span className="detail-label">Reference #:</span>
                    <span className="detail-value">{donation.referenceNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="donation-actions">
                <button 
                  className="btn-expand" 
                  onClick={() => toggleExpandDonation(donation.id)}
                >
                  {expandedDonation === donation.id ? 'Hide Details' : 'View Details'}
                </button>
                <div className="status-actions">
                  <button 
                    className="btn-status btn-pending" 
                    onClick={() => updateDonationStatus(donation.id, 'pending')}
                    disabled={donation.status === 'pending'}
                  >
                    Pending
                  </button>
                  <button 
                    className="btn-status btn-verified" 
                    onClick={() => updateDonationStatus(donation.id, 'verified')}
                    disabled={donation.status === 'verified'}
                  >
                    Verify
                  </button>
                  <button 
                    className="btn-status btn-completed" 
                    onClick={() => updateDonationStatus(donation.id, 'completed')}
                    disabled={donation.status === 'completed'}
                  >
                    Complete
                  </button>
                </div>
              </div>
              
              {expandedDonation === donation.id && (
                <div className="expanded-content">
                  <div className="proof-of-payment">
                    <h4>Proof of Payment</h4>
                    {donation.proofOfPaymentBase64 ? (
                      <div className="image-container">
                        <img 
                          src={donation.proofOfPaymentBase64} 
                          alt="Proof of Payment" 
                          className="proof-image"
                        />
                      </div>
                    ) : (
                      <p>No proof of payment image available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDonations;