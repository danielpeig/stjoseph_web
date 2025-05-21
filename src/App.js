import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import Schedule from "./components/Schedule";
import { About } from "./components/about";
import { Announcements } from "./components/announcements";
import Services from "./components/services";
import { Gallery } from "./components/gallery";
import { Priests } from "./components/Priests.js";
import { Team } from "./components/Team.js";
import { Contact } from "./components/contact";
import AdminDashboard from "./components/AdminDashboard";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]); 

  return null;
}

const HomePage = ({ landingPageData }) => {
  return (
    <>
      <Header data={landingPageData.Header} />
      <Announcements data={landingPageData.Announcements} />
      <About data={landingPageData.About} />
      <Priests data={landingPageData.Priests} scheduleData={landingPageData.Schedule} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Contact data={landingPageData.Contact} />
    </>
  );
};

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    const existingData = JsonData;
    
    if (!existingData.Announcements) {
      existingData.Announcements = {
        announcements: [
          {
            title: "Mass Schedule Update",
            content: "Beginning June 1st, we will add a new Mass time on Sundays at 5:00 PM to better serve our growing parish community."
          },
          {
            title: "Parish Festival",
            content: "Join us for our annual Parish Festival on July 8-10. Enjoy food, games, music, and fellowship as we celebrate our parish community."
          },
          {
            title: "Bible Study Group",
            content: "Our weekly Bible study meets every Thursday at 7:00 PM in the parish hall. All are welcome to join as we explore the Gospel of John."
          },
          {
            title: "Volunteer Opportunities",
            content: "We need volunteers for our upcoming outreach program. Please contact the parish office if you're interested in helping with this important ministry."
          }
        ]
      };
    }
    
    setLandingPageData(existingData);
  }, []);

  return (
    <Router>
      <Navigation />
      <ScrollToHashElement />
      <Switch>
        <Route exact path="/" render={() => <HomePage landingPageData={landingPageData} />} />
        <Route path="/team" render={() => <Team data={landingPageData.Team} />} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
      </Switch>
    </Router>
  );
};

export default App;