import React, { useState, useEffect, useRef } from "react";
import "animate.css";
                
export const Priests = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const priestsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (priestsRef.current) {
      observer.observe(priestsRef.current);
    }

    return () => {
      if (priestsRef.current) {
        observer.unobserve(priestsRef.current);
      }
    };
  }, []);

  return (
    <div id="priests" ref={priestsRef}>
      <div className="container">
        <div className={`section-title text-center ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-05s' : ''}`}>
          <h2>Parish Information</h2>
        </div>
        <div className="row">
          {/* Left side - Mass Schedule */}
          <div className={`col-md-6 ${isVisible ? 'animate__animated animate__fadeInLeft animate__delay-1s' : ''}`}>
            <div className="section-title text-center">
              <h3>Mass Schedule</h3>
            </div>
            {props.scheduleData && props.scheduleData.length > 0 ? (
              <div className="table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.scheduleData.map((item, index) => (
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
          
          {/* Right side - Parish Priests */}
          <div className={`col-md-6 ${isVisible ? 'animate__animated animate__fadeInRight animate__delay-1s' : ''}`}>
            <div className="section-title text-center">
              <h3>Parish Priests</h3>
            </div>
            <div className="row">
              {props.data
                ? props.data.map((priest, i) => (
                    <div 
                      key={`${priest.name}-${i}`} 
                      className={`col-md-12 ${isVisible ? `animate__animated animate__fadeInUp animate__delay-${i}s` : ''}`}
                    >
                      <div className="priest-card">
                        <div className="priest-image">
                          <img src={priest.img} alt={priest.name} />
                        </div>
                        <div className="priest-content">
                          <h4>{priest.name}</h4>
                          <p>{priest.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                : "loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};