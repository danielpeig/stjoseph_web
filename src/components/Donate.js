import React, { useState, useEffect, useRef } from "react";
import "animate.css";
import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration
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
let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Convert image to base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Image compression function
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const Donate = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const donateRef = useRef(null);
  
  // Add this useEffect for scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [formState, setFormState] = useState({
    name: "",
    contactNumber: "",
    modeOfPayment: "",
    referenceNumber: "",
    donationAmount: "",
    proofOfPayment: null,
    agreeToTerms: false
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (donateRef.current) {
      observer.observe(donateRef.current);
    }

    return () => {
      if (donateRef.current) {
        observer.unobserve(donateRef.current);
      }
    };
  }, []);
  
  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      if (files[0]) {
        // Validate file type
        if (!files[0].type.startsWith('image/')) {
          Swal.fire({
            title: "Invalid File Type",
            text: "Please upload an image file (PNG, JPG, JPEG, etc.)",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#d33"
          });
          return;
        }

        // Validate file size (max 10MB)
        if (files[0].size > 10 * 1024 * 1024) {
          Swal.fire({
            title: "File Too Large",
            text: "Please upload an image smaller than 10MB",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#d33"
          });
          return;
        }
        
        // Show processing message for large files
        if (files[0].size > 1024 * 1024) { // 1MB
          Swal.fire({
            title: 'Processing Image...',
            text: 'Compressing image for optimal storage',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        }
        
        try {
          // Compress the image
          const compressedFile = await compressImage(files[0]);
          
          setFormState({
            ...formState,
            [name]: compressedFile
          });
          
          // Create image preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
            // Close loading if it was shown
            if (files[0].size > 1024 * 1024) {
              Swal.close();
            }
          };
          reader.readAsDataURL(compressedFile);
          
        } catch (error) {
          console.error('Error compressing image:', error);
          Swal.fire({
            title: "Image Processing Error",
            text: "There was an error processing your image. Please try a different image.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#d33"
          });
        }
      }
    } else if (type === "checkbox") {
      setFormState({
        ...formState,
        [name]: checked
      });
    } else if (name === "donationAmount") {
      // Only allow numbers and decimal point for donation amount
      const regex = /^\d*\.?\d*$/;
      if (value === "" || regex.test(value)) {
        setFormState({
          ...formState,
          [name]: value
        });
      }
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting form submission...');
    console.log('Form state:', formState);
    
    // Validate form
    if (!formState.agreeToTerms) {
      console.log('Terms not agreed to');
      Swal.fire({
        title: "Error!",
        text: "You must agree to the terms and conditions",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33"
      });
      return;
    }
    
    if (!formState.proofOfPayment) {
      console.log('No proof of payment uploaded');
      Swal.fire({
        title: "Error!",
        text: "Please upload proof of payment",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33"
      });
      return;
    }

    // Set submitting state
    setIsSubmitting(true);
    console.log('Setting submission state...');
    
    // Show progress dialog
    Swal.fire({
      title: 'Submitting Donation...',
      html: `
        <div>
          <p id="progress-text">Processing proof of payment...</p>
          <div style="width: 100%; background-color: #f0f0f0; border-radius: 10px; margin: 10px 0;">
            <div id="progress-bar" style="width: 0%; height: 20px; background-color: #4CAF50; border-radius: 10px; transition: width 0.3s;"></div>
          </div>
          <p id="progress-percent">0%</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false
    });
    
    try {
      console.log('Starting image processing...');
      // Convert image to base64 string
      let imageBase64 = "";
      let originalFileName = "";
      let compressedFileSize = 0;
      
      // Update progress
      const updateProgress = (percent, text) => {
        const progressBar = document.getElementById('progress-bar');
        const progressPercent = document.getElementById('progress-percent');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressPercent) progressPercent.textContent = percent + '%';
        if (progressText) progressText.textContent = text;
      };

      updateProgress(20, 'Converting image to secure format...');
      
      if (formState.proofOfPayment) {
        originalFileName = formState.proofOfPayment.name || 'proof_of_payment.jpg';
        console.log('Converting image to base64...');
        imageBase64 = await convertToBase64(formState.proofOfPayment);
        compressedFileSize = formState.proofOfPayment.size;
        console.log('Image processed successfully', {
          fileName: originalFileName,
          fileSize: compressedFileSize
        });
      }

      updateProgress(60, 'Preparing donation data...');
      
      console.log('Checking Firebase connection...');
      
      // Test if db is properly initialized
      if (!db) {
        throw new Error('Firebase database not initialized');
      }
      
      updateProgress(80, 'Saving donation details...');
      console.log('Saving to Firestore...');
      
      // Save donation data to Firestore with image
      const donationData = {
        name: formState.name,
        contactNumber: formState.contactNumber,
        modeOfPayment: formState.modeOfPayment,
        referenceNumber: formState.referenceNumber || "",
        donationAmount: formState.donationAmount || "",
        proofOfPaymentBase64: imageBase64,
        proofOfPaymentFileName: originalFileName,
        proofOfPaymentSize: compressedFileSize,
        timestamp: serverTimestamp(),
        status: 'pending'
      };
      
      console.log('Donation data to save (without base64 for logging):', {
        ...donationData,
        proofOfPaymentBase64: '[BASE64_DATA]'
      });
      
      const docRef = await addDoc(collection(db, "donations"), donationData);
      console.log('Document saved successfully with ID:', docRef.id);
      
      updateProgress(100, 'Complete!');
      
      // Show success message
      setTimeout(() => {
        Swal.fire({
          title: "Thank You!",
          text: "Your donation has been submitted successfully. We will process it shortly.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6"
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to homepage
            window.location.href = '/';
          }
        });
      }, 500);
      
      // Reset form
      setFormState({
        name: "",
        contactNumber: "",
        modeOfPayment: "",
        referenceNumber: "",
        donationAmount: "",
        proofOfPayment: null,
        agreeToTerms: false
      });
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error in submission:', error);
      console.log('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      let errorMessage = "There was a problem submitting your donation. Please try again.";
      
      // More specific error messages
      if (error.code === 'permission-denied') {
        errorMessage = "Permission denied. Please check your Firebase security rules.";
      } else if (error.code === 'unavailable') {
        errorMessage = "Service temporarily unavailable. Please try again later.";
      } else if (error.message.includes('Firebase')) {
        errorMessage = "Firebase connection error. Please check your internet connection.";
      } else if (error.message.includes('quota')) {
        errorMessage = "Storage limit reached. Please try with a smaller image.";
      }
      
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33"
      });
    } finally {
      console.log('Submission process completed');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="donate" ref={donateRef}>
      <div className="container">
        <div className={`section-title text-center ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-05s' : ''}`}>
          <h2>Make a Donation</h2>
          <p>Your generous donations help support our church's mission and community outreach programs.</p>
        </div>
        
        {/* Form Container with Animation */}
        <div className={`donation-card-container ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-1s' : ''}`}>
          <div className="row">
            {/* Form Column */}
            <div className="col-md-8">
              <form name="donationForm" onSubmit={handleSubmit} className="donation-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control input-lg"
                        placeholder="Your Name"
                        required
                        onChange={handleChange}
                        value={formState.name}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="contactNumber">Contact Number <span className="text-danger">*</span></label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        className="form-control input-lg"
                        placeholder="Your Contact Number"
                        required
                        onChange={handleChange}
                        value={formState.contactNumber}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="modeOfPayment">Mode of Payment <span className="text-danger">*</span></label>
                      <select
                        id="modeOfPayment"
                        name="modeOfPayment"
                        className="form-control input-lg"
                        required
                        onChange={handleChange}
                        value={formState.modeOfPayment}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="gcash">GCash</option>
                        <option value="paymaya">PayMaya</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="donationAmount">Donation Amount</label>
                      <input
                        type="text"
                        id="donationAmount"
                        name="donationAmount"
                        className="form-control input-lg"
                        placeholder="Enter amount (PHP)"
                        onChange={handleChange}
                        value={formState.donationAmount}
                        disabled={isSubmitting}
                      />
                      <small className="text-muted">Specify the amount you donated</small>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                    <label htmlFor="proofOfPayment">Proof of Payment <span className="text-danger">*</span></label>
                      <div className="custom-file-upload">
                        <input
                          type="file"
                          id="proofOfPayment"
                          name="proofOfPayment"
                          className="form-control"
                          accept="image/*"
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <small className="text-muted">Upload a screenshot or photo of your payment receipt.</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="referenceNumber">Reference Number</label>
                      <input
                        type="text"
                        id="referenceNumber"
                        name="referenceNumber"
                        className="form-control input-lg"
                        placeholder="Payment Reference Number"
                        onChange={handleChange}
                        value={formState.referenceNumber}
                        disabled={isSubmitting}
                      />
                      <small className="text-muted">Required for Online Payments.</small>
                    </div>
                  </div>
                  
                </div>

                <div className="form-group terms-container">
                  <div className="checkbox">
                    <label>
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formState.agreeToTerms}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                      I agree to the <a data-toggle="modal" data-target="#termsModal" className="terms-link">Terms and Conditions</a> and <a data-toggle="modal" data-target="#privacyModal" className="terms-link">Data Privacy Policy</a>
                    </label>
                  </div>
                </div>
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn btn-custom btn-lg btn-block"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Submit Donation"}
                  </button>
                </div>
              </form>
            </div>
            
            {/* QR Code Column */}
            <div className="col-md-4">
              <div className="qr-code-card">
                <div className="card">
                  <div className="card-header text-center">
                  </div>
                  <div className="card-body text-center">
                    <div className="qr-code-container">
                      <img 
                        src="/img/donate.jpg"
                        alt="QR Code"
                        className="qr-code-image"
                      />
                      <p className="qr-code-text">Scan this QR code with your payment <br></br>app to make a donation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Terms and Conditions Modal */}
        <div className="modal fade" id="termsModal" tabIndex="-1" role="dialog" aria-labelledby="termsModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="termsModalLabel">Terms and Conditions</h4>
              </div>
              <div className="modal-body">
                <p>By submitting this donation form, you agree to the following terms:</p>
                <ol>
                  <li>All donations are voluntary and non-refundable.</li>
                  <li>The information provided will be used solely for processing your donation.</li>
                  <li>St. Joseph Shrine reserves the right to verify donation information.</li>
                  <li>Proof of payment images will be stored securely and used only for verification purposes.</li>
                  <li>St. Joseph Shrine may contact you regarding your donation using the contact information provided.</li>
                </ol>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy Policy Modal */}
        <div className="modal fade" id="privacyModal" tabIndex="-1" role="dialog" aria-labelledby="privacyModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="privacyModalLabel">Data Privacy Policy</h4>
              </div>
              <div className="modal-body">
                <p>St. Joseph Shrine is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
                <h5>Information Collection</h5>
                <p>We collect personal information such as name, contact number, payment details, and proof of payment images for donation processing purposes only.</p>
                <h5>Information Use</h5>
                <p>Your information will be used to:</p>
                <ul>
                  <li>Process and verify your donation</li>
                  <li>Issue receipts or acknowledgments</li>
                  <li>Maintain donation records</li>
                  <li>Contact you regarding your donation if necessary</li>
                </ul>
                <h5>Information Protection</h5>
                <p>We implement appropriate security measures to protect your personal information and uploaded images.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Donate;