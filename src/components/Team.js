import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import "animate.css";

export const Team = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const teamRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (teamRef.current) {
      observer.observe(teamRef.current);
    }

    return () => {
      if (teamRef.current) {
        observer.unobserve(teamRef.current);
      }
    };
  }, []);

  return (
    <div id="team" ref={teamRef}>
      <div className="container">
        <div className={`section-title text-center ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-05s' : ''}`}>
          <h2>Meet the Team</h2>
          <p>
            Our team of dedicated professionals brings years of experience and passion
            to every project. Get to know the people behind our success.
          </p>
        </div>
        
        <div className={`team-container ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-1s' : ''}`}>
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="team-member">
                  <div className="team-img-container">
                    <img src={d.img} alt={d.name} className="team-img" />
                    <div className="team-overlay"></div>
                    <div className="team-social">
                      {d.facebook && (
                        <a href={d.facebook}>
                          <Facebook size={16} />
                        </a>
                      )}
                      {d.twitter && (
                        <a href={d.twitter}>
                          <Twitter size={16} />
                        </a>
                      )}
                      {d.linkedin && (
                        <a href={d.linkedin}>
                          <Linkedin size={16} />
                        </a>
                      )}
                      {d.instagram && (
                        <a href={d.instagram}>
                          <Instagram size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="team-info">
                    <h4>{d.name}</h4>
                    <p className="role">{d.job}</p>
                  </div>
                </div>
              ))
            : "Loading team members..."}
        </div>
      </div>
    </div>
  );
};