import React from "react";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";


export const Navigation = (props) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isTeamPage = location.pathname === "/team";
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
          <a className="navbar-brand page-scroll" href={isHomePage ? "#page-top" : "/"}>
            St. Joseph Shrine
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li className={isHomePage ? "active" : ""}>{isHomePage ? <a href="#announcements" className="page-scroll">Announcements</a> : <Link to="/#announcements">Announcements</Link>}</li>
            <li className={isHomePage ? "active" : ""}>{isHomePage ? <a href="#about" className="page-scroll">About</a> : <Link to="/#about">About</Link>}</li>
            <li className={isHomePage ? "active" : ""}>{isHomePage ? <a href="#services" className="page-scroll">Services</a> : <Link to="/#services">Services</Link>}</li>
            <li className={isHomePage ? "active" : ""}>{isHomePage ? <a href="#portfolio" className="page-scroll">Gallery</a> : <Link to="/#portfolio">Gallery</Link>}</li>
            <li className={isHomePage ? "active" : ""}>{isHomePage ? <a href="#testimonials" className="page-scroll">Schedule</a> : <Link to="/#testimonials">Schedule</Link>}</li>
            <li className={isHomePage ? "active" : ""}>{isHomePage ? <a href="#contact" className="page-scroll">Contact</a> : <Link to="/#contact">Contact</Link>}</li>
            <li className={isTeamPage ? "active" : ""}><Link to="/team">Dev Team</Link></li>            
            <li><button className="nav-button" onClick={handleImagePopup}><strong>Donate</strong></button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};