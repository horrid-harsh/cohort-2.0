import promotionalImg from "../../../../assets/promotional.png";
import promotionalImg2 from "../../../../assets/promotional2.png";
import promotionalImg3 from "../../../../assets/promotional3.png";
import logo from "../../../../assets/logo.png";
import { useEffect, useState, useMemo } from "react";

const promotionalImages = [promotionalImg, promotionalImg2, promotionalImg3];

const AuthLayout = ({ children }) => {
      const [loaded, setLoaded] = useState(false);

     const randomImage = useMemo(() => {
    return promotionalImages[
      Math.floor(Math.random() * promotionalImages.length)
    ];
  }, []);

  
  return (
    <main>
      <div className="left">
        <div className="logo">
          <img src={logo} alt="Instagram logo" />
        </div>

        <div className="promotional-container">
          <h1>
            See everyday moments from your <br />
            <span className="cursive">close friends</span>.
          </h1>
          <img onLoad={()=> setLoaded(true)} className={`promo-img ${loaded ? "show" : ""}`} src={randomImage} alt="Promotional" />
        </div>
      </div>

      <div className="right">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
