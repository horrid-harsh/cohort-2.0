import React, { useState, useEffect, useRef } from "react";
import "../../shared/style/navbar.scss";
import logo from "../../../assets/logo_cropped.png";
import useAuth from "../../auth/hooks/useAuth";

const Navbar = () => {
  const { user, handleLogoutUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Attach scroll listener to the scrollable root container
      const scrollContainer = document.querySelector("#root") || window;
      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isDropdownOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Moodify Logo" />
          <span>Moodify</span>
        </div>

        <div className="navbar-profile" ref={profileRef}>
          <div
            className="profile-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="profile-icon">
              <i className="ri-user-fill"></i>
            </div>
            <i
              className={`ri-arrow-down-s-line chevron ${isDropdownOpen ? "rotate" : ""}`}
            ></i>
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown glass-card">
              <div className="user-info">
                <p className="username">{user?.username || "User"}</p>
                <p className="email">{user?.email || "user@example.com"}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="logout-btn" onClick={handleLogoutUser}>
                <i className="ri-logout-box-r-line"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
