import React, { useState, useEffect, useRef } from "react";
import "animate.css";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase config (can be moved to a separate file if reused)
const firebaseConfig = {
  apiKey: "AIzaSyBfjYMkYdCPTKb0FyGIvKB2fVlbTdobi1s",
  authDomain: "stjoseph-website.firebaseapp.com",
  projectId: "stjoseph-website",
  storageBucket: "stjoseph-website.firebasestorage.app",
  messagingSenderId: "480997652051",
  appId: "1:480997652051:web:6421e76f23ed708fa5b8a6",
  measurementId: "G-PBK6DPK9Z7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const Priests = ({ scheduleData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [priestData, setPriestData] = useState([]);
  const priestsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (priestsRef.current) observer.observe(priestsRef.current);
    return () => priestsRef.current && observer.unobserve(priestsRef.current);
  }, []);

  useEffect(() => {
    const fetchPriests = async () => {
      try {
        const snapshot = await getDocs(collection(db, "priests"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPriestData(data);
      } catch (error) {
        console.error("Error fetching priests:", error);
      }
    };

    fetchPriests();
  }, []);

  return (
    <div id="priests" ref={priestsRef}>
      <div className="container">
        <div className={`section-title text-center ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-05s' : ''}`}>
          <h2>Parish Information</h2>
        </div>
        <div className="row">
          {/* Mass Schedule */}
          <div className={`col-md-6 ${isVisible ? 'animate__animated animate__fadeInLeft animate__delay-1s' : ''}`}>
            <div className="section-title text-center">
              <h3>Weekly Mass Schedule</h3>
            </div>
            {scheduleData && scheduleData.length > 0 ? (
              <div className="table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.time}</td>
                        <td>{item.language}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center">No schedule data available.</p>
            )}
          </div>

          {/* Parish Priests */}
          <div className={`col-md-6 ${isVisible ? 'animate__animated animate__fadeInRight animate__delay-1s' : ''}`}>
            <div className="section-title text-center">
              <h3>Parish Priests</h3>
            </div>
            <div className="row">
              {priestData.length > 0 ? (
                priestData.map((priest, i) => (
                  <div
                    key={priest.id}
                    className={`col-md-12 ${isVisible ? `animate__animated animate__fadeInUp animate__delay-${i}s` : ''}`}
                  >
                    <div className="priest-card">
                      <div className="priest-image">
                        <img
                          src={priest.image}
                          alt={priest.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="priest-content">
                        <h4>{priest.name}</h4>
                        <p>{priest.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No priest data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
