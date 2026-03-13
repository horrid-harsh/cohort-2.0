import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // data stays fresh for 5 mins
      retry: 1,                     // retry failed requests once
      refetchOnWindowFocus: false,  // don't refetch when tab regains focus
    },
  },
});

export default queryClient;
