import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const Team = (props) => {
  return (
    <div id="team">
      <div className="container">
        <div className="section-title text-center">
          <h2>Meet the Team</h2>
          <p>
            Our team of dedicated professionals brings years of experience and passion
            to every project. Get to know the people behind our success.
          </p>
        </div>
        
        <div className="team-container">
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