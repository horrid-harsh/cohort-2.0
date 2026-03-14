import { useState, useRef, useEffect } from "react";
import { useCollections } from "../../collections/hooks/useCollections";
import { useTags } from "../../tags/hooks/useTags";
import { useUpdateSave, useDeleteSave } from "../hooks/useSaves";
import axiosInstance from "../../../utils/axios.instance";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import styles from "./SaveCardMenu.module.scss";

const SaveCardMenu = ({ save }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("main");
  const [menuStyle, setMenuStyle] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: collections = [] } = useCollections();
  const { data: tags = [] } = useTags();
  const { mutate: updateSave } = useUpdateSave();
  const { mutate: deleteSave } = useDeleteSave();

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 180;
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;

      if (spaceOnRight >= menuWidth) {
        setMenuStyle({ left: 0, right: "auto" });
      } else if (spaceOnLeft >= menuWidth) {
        setMenuStyle({ right: 0, left: "auto" });
      } else {
        setMenuStyle({ left: "50%", transform: "translateX(-50%)" });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setView("main");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggleCollection = async (collectionId) => {
    const isAdded = save.collections?.some((c) => c._id === collectionId || c === collectionId);
    if (isAdded) {
      await axiosInstance.delete(`/collections/${collectionId}/saves/${save._id}`);
    } else {
      await axiosInstance.patch(`/collections/${collectionId}/saves/${save._id}`);
    }
    queryClient.invalidateQueries({ queryKey: ["saves"] });
    queryClient.invalidateQueries({ queryKey: ["collections"] });
  };

  const handleToggleTag = async (tagId) => {
    const isAdded = save.tags?.some((t) => t._id === tagId || t === tagId);
    if (isAdded) {
      await axiosInstance.delete(`/tags/${tagId}/saves/${save._id}`);
    } else {
      await axiosInstance.patch(`/tags/${tagId}/saves/${save._id}`);
    }
    queryClient.invalidateQueries({ queryKey: ["saves"] });
  };

  const handleArchive = () => {
    updateSave({ id: save._id, isArchived: !save.isArchived });
    setIsOpen(false);
  };

  const handleDeleteConfirmed = () => {
    deleteSave(save._id);
    setShowConfirm(false);
    setIsOpen(false);
  };

  const isInCollection = (colId) =>
    save.collections?.some((c) => c._id === colId || c === colId);

  const hasTag = (tagId) =>
    save.tags?.some((t) => t._id === tagId || t === tagId);

  return (
    <>
      <div className={styles.wrap} ref={menuRef}>
        <button
          ref={triggerRef}
          className={styles.trigger}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((p) => !p);
            setView("main");
          }}
          title="More options"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.menu} style={menuStyle} onClick={(e) => e.stopPropagation()}>
            {view === "main" && (
              <>
                <button className={styles.item} onClick={() => setView("collections")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Add to collection
                  <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <button className={styles.item} onClick={() => setView("tags")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  Add tag
                  <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <div className={styles.divider} />

                <button className={styles.item} onClick={handleArchive}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                  {save.isArchived ? "Unarchive" : "Archive"}
                </button>

                <button
                  className={`${styles.item} ${styles.danger}`}
                  onClick={() => { setIsOpen(false); setShowConfirm(true); }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                  Delete
                </button>
              </>
            )}

            {view === "collections" && (
              <>
                <div className={styles.subHeader}>
                  <button className={styles.backBtn} onClick={() => setView("main")}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  Collections
                </div>
                {collections.length === 0 ? (
                  <div className={styles.empty}>No collections yet</div>
                ) : (
                  collections.map((col) => (
                    <button
                      key={col._id}
                      className={`${styles.item} ${isInCollection(col._id) ? styles.selected : ""}`}
                      onClick={() => handleToggleCollection(col._id)}
                    >
                      <span>{col.emoji}</span>
                      <span className={styles.itemLabel}>{col.name}</span>
                      {isInCollection(col._id) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </>
            )}

            {view === "tags" && (
              <>
                <div className={styles.subHeader}>
                  <button className={styles.backBtn} onClick={() => setView("main")}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  Tags
                </div>
                {tags.length === 0 ? (
                  <div className={styles.empty}>No tags yet</div>
                ) : (
                  tags.map((tag) => (
                    <button
                      key={tag._id}
                      className={`${styles.item} ${hasTag(tag._id) ? styles.selected : ""}`}
                      onClick={() => handleToggleTag(tag._id)}
                    >
                      <span className={styles.tagDot} style={{ background: tag.color }} />
                      <span className={styles.itemLabel}>{tag.name}</span>
                      {hasTag(tag._id) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete save"
        message="This will permanently delete this save. This action cannot be undone."
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default SaveCardMenu;
