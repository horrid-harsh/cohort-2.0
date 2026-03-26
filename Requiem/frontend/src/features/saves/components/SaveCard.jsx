import toast from "react-hot-toast";
import { useUpdateSave } from "../hooks/useSaves";
import { useNavigate } from "react-router-dom";
import SaveCardMenu from "./SaveCardMenu";
import styles from "./SaveCard.module.scss";

const TYPE_LABELS = {
  article: { label: "Article", color: "#378ADD", rgb: "136, 136, 136" },
  video:   { label: "Video",   color: "#D85A30", rgb: "136, 136, 136" },
  tweet:   { label: "Tweet",   color: "#1D9E75", rgb: "136, 136, 136" },
  pdf:     { label: "PDF",     color: "#f87171", rgb: "136, 136, 136" },
  image:   { label: "Image",   color: "#D4537E", rgb: "136, 136, 136" },
  link:    { label: "Link",    color: "#888888", rgb: "136, 136, 136" },
};

const SaveCard = ({ save }) => {
  const { mutate: updateSave } = useUpdateSave();
  const navigate = useNavigate();
  const typeInfo = TYPE_LABELS[save.type] || TYPE_LABELS.link;

  const toggleFavorite = (e) => {
    e.preventDefault();
    const nextFavorite = !save.isFavorite;
    updateSave({ id: save._id, isFavorite: nextFavorite });
    toast.success(nextFavorite ? "Added to favorites" : "Removed from favorites");
  };

  const handleOpen = () => {
    window.open(save.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className={`${styles.card} no-select`}
      style={{ "--type-color-rgb": typeInfo.rgb }}
    >
      {/* Thumbnail */}
      <div className={styles.thumb} onClick={handleOpen}>
        {save.thumbnail ? (
          <img src={save.thumbnail} alt={save.title} loading="lazy" />
        ) : (
          <div className={styles.thumbPlaceholder}>
            <span style={{ color: typeInfo.color }}>{typeInfo.label}</span>
          </div>
        )}
        <div
          className={styles.typeBadge}
          style={{ color: typeInfo.color, borderColor: `${typeInfo.color}30` }}
        >
          {typeInfo.label}
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.site}>
          {save.favicon && (
            <img src={save.favicon} alt="" width={12} height={12} />
          )}
          <span className="select-text">{save.siteName || new URL(save.url).hostname}</span>
        </div>

        <h3 className={styles.title} onClick={() => navigate(`/saves/${save._id}`)}>
          <span className="select-text">{save.title || save.url}</span>
        </h3>

        {save.note && <p className={`${styles.note} select-text`}>{save.note}</p>}

        {save.tags?.length > 0 && (
          <div className={styles.tags}>
            {save.tags.map((tag) => (
              <span
                key={tag._id}
                className={`${styles.tag} select-text`}
                style={{ color: tag.color, borderColor: `${tag.color}30` }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${save.isFavorite ? styles.favorited : ""}`}
          onClick={toggleFavorite}
          title={save.isFavorite ? "Unfavorite" : "Favorite"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={save.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <SaveCardMenu save={save} />
      </div>
    </div>
  );
};

export default SaveCard;
