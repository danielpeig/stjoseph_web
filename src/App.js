import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'; // ✅ for v5
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import Services from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team.js";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

// Add this function to handle hash scrolling
function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    // If there's a hash in the URL
    if (location.hash) {
      // Get the element by id (without the #)
      const element = document.getElementById(location.hash.slice(1));
      
      // If the element exists, scroll to it
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]); // Re-run this effect when location changes

  return null;
}

const HomePage = ({ landingPageData }) => {
  return (
    <>
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} />
      <Contact data={landingPageData.Contact} />
    </>
  );
};

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      <Navigation />
      <ScrollToHashElement /> {/* Add this component */}
      <Switch>
        <Route exact path="/" render={() => <HomePage landingPageData={landingPageData} />} />
        <Route path="/team" render={() => <Team data={landingPageData.Team} />} />
      </Switch>
    </Router>
  );
};

export default App;
