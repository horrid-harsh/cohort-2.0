import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useCreateSave } from "../hooks/useSaves";
import styles from "./SaveModal.module.scss";

const SaveModal = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const { mutate: createSave, isPending, error, reset } = useCreateSave();
  const queryClient = useQueryClient();

  // reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setNote("");
      reset();
    }
  }, [isOpen]);

  // close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    createSave(
      { url, note },
      {
        onSuccess: () => {
          onClose();
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["saves"] });
            queryClient.invalidateQueries({ queryKey: ["saves-by-tag"] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });
          }, 3000);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Save a URL</h2>
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
            <label>URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label>Note <span className={styles.optional}>(optional)</span></label>
            <textarea
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveModal;
