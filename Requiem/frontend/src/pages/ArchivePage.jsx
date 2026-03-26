import { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveGrid from "../features/saves/components/SaveGrid";
import styles from "./DashboardPage.module.scss";
import useDebounce from "../hooks/useDebounce";

const ArchivePage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  return (
    <PageWrapper>
      <Topbar onSearch={setSearch} />
      <div className={styles.page}>
        <div className={styles.contentPage}>
          <div className={styles.pageHeader}>
            <h1>Archive</h1>
            <p>Saves you've archived</p>
          </div>
        </div>
        <SaveGrid search={debouncedSearch} isArchived={true} />
      </div>
    </PageWrapper>
  );
};

export default ArchivePage;
