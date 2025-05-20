import React from "react";

const Schedule = ({ data }) => {
  return (
    <div id="schedule">
      <div className="container">
        <br></br>
        <br></br>
        <br></br>
        <div className="section-title text-center">
          <h2>Mass Schedule</h2>
        </div>
        {data && data.length > 0 ? (
          <div className="table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Language</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
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
    </div>
  );
};

export default Schedule;


