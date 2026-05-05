import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ImageZoomModal.module.scss";

const ImageZoomModal = ({ isOpen, onClose, images, initialIdx = 0 }) => {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setCurrentIdx(initialIdx);
  }, [initialIdx]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomStyle({ display: "none" });
    setIsZooming(false);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoomStyle({ display: "none" });
    setIsZooming(false);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    // Disable zoom for mobile devices (less than 768px)
    if (window.innerWidth < 768) return;

    // Stop zoom if hovering over control buttons
    if (e.target.closest("button")) {
      handleMouseLeave();
      return;
    }
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${images[currentIdx]?.url})`,
    });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
    setIsZooming(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.imageContainer}>
              <div
                ref={containerRef}
                className={styles.mainImageWrapper}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <button className={styles.closeBtn} onClick={onClose}>
                  <X size={20} />
                </button>

                {images.length > 1 && (
                  <>
                    <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
                      <ChevronLeft size={24} />
                    </button>
                    <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <img
                  src={images[currentIdx]?.url}
                  alt="Product view"
                  className={`${styles.baseImage} ${isZooming ? styles.hidden : ""}`}
                />
                <div className={styles.zoomLens} style={zoomStyle} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageZoomModal;
