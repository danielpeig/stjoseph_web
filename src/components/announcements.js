import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "animate.css";

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
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const announcementRef = useRef(null);
  const [announcements, setAnnouncements] = useState([{
    title: "Loading...",
    content: "Please wait while we fetch the announcements..."
  }]);

  useEffect(() => {
    fetchAnnouncements();
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } 
    );

    if (announcementRef.current) {
      observer.observe(announcementRef.current);
    }

    return () => {
      if (announcementRef.current) {
        observer.unobserve(announcementRef.current);
      }
    };
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
    let interval;
    if (!isPaused && announcements.length > 1) {  
      interval = setInterval(() => {
        if (!isTransitioning) {  
          handleSlideChange((prevIndex) => (prevIndex + 1) % announcements.length);
        }
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [announcements.length, isPaused, isTransitioning]);

  const handleSlideChange = (nextIndex) => {
    if (isTransitioning) return; 
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(typeof nextIndex === 'function' ? nextIndex(currentIndex) : nextIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300); 
    }, 10);
  };

  const handlePrev = () => {
    setIsPaused(true); 
    handleSlideChange(prevIndex => 
      prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsPaused(true); 
    handleSlideChange(prevIndex => 
      (prevIndex + 1) % announcements.length
    );
  };

  useEffect(() => {
    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [isPaused]);

  return (
    <div id="announcements" className="text-center" ref={announcementRef}
         onMouseEnter={() => setIsPaused(true)}
         onMouseLeave={() => setIsPaused(false)}>
      <div className="container">
        <div className={`section-title ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-05s' : ''}`}>
          <h2>Announcements</h2>
          <p className={isVisible ? 'animate__animated animate__fadeIn animate__delay-1s' : ''}>
            Stay updated with our latest news and events
          </p>
        </div>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            {announcements.length > 0 && (
              <div className={`announcement-box ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-15s' : ''}`}>
                <div className={`announcement-nav ${isVisible ? 'animate__animated animate__fadeIn animate__delay-2s' : ''}`}>
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
                <div className={`announcement-content ${isTransitioning ? 'transitioning' : ''} ${isVisible ? 'animate__animated animate__fadeIn animate__delay-2.5s' : ''}`}
                     style={{ transition: 'opacity 0.5s ease-in-out' }}>
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