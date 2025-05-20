import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "./image";

export const Gallery = ({ data = [] }) => {
  const itemsPerPage = 9; // 3x3 grid
  const [currentPage, setCurrentPage] = useState(0);
  
  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Get current items to display
  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  // Handle pagination
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Calculate if last row needs offset
  const calculateOffset = (items) => {
    const itemsInLastRow = items.length % 3;
    
    if (itemsInLastRow === 1) {
      return "col-lg-offset-4";
    }
    
    if (itemsInLastRow === 2) {
      return "col-lg-offset-2";
    }
    
    return "";
  };

  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Gallery</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>

        {/* Main gallery grid */}
        <div className="row">
          <div className="portfolio-items">
            {currentItems.length > 0 ? (
              currentItems.map((d, i) => {
                const isLastRow = Math.floor(i / 3) === Math.floor((currentItems.length - 1) / 3);
                const isLastRowItem = isLastRow && i % 3 === (currentItems.length - 1) % 3;
                const needsOffset = isLastRowItem && currentItems.length % 3 !== 0;
                const offsetClass = needsOffset ? calculateOffset(currentItems.length) : "";
                
                return (
                  <div
                    key={`${d.title}-${i}`}
                    className={`col-sm-6 col-md-4 col-lg-4 ${offsetClass}`}
                  >
                    <Image
                      title={d.title}
                      largeImage={d.largeImage}
                      smallImage={d.smallImage}
                    />
                  </div>
                );
              })
            ) : (
              <div className="col-md-12">Loading...</div>
            )}
          </div>
        </div>

        {/* Navigation controls */}
        {totalPages > 1 && (
          <div className="row" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <div className="col-md-12 text-center">
              <button 
                onClick={goToPrevPage}
                className="btn btn-primary"
                aria-label="Previous page"
                style={{
                  backgroundColor: "#2e93e6",
                  borderColor: "#2e93e6",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: "0",
                  marginRight: "15px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "none"
                }}
              >
                <ChevronLeft size={24} />
              </button>
              
              <span style={{ 
                display: "inline-block",
                margin: "0 10px",
                fontSize: "16px",
                fontWeight: "normal",
                color: "#555"
              }}>
                {currentPage + 1} / {totalPages}
              </span>
              
              <button
                onClick={goToNextPage}
                className="btn btn-primary"
                aria-label="Next page"
                style={{
                  backgroundColor: "#2e93e6",
                  borderColor: "#2e93e6",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: "0",
                  marginLeft: "15px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "none"
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}