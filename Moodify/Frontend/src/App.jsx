import React, { useContext } from "react";
import "./features/shared/global.scss";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";
import AuthContext from "./features/auth/auth.context";
import Loader from "./features/shared/components/Loader";

const AppContent = () => {
  const { isInitializing } = useContext(AuthContext);

  if (isInitializing) {
    return <Loader />;
  }

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
