import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "./QueryClient";
import Router from "./Router";
import useMediaQuery from "../hooks/useMediaQuery";
import MobileBlock from "../components/ui/MobileBlock";
import "../styles/main.scss";
import SessionProvider from "./SessionProvider";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import useAuthStore from "../features/auth/store/auth.store";
import LiquidProgressLoader from "../components/common/Loading/LiquidProgressLoader";

const App = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSessionChecked = useAuthStore((s) => s.isSessionChecked);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId); // ✅ important
      lenis.destroy();
    };
}, [isMobile]);

  if (isMobile) return <MobileBlock />;

  return (
    <QueryClientProvider client={queryClient}>
      {showLoader && (
        <LiquidProgressLoader 
          isAppReady={isSessionChecked} 
          onComplete={() => setShowLoader(false)}
        />
      )}
      <SessionProvider>
        <Router />
      </SessionProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(24, 24, 27, 0.85)",
            backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "14px",
            padding: "12px 20px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#ffffff",
              secondary: "#000000",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#ffffff",
            },
          },
          loading: {
            style: {
              background: "rgba(24, 24, 27, 0.95)",
            }
          }
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
