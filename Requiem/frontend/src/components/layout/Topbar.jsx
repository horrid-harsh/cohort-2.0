import { useState } from "react";
import SaveModal from "../../features/saves/components/SaveModal";
import styles from "./Topbar.module.scss";

const Topbar = ({ onSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search your saves..."
            className={styles.searchInput}
            value={searchValue}
            onChange={handleSearch}
          />
        </div>

        <button
          className={styles.saveBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Save URL
        </button>
      </div>

      <SaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Topbar;
