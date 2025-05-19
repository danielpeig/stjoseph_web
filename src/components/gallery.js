import { Image } from "./image";
import React from "react";

export const Gallery = (props) => {
  const calculateOffset = (totalItems) => {
    // If the number of items isn't divisible by 3, calculate the offset for centering
    const itemsInLastRow = totalItems % 3;
    
    // Only apply offset if there's 1 item in the last row
    if (itemsInLastRow === 1) {
      // For Bootstrap grid, to center one item in a 3-item row, we need to offset by 4 columns
      // (12 columns total - 4 columns for the item) / 2 = 4 columns offset
      return "col-lg-offset-4";
    }
    
    // If there are 2 items in the last row, we offset by 2 columns
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
        <div className="row">
          <div className="portfolio-items">
            {props.data
              ? props.data.map((d, i) => {
                  // Add offset class to the last item if needed
                  const isLastItem = i === props.data.length - 1;
                  const needsOffset = isLastItem && props.data.length % 3 === 1;
                  const offsetClass = needsOffset ? calculateOffset(props.data.length) : "";
                  
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
              : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};