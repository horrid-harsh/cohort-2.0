import React from "react";
import { IoClose } from "react-icons/io5";
import "../style/follow-modal.scss";

const FollowListModal = ({ isOpen, onClose, title, users = [], loading }) => {
  if (!isOpen) return null;

  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div
        className="follow-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className="users-list">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <>
              {users.map((user, index) => (
                <div key={index} className="user-item">
                  <div className="user-info">
                    <div className="avatar">
                      <img
                        src={
                          user.profileImage || "https://via.placeholder.com/150"
                        }
                        alt={user.username}
                      />
                    </div>
                    <div className="details">
                      <span className="username">{user.username}</span>
                      <span className="fullname">{user.fullname}</span>
                    </div>
                  </div>
                  <button
                    className={`action-btn ${title.toLowerCase() === "followers" ? "remove" : "following"}`}
                  >
                    {title.toLowerCase() === "followers"
                      ? "Remove"
                      : "Following"}
                  </button>
                </div>
              ))}
              {users.length === 0 && (
                <p className="no-users">No {title.toLowerCase()} found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
