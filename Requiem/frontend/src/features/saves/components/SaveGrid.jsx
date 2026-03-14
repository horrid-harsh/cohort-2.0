import { useState } from "react";
import { useSaves } from "../hooks/useSaves";
import SaveCard from "./SaveCard";
import styles from "./SaveGrid.module.scss";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Articles", value: "article" },
  { label: "Videos", value: "video" },
  { label: "Tweets", value: "tweet" },
  { label: "PDFs", value: "pdf" },
  { label: "Images", value: "image" },
];

const SaveGrid = ({ search }) => {
  const [activeType, setActiveType] = useState("");

  const { data, isLoading, isFetching, error } = useSaves({
    ...(activeType && { type: activeType }),
    ...(search && { search }),
  });

  const saves = data?.saves || [];

  return (
    <div className={styles.wrap}>
      {/* Filter chips */}
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
      </div>

      {/* States */}
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

      {error && (
        <div className={styles.state}>Failed to load saves.</div>
      )}

      {!isLoading && !isFetching && !error && saves.length === 0 && (
        <div className={styles.empty}>
          <p>Nothing saved yet.</p>
          <span>Hit "Save URL" to add your first one.</span>
        </div>
      )}

      {/* Grid */}
      {saves.length > 0 && (
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
