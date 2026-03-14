import { useState, useEffect } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveGrid from "../features/saves/components/SaveGrid";
import styles from "./DashboardPage.module.scss";

const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  return (
    <PageWrapper>
      <Topbar onSearch={setSearch} />
      <div className={styles.page}>
        <SaveGrid search={debouncedSearch} />
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
