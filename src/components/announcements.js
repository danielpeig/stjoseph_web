import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfjYMkYdCPTKb0FyGIvKB2fVlbTdobi1s",
  authDomain: "stjoseph-website.firebaseapp.com",
  projectId: "stjoseph-website",
  storageBucket: "stjoseph-website.firebasestorage.app",
  messagingSenderId: "480997652051",
  appId: "1:480997652051:web:6421e76f23ed708fa5b8a6",
  measurementId: "G-PBK6DPK9Z7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const Announcements = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([{
    title: "Loading...",
    content: "Please wait while we fetch the announcements..."
  }]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const snapshot = await getDocs(collection(db, "announcements"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) {
        setAnnouncements(data);
      } else {
        setAnnouncements([
          { title: "Welcome to Our Church", content: "Join us this Sunday for a special sermon." },
          { title: "Weekly Bible Study", content: "Every Wednesday at 7PM in the fellowship hall." },
          { title: "Community Outreach", content: "Volunteers needed for our food drive this weekend." }
        ]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([
        { title: "Welcome", content: "Please check back later for announcements." }
      ]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [announcements.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % announcements.length
    );
  };

  return (
    <div id="announcements" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Announcements</h2>
          <p>Stay updated with our latest news and events</p>
        </div>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            {announcements.length > 0 && (
              <div className="announcement-box">
                <div className="announcement-nav">
                  <button 
                    onClick={handlePrev}
                    className="announcement-btn"
                  >
                    &laquo; Prev
                  </button>
                  <span className="announcement-counter">
                    {currentIndex + 1} of {announcements.length}
                  </span>
                  <button 
                    onClick={handleNext}
                    className="announcement-btn"
                  >
                    Next &raquo;
                  </button>
                </div>
                <div className="announcement-content">
                  <h3>{announcements[currentIndex]?.title}</h3>
                  <p>{announcements[currentIndex]?.content}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};