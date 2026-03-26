import { useState, useRef, useEffect } from "react";
import SaveModal from "../../features/saves/components/SaveModal";
import CreateCollectionModal from "../ui/CreateCollectionModal";
import CreateTagModal from "../ui/CreateTagModal";
import styles from "./Topbar.module.scss";

const Topbar = ({ onSearch, onSemanticChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSemantic, setIsSemantic] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNewOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleSemanticToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isSemantic;
    setIsSemantic(next);
    onSemanticChange?.(next);
  };

  const openCollection = () => { setIsNewOpen(false); setShowCollection(true); };
  const openTag = () => { setIsNewOpen(false); setShowTag(true); };
  const openSave = () => { setIsNewOpen(false); setIsModalOpen(true); };

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.leftSpacer} />
        <div className={`${styles.searchWrap} no-select`}>
          <svg className={`${styles.searchIcon} no-select`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={isSemantic ? "Search by meaning..." : "Search your saves..."}
            className={styles.searchInput}
            value={searchValue}
            onChange={handleSearch}
          />
          <button
            className={`${styles.semanticBtn} ${isSemantic ? styles.semanticActive : ""}`}
            onClick={handleSemanticToggle}
            title={isSemantic ? "Switch to keyword search" : "Switch to AI semantic search"}
          >
            AI
          </button>
        </div>

        <div className={styles.btnGroup}>
          <div className={styles.dropdownWrap} ref={dropdownRef}>
            <button className={`${styles.newBtn} no-select`} onClick={() => setIsNewOpen((p) => !p)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: isNewOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isNewOpen && (
              <div className={`${styles.dropdown} no-select`}>
                <button className={styles.dropItem} onClick={openSave}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Save URL
                </button>
                <button className={styles.dropItem} onClick={openCollection}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Collection
                </button>
                <button className={styles.dropItem} onClick={openTag}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  Tag
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <SaveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CreateCollectionModal isOpen={showCollection} onClose={() => setShowCollection(false)} />
      <CreateTagModal isOpen={showTag} onClose={() => setShowTag(false)} />
    </>
  );
};

export default Topbar;
