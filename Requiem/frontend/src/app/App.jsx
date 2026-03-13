import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "./QueryClient";
import Router from "./Router";
import useMediaQuery from "../hooks/useMediaQuery";
import MobileBlock from "../components/ui/MobileBlock";
import "../styles/main.scss";

const App = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (isMobile) return <MobileBlock />;

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
