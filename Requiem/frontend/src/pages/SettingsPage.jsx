import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/auth.store";
import { useUploadAvatar, useDeleteAvatar } from "../features/auth/hooks/useUser";
import styles from "./SettingsPage.module.scss";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef(null);
  
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { mutate: deleteAvatar, isPending: isDeleting } = useDeleteAvatar();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to remove your profile picture?")) {
      deleteAvatar();
    }
  };

  return (
    <div className={styles.settingsPage}>
      <header className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your account settings and preferences.</p>
      </header>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Account Profile
        </h2>

        <div className={styles.profileGrid}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <label 
                className={styles.uploadOverlay} 
                onClick={handleUploadClick}
                title="Change Avatar"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*"
                  disabled={isUploading}
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </label>
            </div>

            <div className={styles.avatarActions}>
              <h3>Profile Picture</h3>
              <p>Upload a square image for best results.</p>
              <div className={styles.actionBtns}>
                <button 
                  className={styles.uploadBtn} 
                  onClick={handleUploadClick}
                  disabled={isUploading || isDeleting}
                >
                  {isUploading ? "Uploading..." : "Upload New"}
                </button>
                {user?.avatar && (
                  <button 
                    className={styles.removeBtn} 
                    onClick={handleDeleteClick}
                    disabled={isUploading || isDeleting}
                  >
                    {isDeleting ? "Removing..." : "Remove"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input type="text" value={user?.name || ""} readOnly disabled />
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" value={user?.email || ""} readOnly disabled />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Account Security
        </h2>
        <p style={{ color: '#555', fontSize: '14px', fontStyle: 'italic' }}>
          Password management and 2FA features are coming soon.
        </p>
      </section>
    </div>
  );
};

export default SettingsPage;
