import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Swal from "sweetalert2";
import './admin.css';


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

const AdminPriests = () => {
  const [priests, setPriests] = useState([]);
  const [newPriest, setNewPriest] = useState({ name: "", image: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPriests();
  }, []);

  const fetchPriests = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "priests"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPriests(data);
    } catch (err) {
      console.error("Error fetching priests:", err);
      setError("Failed to load priest data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewPriest({ ...newPriest, [e.target.name]: e.target.value });
  };

  const addPriest = async () => {
    if (!newPriest.name || !newPriest.image || !newPriest.description) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, "priests"), {
        name: newPriest.name,
        image: newPriest.image,
        description: newPriest.description,
        createdAt: new Date().toISOString()
      });

      if (docRef.id) {
        setNewPriest({ name: "", image: "", description: "" });
        await fetchPriests();
        Swal.fire("Success", "Priest added successfully", "success");
      }
    } catch (err) {
      Swal.fire("Error", `Failed to add priest: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePriest = async (id, updated) => {
    if (!updated.name || !updated.image || !updated.description) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    try {
      await updateDoc(doc(db, "priests", id), updated);
      fetchPriests();
      Swal.fire("Updated", "Priest details updated", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update priest", "error");
    }
  };

  const deletePriest = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the priest record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "priests", id));
        fetchPriests();
        Swal.fire("Deleted", "Priest has been removed", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete priest", "error");
      }
    }
  };

  return (
    <div className="admin-section">
      <h1>Manage Priests</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="priest-form">
        <input
          type="text"
          name="name"
          placeholder="Priest's Name"
          value={newPriest.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newPriest.image}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newPriest.description}
          onChange={handleInputChange}
          required
          rows="3"
        />
        <button className="btn-add" onClick={addPriest}>Add Priest</button>
      </div>

      <h4>Priest Directory</h4>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : priests.length === 0 ? (
        <p>No priest data found.</p>
      ) : (
        <div className="priest-list">
          {priests.map((p) => (
            <div key={p.id} className="priest-card">
              <div className="priest-image-preview">
                <img src={p.image} alt={p.name} />
              </div>
              <input
                value={p.name}
                onChange={(e) =>
                  setPriests(prev => prev.map(item =>
                    item.id === p.id ? { ...item, name: e.target.value } : item
                  ))
                }
                placeholder="Name"
              />
              <input
                value={p.image}
                onChange={(e) =>
                  setPriests(prev => prev.map(item =>
                    item.id === p.id ? { ...item, image: e.target.value } : item
                  ))
                }
                placeholder="Image URL"
              />
              <textarea
                value={p.description}
                onChange={(e) =>
                  setPriests(prev => prev.map(item =>
                    item.id === p.id ? { ...item, description: e.target.value } : item
                  ))
                }
                placeholder="Description"
              />
              <div className="card-actions">
                <button
                  className="btn-save"
                  onClick={() =>
                    updatePriest(p.id, {
                      name: p.name,
                      image: p.image,
                      description: p.description
                    })
                  }
                >
                  Save
                </button>
                <button className="btn-delete" onClick={() => deletePriest(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPriests;
