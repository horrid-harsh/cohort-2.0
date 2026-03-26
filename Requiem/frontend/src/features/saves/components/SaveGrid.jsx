import { useState, useCallback } from "react";
import { useSaves, LIMIT } from "../hooks/useSaves";
import SaveCard from "./SaveCard";
import SaveSkeleton from "./SaveSkeleton";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
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

  const saves = data?.saves || [];

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
              <SaveCard key={save._id} save={save} />
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
    </div>
  );
};

export default SaveGrid;