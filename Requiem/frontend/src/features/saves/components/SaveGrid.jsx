import { useState } from "react";
import { useSaves } from "../hooks/useSaves";
import SaveCard from "./SaveCard";
import styles from "./SaveGrid.module.scss";
import useDebounce from "../../../hooks/useDebounce";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Articles", value: "article" },
  { label: "Videos", value: "video" },
  { label: "Tweets", value: "tweet" },
  { label: "PDFs", value: "pdf" },
  { label: "Images", value: "image" },
];

const SaveGrid = ({ search, isFavorite, isArchived }) => {
  const [activeType, setActiveType] = useState("");

  const { data, isLoading, isFetching } = useSaves({
    ...(activeType && { type: activeType }),
    ...(search && { search }),
    ...(isFavorite && { isFavorite: true }),
    ...(isArchived !== undefined && { isArchived }),
  });

  const saves = data?.saves || [];

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`${styles.chip} ${activeType === f.value ? styles.active : ""}`}
            onClick={() => setActiveType(f.value)}
          >
            {f.label}
          </button>
        ))}
        {/* {!isLoading && isFetching && (
          <span className={styles.updating}>Updating...</span>
        )} */}
      </div>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeleton}>
              <div className={styles.skeletonThumb} />
              <div className={styles.skeletonBody}>
                <div className={styles.skeletonLine} style={{ width: "60%" }} />
                <div className={styles.skeletonLine} style={{ width: "90%" }} />
                <div className={styles.skeletonLine} style={{ width: "75%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && saves.length === 0 && (
        <div className={styles.empty}>
          <p>Nothing here yet.</p>
          <span>
            {isFavorite
              ? 'Heart a save to see it here.'
              : isArchived
              ? 'Archived saves will appear here.'
              : 'Hit "Save URL" to add your first one.'}
          </span>
        </div>
      )}

      {!isLoading && saves.length > 0 && (
        <div className={styles.grid}>
          {saves.map((save) => (
            <SaveCard key={save._id} save={save} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SaveGrid;
