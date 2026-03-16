import { useSession } from "../features/auth/hooks/useSession";

// Wrapper component that lives inside QueryClientProvider
// Handles session check before rendering anything
const SessionProvider = ({ children }) => {
  const { isLoading } = useSession();

  // Show nothing while checking session
  // This prevents flash of login page on refresh
  if (isLoading) return null;

  return children;
};

export default SessionProvider;