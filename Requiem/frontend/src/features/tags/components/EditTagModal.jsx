import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTagApi } from "../services/tags.service";
import styles from "../../../components/ui/CreateModal.module.scss";

const COLORS = ["#7c6af7", "#378ADD", "#1D9E75", "#D85A30", "#D4537E", "#f87171", "#fbbf24", "#4ade80"];

const EditTagModal = ({ isOpen, onClose, tag }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#7c6af7");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (tag) {
      setName(tag.name || "");
      setColor(tag.color || "#7c6af7");
    }
  }, [tag]);

  const { mutate: updateTag, isPending, error } = useMutation({
    mutationFn: (data) => updateTagApi({ id: tag._id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["saves-by-tag", tag._id] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateTag({ name, color });
  };

  if (!isOpen || !tag) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit tag</h2>
          <button className={styles.closeBtn} onClick={onClose}>
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
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTagModal;