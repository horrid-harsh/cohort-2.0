import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ConfirmationModal.module.scss";
import Button from "./Button";

/**
 * @param {boolean} isOpen - Controls visibility
 * @param {string} title - Modal heading
 * @param {string} message - Descriptive text
 * @param {function} onConfirm - Callback for "Delete"
 * @param {function} onCancel - Callback for "Cancel"
 * @param {boolean} isLoading - Shows loading state on confirm button
 * @param {string} confirmText - Label for confirm button
 * @param {string} cancelText - Label for cancel button
 */
const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  message = "Are you sure you want to remove this item? This action cannot be undone.",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
            onClick={onCancel}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={styles.modalContent}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-message"
          >
            <div className={styles.header}>
              <h2 id="modal-title">{title}</h2>
              <button 
                className={styles.closeIcon} 
                onClick={onCancel} 
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <p id="modal-message" className={styles.message}>
              {message}
            </p>

            <div className={styles.actions}>
              <Button
                variant="ghost"
                onClick={onCancel}
                className={styles.cancelBtn}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                variant="primary"
                onClick={onConfirm}
                className={styles.confirmBtn}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
