import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Swal from "sweetalert2";

// Reuse Firebase config from contact.js
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

const AdminDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const snapshot = await getDocs(collection(db, "announcements"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const addAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      Swal.fire("Error", "Please fill in both title and content", "error");
      return;
    }

    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, "announcements"), {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        timestamp: new Date().toISOString() // Add timestamp for sorting
      });
      
      if (docRef.id) {
        setNewAnnouncement({ title: "", content: "" });
        await fetchAnnouncements();
        Swal.fire("Success", "Announcement added successfully", "success");
      } else {
        throw new Error("Failed to get document reference");
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
      Swal.fire("Error", `Failed to add announcement: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnnouncement = async (id, updated) => {
    if (!updated.title || !updated.content) {
      Swal.fire("Error", "Please fill in both title and content", "error");
      return;
    }

    try {
      await updateDoc(doc(db, "announcements", id), updated);
      fetchAnnouncements();
      Swal.fire("Success", "Announcement updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update announcement", "error");
    }
  };

  const deleteAnnouncement = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "announcements", id));
        fetchAnnouncements();
        Swal.fire("Deleted", "Announcement has been removed", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete announcement", "error");
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h2 className="admin-title">Admin Dashboard - Manage Announcements</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="announcement-form">
          <div className="announcement-input">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="announcement-input">
            <textarea
              name="content"
              placeholder="Content"
              value={newAnnouncement.content}
              onChange={handleInputChange}
              required
              rows="3"
            ></textarea>
          </div>
          <button onClick={addAnnouncement} className="btn-add">
            Add Announcement
          </button>
        </div>

        <h4 className="admin-title">Existing Announcements</h4>
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <p>No announcements found.</p>
        ) : (
          <div className="announcement-list">
            {announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <div className="announcement-input">
                  <input
                    value={a.title}
                    onChange={(e) =>
                      setAnnouncements(prev =>
                        prev.map(item =>
                          item.id === a.id ? { ...item, title: e.target.value } : item
                        )
                      )
                    }
                    required
                  />
                </div>
                <div className="announcement-input">
                  <textarea
                    value={a.content}
                    onChange={(e) =>
                      setAnnouncements(prev =>
                        prev.map(item =>
                          item.id === a.id ? { ...item, content: e.target.value } : item
                        )
                      )
                    }
                    required
                    rows="3"
                  />
                </div>
                <div className="card-actions">
                  <button
                    className="btn-save"
                    onClick={() => updateAnnouncement(a.id, { title: a.title, content: a.content })}
                  >
                    Save
                  </button>
                  <button className="btn-delete" onClick={() => deleteAnnouncement(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
