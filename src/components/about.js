import React, { useRef, useState, useEffect } from "react";
import "animate.css";
export const About = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <div id="about" ref={aboutRef}>
      <div className="container">
        <div className={`row ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-05s' : ''}`}>
          <div className="col-xs-12 col-md-6">
            <img src="img/altar.jpg" className={`img-responsive ${isVisible ? 'animate__animated animate__fadeInLeft animate__delay-05s' : ''}`} alt="" />
          </div>
          <div className="col-xs-12 col-md-6">
            <div className={`about-text ${isVisible ? 'animate__animated animate__fadeInRight animate__delay-05s' : ''}`}>
              <h2>About Us</h2>
              <p>
                Welcome to the Diocesan Shrine and Parish of Saint Joseph — a
                spiritual sanctuary nestled in the heart of Quezon City, under
                the care of the Diocese of Cubao.
              </p>
              <p>
                Established on November 23, 1951, our parish began as a humble
                mission to serve the growing faith community in the newly
                developed government housing projects of Project 3. Over the
                decades, it has blossomed into a vibrant center of worship,
                formation, and community outreach. In 1999, the church was
                honored with the title of Archdiocesan Shrine by Cardinal Jaime
                Sin, and later became part of the Diocese of Cubao when it was
                formally established in 2003.
              </p>
              <p>
                Our shrine is dedicated to Saint Joseph, Husband of Mary, the
                silent yet steadfast protector of the Holy Family. His feast day
                is joyfully celebrated every March 19, drawing parishioners and
                pilgrims alike. A revered image of Saint Joseph — lovingly
                crafted by renowned sculptor Maximo Vicente — stands at the
                heart of our sanctuary, symbolizing our devotion and trust in
                his intercession.
              </p>
              <p>Come and be part of our growing parish family.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
