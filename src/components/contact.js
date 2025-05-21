import React, { useState, useEffect, useRef } from "react";
import "animate.css";
import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, limit, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfjYMkYdCPTKb0FyGIvKB2fVlbTdobi1s",
  authDomain: "stjoseph-website.firebaseapp.com",
  projectId: "stjoseph-website",
  storageBucket: "stjoseph-website.firebasestorage.app",
  messagingSenderId: "480997652051",
  appId: "1:480997652051:web:6421e76f23ed708fa5b8a6",
  measurementId: "G-PBK6DPK9Z7"
};

let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const Contact = (props) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [result, setResult] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current);
      }
    };
  }, []);
  
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  const handleAdminPasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };
  
  const toggleAdminForm = () => {
    setShowAdminForm(!showAdminForm);
    setAdminMessage("");
  };
  
  const checkAdminPassword = () => {
    const correctPassword = "l@t0m";
    
    console.log("Checking password:", adminPassword, "against:", correctPassword);
    
    if (adminPassword === correctPassword) {
      setAdminMessage("Admin login successful");
      Swal.fire({
        title: "Success!",
        text: "Admin login successful",
        icon: "success",
        confirmButtonText: "Continue to Admin Panel",
        confirmButtonColor: "#3085d6"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/admin-dashboard';
        }
      });
    } else {
      setAdminMessage("Incorrect password");
      Swal.fire({
        title: "Error!",
        text: "Incorrect password",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33"
      });
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "831277f0-4ed7-4dc2-ae94-d159bffafffa");

    try {
      try {
        if (db) {
          await addDoc(collection(db, "contactSubmissions"), {
            name: formState.name,
            email: formState.email,
            message: formState.message,
            timestamp: serverTimestamp()
          });
          console.log("Submission saved to Firebase");
        } else {
          console.error("Firebase database not initialized");
        }
      } catch (firebaseError) {
        console.error("Firebase error:", firebaseError);
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Your message has been sent successfully. We'll get back to you soon!",
          icon: "success",
          confirmButtonText: "Confirm",
          confirmButtonColor: "#3085d6"
        });
        
        setResult("");
        event.target.reset();
        setFormState({ name: "", email: "", message: "" });
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#d33"
        });
        
        console.log("Error", data);
        setResult(data.message || "Failed to submit form");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Connection error. Please check your internet and try again.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33"
      });
      
      console.error("Submission error:", error);
      setResult("Failed to submit form. Check your connection.");
    }
  };

  return (
    <div>
      <div id="contact" ref={contactRef}>
        <div className="container">
          <div className="col-md-8">
            <div className="row">
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
              <div className={`section-title ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-05s' : ''}`}>
                <h2>Contact us Now!</h2>
                <p>
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form name="sentMessage" onSubmit={onSubmit} className={isVisible ? 'animate__animated animate__fadeInUp animate__delay-1s' : ''}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        required
                        onChange={handleChange}
                        value={formState.name}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                        value={formState.email}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    required
                    onChange={handleChange}
                    value={formState.message}
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <div id="success">{result && <p>{result}</p>}</div>
                <button type="submit" className="btn btn-custom btn-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className={`col-md-3 col-md-offset-1 contact-info ${isVisible ? 'animate__animated animate__fadeInRight animate__delay-15s' : ''}`}>
          <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="contact-item">
              <h3>Contact Info</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Address
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Phone
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"}>
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer" className="py-4 bg-blue-500 text-white">
        <div className="container mx-auto text-center">
          <p className="mb-1">© 2025 Company Name. All Rights Reserved.</p>
          <p className="mb-1">
            <span 
              className="cursor-pointer" 
              onClick={toggleAdminForm} 
              title="Company Information">
              965 Aurora Blvd, Project 3, Quezon City
            </span>
          </p>
          {showAdminForm && (
            <div className="mt-3 max-w-xs mx-auto">
              <input
                type="password"
                value={adminPassword}
                onChange={handleAdminPasswordChange}
                placeholder="Admin Password"
                className="px-3 py-1 text-black rounded w-full mb-2"
              />
              <button
                onClick={checkAdminPassword}
                className="bg-white text-blue-500 px-3 py-1 rounded">
                Login
              </button>
              {adminMessage && (
                <p className="mt-2 text-sm text-white bg-opacity-70 p-1 rounded">
                  {adminMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};