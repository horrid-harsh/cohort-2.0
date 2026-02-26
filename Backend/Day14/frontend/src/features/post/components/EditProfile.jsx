import React, { useState } from "react";
import { IoClose, IoCameraOutline } from "react-icons/io5";
import { useAuth } from "../../auth/hooks/useAuth";
import { updateProfileApi } from "../../auth/services/user.api";
import "../style/edit-profile.scss";

const EditProfile = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("isPrivate", isPrivate);
      if (file) {
        formData.append("profileImage", file);
      }

      const response = await updateProfileApi(formData);
      setUser(response.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
          <h3>Edit Profile</h3>
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>

        <div className="modal-content">
          <div className="image-edit-section">
            <div className="profile-preview">
              <img src={preview} alt="Profile" />
              <label htmlFor="profile-upload" className="camera-overlay">
                <IoCameraOutline size={30} />
              </label>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <p className="change-text">Change profile photo</p>
          </div>

          <div className="form-section">
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="input-group">
              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                maxLength={150}
              />
            </div>

            <div className="input-group toggle-group">
              <div className="toggle-label">
                <label>Private Account</label>
                <span>
                  When your account is private, only people you approve can see
                  your photos and videos.
                </span>
              </div>
              <div
                className={`switch ${isPrivate ? "active" : ""}`}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                <div className="handle"></div>
              </div>
            </div>
            {error && <p className="error-msg">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
