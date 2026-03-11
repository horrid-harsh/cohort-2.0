import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Navbar from "./components/Navbar";
import "./landing.scss";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <footer className="footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} CineStack. Your Personal Cinema
            Library.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
