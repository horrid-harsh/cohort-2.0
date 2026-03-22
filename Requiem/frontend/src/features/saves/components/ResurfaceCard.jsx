import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styles from "./ResurfaceCard.module.scss";
import { getResurfaceSaveApi } from "../services/saves.service";

const TYPE_COLORS = {
  article: "#378ADD",
  video:   "#D85A30",
  tweet:   "#1D9E75",
  pdf:     "#f87171",
  image:   "#D4537E",
  link:    "#888888",
};

const timeAgo = (date) => {
  const now = new Date();
  const saved = new Date(date);
  const diffDays = Math.floor((now - saved) / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears >= 1) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  if (diffMonths >= 1) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const ResurfaceCard = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const { data: save, isLoading } = useQuery({
    queryKey: ["resurface"],
    queryFn: getResurfaceSaveApi,
    staleTime: 1000 * 60 * 30, // same save for 30 mins per session
    retry: false,
  });

  if (isLoading || !save || dismissed) return null;

  const typeColor = TYPE_COLORS[save.type] || TYPE_COLORS.link;

  return (
    <div className={styles.card}>
      <div className={styles.label}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        From {timeAgo(save.createdAt)}
      </div>

      <div className={styles.content} onClick={() => navigate(`/saves/${save._id}`)}>
        {save.thumbnail ? (
          <img
            src={save.thumbnail}
            alt={save.title}
            className={styles.thumb}
            loading="lazy"
          />
        ) : (
          <div className={styles.thumbPlaceholder} style={{ color: typeColor }}>
            {save.type?.[0]?.toUpperCase() || "L"}
          </div>
        )}

        <div className={styles.info}>
          <p className={styles.title}>{save.title || save.url}</p>
          <div className={styles.meta}>
            {save.siteName && <span className={styles.site}>{save.siteName}</span>}
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

        <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>

      <button
        className={styles.dismiss}
        onClick={() => setDismissed(true)}
        title="Dismiss"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
};

export default ResurfaceCard;