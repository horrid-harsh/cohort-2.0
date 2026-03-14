import { useState } from "react";
import { useCreateTag } from "../../features/tags/hooks/useTags";
import styles from "./CreateModal.module.scss";

const COLORS = ["#7c6af7", "#378ADD", "#1D9E75", "#D85A30", "#D4537E", "#f87171", "#fbbf24", "#4ade80"];

const CreateTagModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#7c6af7");
  const { mutate: createTag, isPending, error, reset } = useCreateTag();

  const handleClose = () => {
    setName(""); setColor("#7c6af7");
    reset();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createTag({ name, color }, { onSuccess: handleClose });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New tag</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error.response?.data?.message || "Something went wrong"}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              placeholder="e.g. javascript"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label>Color</label>
            <div className={styles.colorRow}>
              {COLORS.map((c) => (
                <button
                  key={c} type="button"
                  className={`${styles.colorBtn} ${color === c ? styles.selected : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className={styles.preview}>
            <span className={styles.tagPreview} style={{ color, borderColor: `${color}40` }}>
              {name || "preview"}
            </span>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? "Creating..." : "Create tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTagModal;
