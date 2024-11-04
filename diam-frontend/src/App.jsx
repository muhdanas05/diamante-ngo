// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";

import Donate from "./components/Donate"; // Import Donate component
import Profile from "./components/Profile"; // Import Profile component

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <FeatureSection />
            
              <Footer />
            </>
          } />
          <Route path="/donate" element={<Donate />} /> {/* Route for Donate page */}
          <Route path="/profile" element={<Profile />} /> {/* Route for Profile page */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

