import { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveGrid from "../features/saves/components/SaveGrid";
import styles from "./DashboardPage.module.scss";
import useDebounce from "../hooks/useDebounce";

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [isSemantic, setIsSemantic] = useState(false);
  const debouncedSearch = useDebounce(search, isSemantic ? 800 : 400);

  return (
    <PageWrapper>
      <Topbar onSearch={setSearch} onSemanticChange={setIsSemantic} />
      <div className={styles.page}>
        <SaveGrid search={debouncedSearch} semantic={isSemantic} />
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
