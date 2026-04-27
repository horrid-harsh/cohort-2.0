import React from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
