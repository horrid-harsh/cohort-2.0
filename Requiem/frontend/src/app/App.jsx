import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "./QueryClient";
import Router from "./Router";
import useMediaQuery from "../hooks/useMediaQuery";
import MobileBlock from "../components/ui/MobileBlock";
import "../styles/main.scss";
import SessionProvider from "./SessionProvider";

import { useEffect } from "react";
import Lenis from "lenis";

const App = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [isMobile]);

  if (isMobile) return <MobileBlock />;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Router />
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
