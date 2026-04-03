import { useState, useCallback } from "react";
import { useSaves, LIMIT, useBulkDeleteSaves } from "../hooks/useSaves";
import SaveCard from "./SaveCard";
import SaveSkeleton from "./SaveSkeleton";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import SelectionToolbar from "./SelectionToolbar";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";
import styles from "./SaveGrid.module.scss";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Articles", value: "article" },
  { label: "Videos", value: "video" },
  { label: "Tweets", value: "tweet" },
  { label: "PDFs", value: "pdf" },
  { label: "Images", value: "image" },
];

const SaveGrid = ({ search, isFavorite, isArchived, semantic }) => {
  const [activeType, setActiveType] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSaves({
    ...(activeType && { type: activeType }),
    ...(search && { search }),
    ...(isFavorite && { isFavorite: true }),
    ...(isArchived !== undefined && { isArchived }),
    ...(semantic && { semantic: true }),
  });

  const { mutate: deleteBulk } = useBulkDeleteSaves();

  const saves = data?.saves || [];

  // Derived state
  const isSelectionMode = selectedIds.size > 0;

  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setShowConfirm(false);
  }, []);

  const handleDeleteMany = () => {
    if (selectedIds.size === 0) return;
    deleteBulk(Array.from(selectedIds), {
      onSuccess: () => {
        toast.success(`Deleted ${selectedIds.size} saves`);
        clearSelection();
      },
    });
  };

  // Trigger next page when sentinel div enters viewport
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScroll(onIntersect, hasNextPage);

  return (
    <div className={styles.wrap}>
      {semantic && search && (
        <div className={styles.semanticBanner}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
          Showing AI semantic results for <strong>"{search}"</strong>
        </div>
      )}

      <div className={`${styles.filters} no-select`}>
        <div className={styles.filterContent}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.chip} ${activeType === f.value ? styles.active : ""}`}
              onClick={() => setActiveType(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <SaveSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && saves.length === 0 && (
        <div className={styles.empty}>
          <p>Nothing here yet.</p>
          <span>
            {isFavorite
              ? "Heart a save to see it here."
              : isArchived
              ? "Archived saves will appear here."
              : semantic
              ? "No semantic matches found. Try a different search."
              : 'Hit "+ New" to add your first save.'}
          </span>
        </div>
      )}

      {!isLoading && saves.length > 0 && (
        <>
          <div className={styles.grid}>
            {saves.map((save) => (
              <SaveCard
                key={save._id}
                save={save}
                isSelected={selectedIds.has(save._id)}
                isSelectionMode={isSelectionMode}
                onToggleSelect={() => toggleSelection(save._id)}
              />
            ))}
            {isFetchingNextPage && Array.from({ length: LIMIT }).map((_, i) => (
              <SaveSkeleton key={`skeleton-${i}`} />
            ))}
          </div>

          {/* Sentinel — invisible div at bottom, triggers next page load */}
          {!isFetchingNextPage && <div ref={sentinelRef} className={styles.sentinel} />}

          {!hasNextPage && saves.length > 0 && (
            <div className={styles.endMessage}>
              You've seen all {saves.length} saves
            </div>
          )}
        </>
      )}
      {/* Bulk Delete Toolbar */}
      <SelectionToolbar
        count={selectedIds.size}
        onCancel={clearSelection}
        onDelete={() => setShowConfirm(true)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm && selectedIds.size > 0}
        title="Delete multiple saves"
        message={`This will permanently delete ${selectedIds.size} items. This action cannot be undone.`}
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleDeleteMany}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default SaveGrid;