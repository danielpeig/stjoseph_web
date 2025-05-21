import React from "react";

export const Priests = (props) => {
  return (
    <div id="priests">
      <div className="container">
        <div className="section-title text-center">
          <h2>Parish Information</h2>
        </div>
        <div className="row">
          {/* Left side - Mass Schedule */}
          <div className="col-md-6">
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
          <div className="col-md-6">
            <div className="section-title text-center">
              <h3>Parish Priests</h3>
            </div>
            <div className="row">
              {props.data
                ? props.data.map((priest, i) => (
                    <div key={`${priest.name}-${i}`} className="col-md-12">
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