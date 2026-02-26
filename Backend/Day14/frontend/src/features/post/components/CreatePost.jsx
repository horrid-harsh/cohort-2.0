import React, { useState } from "react";
import { IoClose, IoImagesOutline } from "react-icons/io5";
import { usePosts } from "../hooks/usePosts";
import "../style/create-post.scss";

const CreatePost = ({ isOpen, onClose, onPostCreated }) => {
  const { createPost } = usePosts();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);

      await createPost(formData);
      if (onPostCreated) onPostCreated();
      onClose();
      // Reset
      setFile(null);
      setPreview("");
      setCaption("");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-post-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
          <h3>Create new post</h3>
          <button
            className="share-btn"
            disabled={!file || loading}
            onClick={handleSubmit}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        <div className="modal-content">
          {!preview ? (
            <div className="upload-container">
              <IoImagesOutline size={96} className="upload-icon" />
              <p>Select photos here</p>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="select-btn">
                Select from computer
              </label>
            </div>
          ) : (
            <div className="preview-container">
              <div className="image-preview">
                <img src={preview} alt="Selected" />
              </div>
              <div className="caption-section">
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
