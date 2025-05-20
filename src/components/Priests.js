import React from "react";

export const Priests = (props) => {
  return (
    <div id="priests">
      <div className="container">
        <div className="section-title text-center">
          <h2>Our Parish Priests</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((priest, i) => (
                <div key={`${priest.name}-${i}`} className="col-md-4">
                  <div className="priest-card">
                    <div className="priest-image">
                      <img src={priest.img} alt={priest.name} />
                    </div>
                    <div className="priest-content">
                      <h4>{priest.name}</h4>
                      <p>{priest.description}</p> {/* ✅ This shows the description */}
                    </div>
                  </div>
                </div>
              ))
            : "loading..."}
        </div>
      </div>
    </div>
  );
};