import { useSession } from "../features/auth/hooks/useSession";
import useAuthStore from "../features/auth/store/auth.store";

// Wrapper component that lives inside QueryClientProvider
// Handles session check before rendering anything
const SessionProvider = ({ children }) => {
  const { isLoading } = useSession();
  const isSessionChecked = useAuthStore((s) => s.isSessionChecked);

  // Show nothing while checking session or while the store is pending initial sync
  // This prevents flash of login page on refresh
  if (isLoading || !isSessionChecked) return null;

  return children;
};

export default SessionProvider;