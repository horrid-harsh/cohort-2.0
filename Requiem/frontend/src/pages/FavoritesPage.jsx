import { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveGrid from "../features/saves/components/SaveGrid";
import styles from "./DashboardPage.module.scss";
import useDebounce from "../hooks/useDebounce";

const FavoritesPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  return (
    <PageWrapper>
      <Topbar onSearch={setSearch} />
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1>Favorites</h1>
          <p>Things you've marked as favorite</p>
        </div>
        <SaveGrid search={debouncedSearch} isFavorite={true} />
      </div>
    </PageWrapper>
  );
};

export default FavoritesPage;
