import { useState, useRef } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axios.instance";
import { useQueryClient } from "@tanstack/react-query";
import styles from "../../features/saves/components/SaveModal.module.scss";

const UploadFileModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleClose = () => {
    setFile(null);
    setNote("");
    setIsUploading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const toastId = toast.loading("Uploading file...");
    setIsUploading(true);

    try {
      // 1. Upload to Supabase
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { url } = uploadRes.data.data;

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isPdf = file.type.includes("pdf");
      
      let saveType = "link";
      if (isImage) saveType = "image";
      else if (isVideo) saveType = "video";
      else if (isPdf) saveType = "pdf";

      // 2. Create Save entry in DB
      await axiosInstance.post("/saves", {
        url,
        note,
        title: file.name,
        thumbnail: isImage ? url : "", // Set thumbnail for images
        type: saveType,
        siteName: "PC Upload",
        processingStatus: "completed"
      });

      toast.success("File uploaded and saved!", { id: toastId });
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["saves"] });
      
      handleClose();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Upload from PC</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Select File</label>
            <div 
              className={styles.fileDropZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className={styles.hiddenInput} 
                hidden
              />
              {file ? (
                <div className={styles.fileInfo}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  <span>{file.name}</span>
                </div>
              ) : (
                <div className={styles.uploadPrompt}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Click to choose a file</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label>Note <span className={styles.optional}>(optional)</span></label>
            <textarea
              placeholder="Add a note about this file..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={1000}
              data-lenis-prevent
            />
            <div className={styles.charCount}>
              {note.length} / 1000
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload & Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFileModal;
