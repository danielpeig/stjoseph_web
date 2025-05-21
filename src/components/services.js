import React, { useState, useEffect } from "react";
import "animate.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please reload the page.</p>;
    }

    return this.props.children;
  }
}

export default function ServicesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [autoSlideActive, setAutoSlideActive] = useState(true);

  const servicesData = [
    {
      name: "DSWD Workshop",
      text: "Empowering individuals and families through DSWD Workshops that provide practical guidance, support services, and life skills aligned with the church's mission of holistic development.",
      definition: "DSWD Workshop refers to church-led initiatives in partnership with or modeled after the Department of Social Welfare and Development (DSWD), aimed at delivering community-based programs such as livelihood training, parenting seminars, and social welfare education to uplift vulnerable and underserved groups.",
      images: ["img/DSWD.jpg", "img/DSWD (1).jpg", "img/DSWD (2).jpg"]    
    },
    {
      name: "Pan De San Jose",
      text: "Custom mobile application development for iOS and Android platforms to enhance your business reach and provide seamless user experiences.",
      definition: "App development is the process of creating software applications that run on mobile devices, involving coding, UI/UX design, testing, and deployment for various platforms.",
      images: ["img/pan-de-san-jose.JPG", "img/pan-de-san-jose(2).jpg", "img/pan-de-san-jose(1).jpg"]
    },
    {
      name: "Bloodletting Activity",
      text: "Strategic digital marketing services to boost your online presence, increase visibility, and drive targeted traffic to your business.",
      definition: "Digital marketing encompasses all marketing efforts that use digital channels such as search engines, social media, email, and websites to connect with current and prospective customers.",
      images: ["img/BLOODLETTING.jpg", "img/BLOODLETTING(1).jpg","img/BLOODLETTING(2).jpg"]
    },
    {
      name: "Paskong Puno ng Panalangin",
      text: "Secure and scalable cloud solutions to streamline your operations, increase efficiency, and reduce infrastructure costs.",
      definition: "Cloud services refer to a wide range of services delivered on demand to companies and customers over the internet. These services are designed to provide easy, affordable access to applications and resources without internal infrastructure or hardware.",
      images: ["img/CHRISTMAS.JPG", "img/CHRISTMAS(1).JPG", "img/CHRISTMAS(2).JPG" ]
    },
    {
      name: "Ambag ng Pasko",
      text: "Secure and scalable cloud solutions to streamline your operations, increase efficiency, and reduce infrastructure costs.",
      definition: "Cloud services refer to a wide range of services delivered on demand to companies and customers over the internet. These services are designed to provide easy, affordable access to applications and resources without internal infrastructure or hardware.",
      images: ["img/AMBAG.jpg", "img/AMBAG(2).jpg", "img/AMBAG(1).jpg"]
    }
  ];

  useEffect(() => {
    let interval;
    if (!transitioning && autoSlideActive && !isLightboxOpen) {
      interval = setInterval(() => {
        handleSlideChange((currentIndex === servicesData.length - 1) ? 0 : currentIndex + 1);
      }, 5000); 
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [servicesData.length, currentIndex, transitioning, autoSlideActive, isLightboxOpen]);

  const handleSlideChange = (newIndex) => {
    if (transitioning) return;
    
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setPhotoIndex(0); 
      setTimeout(() => {
        setTransitioning(false);
      }, 500); 
    }, 10);
  };

  const prevSlide = () => {
    handleSlideChange(currentIndex === 0 ? servicesData.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    handleSlideChange(currentIndex === servicesData.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    handleSlideChange(index);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setAutoSlideActive(false);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setAutoSlideActive(true);
  };

  const currentImages = servicesData[currentIndex]?.images || [];

  const customStyles = `
    /* Custom CSS for Services Carousel - with unique class names to avoid conflicts */
    .sc-wrapper {
      padding: 100px 0;
      background: linear-gradient(to right, #6372ff 0%, #5ca9fb 100%);
    }
    
    .sc-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    
    .sc-header {
      text-align: center;
      margin-bottom: 60px;
    }
    
    .sc-title {
      color: #fff;
      font-size: 36px;
      font-weight: 800;
      text-transform: uppercase;
      margin: 0 0 15px;
      position: relative;
      padding-bottom: 15px;
    }
    
    .sc-title::after {
      position: absolute;
      content: "";
      background: rgba(255, 255, 255, 0.3);
      height: 4px;
      width: 60px;
      bottom: 0;
      left: 50%;
      margin-left: -30px;
    }
    
    .sc-subtitle {
      color: rgba(255, 255, 255, 0.75);
      font-size: 18px;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .sc-carousel {
      position: relative;
      max-width: 1000px;
      margin: 0 auto;
      overflow: hidden;
    }
    
    .sc-slide {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
      transition: all 0.5s ease;
    }
    
    .sc-slide-transitioning {
      opacity: 0;
      transform: scale(0.95);
    }
    
    .sc-slide-active {
      opacity: 1;
      transform: scale(1);
    }
    
    .sc-slide-content {
      display: flex;
      flex-direction: column;
    }
    
    @media (min-width: 768px) {
      .sc-slide-content {
        flex-direction: row;
      }
    }
    
    .sc-image-container {
      flex: 1;
    }
    
    .sc-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 8px 8px 0 0;
      transition: transform 0.3s ease, filter 0.3s ease, blur 0.3s ease;
      cursor: pointer;
      position: relative;
    }

    .sc-image:hover {
      transform: scale(1.02);
      filter: brightness(0.8) blur(2px);
    }
    
    @media (min-width: 768px) {
      .sc-image {
        height: 100%;
        border-radius: 8px 0 0 8px;
      }
    }
    
    .sc-text-container {
      flex: 1;
      padding: 30px;
    }
    
    .sc-content-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .sc-service-title {
      font-size: 24px;
      font-weight: 600;
      color: black !important;
      margin-bottom: 15px;
    }
    
    .sc-service-text {
      color: gray !important;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    .sc-definition-box {
      background-color: #f8f9fa;
      border-left: 4px solid #5ca9fb;
      padding: 15px;
      margin-top: auto;
    }
    
    .sc-definition-title {
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }
    
    .sc-definition-text {
      color: gray !important;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .sc-nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(255, 255, 255, 0.9);
      color: #5ca9fb;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      z-index: 10;
    }
    
    .sc-nav-button:hover {
      background-color: #5ca9fb;
      color: #fff;
      box-shadow: 0 5px 15px rgba(92, 169, 251, 0.4);
    }
    
    .sc-prev {
      left: 10px;
    }
    
    .sc-next {
      right: 10px;
    }
    
    .sc-indicators {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    
    .sc-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      margin: 0 5px;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
    }
    
    .sc-indicator-active {
      background-color: #fff;
      width: 24px;
      border-radius: 10px;
    }
    
    .sc-indicator:hover:not(.sc-indicator-active) {
      background-color: rgba(255, 255, 255, 0.7);
    }

    /* Custom styles for smaller lightbox */
    :global(.ril__outer) {
      max-width: 80%;
      max-height: 80%;
      margin: auto;
    }
    
    :global(.ril__image) {
      max-width: 80%;
      max-height: 80%;
      margin: auto;
    }

    :global(.ril__outerAnimating) {
      animation: none !important;
    }
    
    :global(.ril__content) {
      max-width: 100%;
      max-height: 100%;
      margin: auto;
    }
    
    :global(.ril-image-current) {
      max-width: 100%;
      max-height: 100%;
      margin: auto;
    }
  `;

  return (
    <>
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      
      <div id="services" className="sc-wrapper">
        <div className="sc-container">
          <div className="sc-header">
            <h2 className="sc-title">Our Services</h2>
            <p className="sc-subtitle">We provide comprehensive solutions...</p>
          </div>

          <div className="sc-carousel">
            <div 
              className={`sc-slide ${transitioning ? "sc-slide-transitioning" : "sc-slide-active"}`}
            >
              <div className="sc-slide-content">
                <div className="sc-image-container">
                  {/* Only one image shown, click opens lightbox */}
                  <img
                    src={currentImages[0]}
                    alt={servicesData[currentIndex].name}
                    className="sc-image"
                    onClick={openLightbox}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <div className="sc-text-container">
                  <div className="sc-content-wrapper">
                    <h3 className="sc-service-title">{servicesData[currentIndex].name}</h3>
                    <p className="sc-service-text">{servicesData[currentIndex].text}</p>
                    <div className="sc-definition-box">
                      <h4 className="sc-definition-title">Definition:</h4>
                      <p className="sc-definition-text">{servicesData[currentIndex].definition}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={prevSlide} className="sc-nav-button sc-prev" disabled={transitioning}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="sc-nav-button sc-next" disabled={transitioning}>
              <ChevronRight size={20} />
            </button>

            <div className="sc-indicators">
              {servicesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`sc-indicator ${index === currentIndex ? "sc-indicator-active" : ""}`}
                  disabled={transitioning}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ErrorBoundary>
        {/* Lightbox with custom sizing */}
        {isLightboxOpen && currentImages && currentImages.length > 0 && (
          <Lightbox
            mainSrc={currentImages[photoIndex]}
            nextSrc={currentImages[(photoIndex + 1) % currentImages.length]}
            prevSrc={currentImages[(photoIndex + currentImages.length - 1) % currentImages.length]}
            onCloseRequest={closeLightbox}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + currentImages.length - 1) % currentImages.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % currentImages.length)
            }
            reactModalStyle={{
              overlay: { zIndex: 1500 },
              content: {
                maxWidth: '80%',
                maxHeight: '80%',
                margin: 'auto'
              }
            }}
            imageTitle={`${servicesData[currentIndex].name} (${photoIndex + 1}/${currentImages.length})`}
          />
        )}
      </ErrorBoundary>
    </>
  );
}

