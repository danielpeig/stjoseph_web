import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "./image";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBfjYMkYdCPTKb0FyGIvKB2fVlbTdobi1s",
  authDomain: "stjoseph-website.firebaseapp.com",
  projectId: "stjoseph-website",
  storageBucket: "stjoseph-website.firebasestorage.app",
  messagingSenderId: "480997652051",
  appId: "1:480997652051:web:6421e76f23ed708fa5b8a6",
  measurementId: "G-PBK6DPK9Z7",
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const Gallery = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "gallery"));
        const items = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            title: d.title || "Untitled",
            smallImage: d.url,
            largeImage: d.url,
          };
        });
        setData(items);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchGalleryData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const calculateOffset = (items) => {
    const itemsInLastRow = items.length % 3;
    if (itemsInLastRow === 1) return "col-lg-offset-4";
    if (itemsInLastRow === 2) return "col-lg-offset-2";
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
            {currentItems.length > 0 ? (
              currentItems.map((d, i) => {
                const isLastRow = Math.floor(i / 3) === Math.floor((currentItems.length - 1) / 3);
                const isLastRowItem = isLastRow && i % 3 === (currentItems.length - 1) % 3;
                const needsOffset = isLastRowItem && currentItems.length % 3 !== 0;
                const offsetClass = needsOffset ? calculateOffset(currentItems.length) : "";

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
            ) : (
              <div className="col-md-12">Loading...</div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="row" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <div className="col-md-12 text-center">
              <button
                onClick={goToPrevPage}
                className="btn btn-primary"
                aria-label="Previous page"
                style={{
                  backgroundColor: "#2e93e6",
                  borderColor: "#2e93e6",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: "0",
                  marginRight: "15px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "none",
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <span
                style={{
                  display: "inline-block",
                  margin: "0 10px",
                  fontSize: "16px",
                  fontWeight: "normal",
                  color: "#555",
                }}
              >
                {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                className="btn btn-primary"
                aria-label="Next page"
                style={{
                  backgroundColor: "#2e93e6",
                  borderColor: "#2e93e6",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: "0",
                  marginLeft: "15px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "none",
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
