import React from "react";
import { IoClose } from "react-icons/io5";
import "../style/image-modal.scss";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <button className="close-btn" onClick={onClose}>
        <IoClose size={32} />
      </button>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Full Size" />
      </div>
    </div>
  );
};

export default ImageModal;
