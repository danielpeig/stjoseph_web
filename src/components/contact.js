import { useState } from "react";
import React from "react";
import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

export const Contact = (props) => {
  // Firebase configuration - replace with your own config
  const firebaseConfig = {
    apiKey: "AIzaSyBfjYMkYdCPTKb0FyGIvKB2fVlbTdobi1s",
    authDomain: "stjoseph-website.firebaseapp.com",
    projectId: "stjoseph-website",
    storageBucket: "stjoseph-website.firebasestorage.app",
    messagingSenderId: "480997652051",
    appId: "1:480997652051:web:6421e76f23ed708fa5b8a6",
    measurementId: "G-PBK6DPK9Z7"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "831277f0-4ed7-4dc2-ae94-d159bffafffa");

    try {
      // First, save to Firebase
      try {
        await addDoc(collection(db, "contactSubmissions"), {
          name: formState.name,
          email: formState.email,
          message: formState.message,
          timestamp: serverTimestamp()
        });
        console.log("Submission saved to Firebase");
      } catch (firebaseError) {
        console.error("Firebase error:", firebaseError);
        // Continue with Web3Forms even if Firebase fails
      }

      // Then, submit to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Show success SweetAlert
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
        // Show error SweetAlert
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
      // Show error SweetAlert for network/other errors
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
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Contact us Now!</h2>
                <p>
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form name="sentMessage" onSubmit={onSubmit}>
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
          <div className="col-md-3 col-md-offset-1 contact-info">
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
    </div>
  );
};