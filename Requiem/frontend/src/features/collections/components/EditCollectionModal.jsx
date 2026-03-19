import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axios.instance";
import styles from "../../../components/ui/CreateModal.module.scss";

const EMOJIS = ["📁", "💻", "🎨", "📚", "🎯", "🔬", "💡", "🎵", "🏋️", "🌍"];
const COLORS = ["#7c6af7", "#378ADD", "#1D9E75", "#D85A30", "#D4537E", "#f87171", "#fbbf24", "#4ade80"];

const EditCollectionModal = ({ isOpen, onClose, collection }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📁");
  const [color, setColor] = useState("#7c6af7");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (collection) {
      setName(collection.name || "");
      setDescription(collection.description || "");
      setEmoji(collection.emoji || "📁");
      setColor(collection.color || "#7c6af7");
    }
  }, [collection]);

  const { mutate: updateCollection, isPending, error } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch(`/collections/${collection._id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection", collection._id] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateCollection({ name, description, emoji, color });
  };

  if (!isOpen || !collection) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit collection</h2>
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
          <div className={styles.emojiRow}>
            {EMOJIS.map((e) => (
              <button
                key={e} type="button"
                className={`${styles.emojiBtn} ${emoji === e ? styles.selected : ""}`}
                onClick={() => setEmoji(e)}
              >{e}</button>
            ))}
          </div>

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
            <label>Description <span className={styles.optional}>(optional)</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default EditCollectionModal;