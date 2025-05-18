import React from "react";
import Swal from "sweetalert2";

export const Navigation = (props) => {
  const handleImagePopup = () => {
    Swal.fire({
      title: "Thank You!",
      text: "All Donations will go to the Church's Foundation.",
      imageUrl: "img/donate.jpg",
      imageWidth: 320,
      imageHeight: 400,
      imageAlt: "Donate Image",
      confirmButtonText: "Close",
      confirmButtonColor: "#3085d6",
      background: "#fff"
    });
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            St. Joseph Shrine
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li><a href="#features" className="page-scroll">Programs</a></li>
            <li><a href="#about" className="page-scroll">About</a></li>
            <li><a href="#services" className="page-scroll">Services</a></li>
            <li><a href="#portfolio" className="page-scroll">Gallery</a></li>
            <li><a href="#testimonials" className="page-scroll">Schedule</a></li>
            <li><a href="#contact" className="page-scroll">Contact</a></li>
            <li><a href="#team" className="page-scroll">DevTeam</a></li>
            <li><button className="nav-button" onClick={handleImagePopup}><strong>Donate</strong></button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
