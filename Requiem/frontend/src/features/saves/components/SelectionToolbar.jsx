import { motion, AnimatePresence } from "framer-motion";
import styles from "./SelectionToolbar.module.scss";

const SelectionToolbar = ({ count, onCancel, onDelete }) => {
  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.toolbar}
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        exit={{ y: 100, opacity: 0, x: "-50%" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        <div className={styles.content}>
          <span className={styles.count}>
            {count} {count === 1 ? "item" : "items"} selected
          </span>
          <div className={styles.divider} />
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button className={styles.deleteBtn} onClick={onDelete}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionToolbar;
