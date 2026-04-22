import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Loader from "../../shared/Loader";

const Logout = () => {
  const { handleLogout } = useAuth();

  useEffect(() => {
    // Immediate logout on mount
    handleLogout();
  }, [handleLogout]);

  // Show a quick loader while the session is being cleared
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </div>
  );
};

export default Logout;
