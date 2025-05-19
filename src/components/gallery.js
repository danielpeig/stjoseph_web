import { Image } from "./image";
import React from "react";

export const Gallery = (props) => {
  const calculateOffset = (totalItems) => {
    const itemsInLastRow = totalItems % 3;

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