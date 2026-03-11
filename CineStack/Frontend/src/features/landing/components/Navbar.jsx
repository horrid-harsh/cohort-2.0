import React from "react";
import { Link } from "react-router-dom";
import useNavbarScroll from "../../../shared/hooks/useNavbarScroll";

const Navbar = () => {
  const { isVisible, isAtTop } = useNavbarScroll();

  return (
    <nav
      className={`navbar ${!isVisible ? "nav-hidden" : ""} ${!isAtTop ? "nav-scrolled" : ""}`}
    >
      <div className="container nav-container">
        <Link to="/" className="logo">
          Cine<span>Stack</span>
        </Link>
        <div className="nav-links">
          <Link to="/login" className="btn btn-outline btn-login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
