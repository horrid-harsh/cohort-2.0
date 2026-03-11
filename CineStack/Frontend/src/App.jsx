import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import "./shared/global.scss";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/register"
          element={
            <div style={{ padding: "4rem", color: "white" }}>
              Registration Page Placeholder
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div style={{ padding: "4rem", color: "white" }}>
              Login Page Placeholder
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
