import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./RelatedSaves.module.scss";
import { getRelatedSavesApi } from "../services/saves.service";

const TYPE_COLORS = {
  article: "#378ADD",
  video:   "#D85A30",
  tweet:   "#1D9E75",
  pdf:     "#f87171",
  image:   "#D4537E",
  link:    "#888888",
};

const RelatedSaves = ({ saveId }) => {
  const navigate = useNavigate();

  const { data: related = [], isLoading } = useQuery({
    queryKey: ["related", saveId],
    queryFn: () => getRelatedSavesApi(saveId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return null;
  if (!related.length) return null;

  return (
    <div className={styles.wrap}>
      <h3 className={styles.heading}>Related saves</h3>
      <div className={styles.list}>
        {related.map((save) => (
          <div
            key={save._id}
            className={styles.item}
            onClick={() => navigate(`/saves/${save._id}`)}
          >
            {/* Thumbnail */}
            <div className={styles.thumb}>
              {save.thumbnail ? (
                <img src={save.thumbnail} alt={save.title} loading="lazy" />
              ) : (
                <div
                  className={styles.thumbPlaceholder}
                  style={{ color: TYPE_COLORS[save.type] || TYPE_COLORS.link }}
                >
                  {save.type?.[0]?.toUpperCase() || "L"}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={styles.info}>
              <p className={styles.title}>
                {save.title?.slice(0, 80) || save.url}
              </p>
              <div className={styles.meta}>
                <span className={styles.site}>{save.siteName}</span>
                {save.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag._id}
                    className={styles.tag}
                    style={{ color: tag.color, borderColor: `${tag.color}30` }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <svg
              className={styles.arrow}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedSaves;