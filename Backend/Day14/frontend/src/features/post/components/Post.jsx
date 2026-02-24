import React, { useState } from "react";
import { IoEllipsisHorizontal, IoHeart } from "react-icons/io5";
import { likePostApi, dislikePostApi } from "../services/post.api";
import "../style/post.scss";

// Custom Instagram SVGs
const LikeIcon = ({ filled }) => (
  <svg
    aria-label={filled ? "Unlike" : "Like"}
    fill={filled ? "#FF3040" : "currentColor"}
    height="24"
    role="img"
    viewBox="0 0 24 24"
    width="24"
  >
    <title>{filled ? "Unlike" : "Like"}</title>
    {filled ? (
      <path d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.585 1 13.28 2.226 12 3.447 10.72 2.226 9.415 1 7.328 1 3.755 1 1 3.736 1 7.66Z"></path>
    ) : (
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
    )}
  </svg>
);

const CommentIcon = () => (
  <svg
    aria-label="Comment"
    fill="currentColor"
    height="24"
    role="img"
    viewBox="0 0 24 24"
    width="24"
  >
    <title>Comment</title>
    <path
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    ></path>
  </svg>
);

const ShareIcon = () => (
  <svg
    aria-label="Share"
    fill="currentColor"
    height="24"
    role="img"
    viewBox="0 0 24 24"
    width="24"
  >
    <title>Share</title>
    <path
      d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    ></path>
    <line
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      x1="7.488"
      x2="15.515"
      y1="12.208"
      y2="7.641"
    ></line>
  </svg>
);

const SaveIcon = () => (
  <svg
    aria-label="Save"
    fill="currentColor"
    height="24"
    role="img"
    viewBox="0 0 24 24"
    width="24"
  >
    <title>Save</title>
    <polygon
      fill="none"
      points="20 21 12 13.44 4 21 4 3 20 3 20 21"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    ></polygon>
  </svg>
);

const Post = ({
  postId,
  username,
  profileImage,
  postImage,
  caption,
  timeAgo,
  initialLikesCount,
  initialIsLiked,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [animateLike, setAnimateLike] = useState(false);
  const [showCentralHeart, setShowCentralHeart] = useState(false);

  const triggerPop = () => {
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 400);
  };

  const handleDoubleClick = async () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      triggerPop();
      try {
        await likePostApi(postId);
      } catch (error) {
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    }
    setShowCentralHeart(true);
    setTimeout(() => setShowCentralHeart(false), 800);
  };

  const handleToggleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    if (nextLiked) triggerPop();

    try {
      if (nextLiked) {
        await likePostApi(postId);
      } else {
        await dislikePostApi(postId);
      }
    } catch (error) {
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="header-left">
          <img src={profileImage} alt={username} className="profile-img" />
          <span className="username">{username}</span>
          {timeAgo && <span className="time-ago">{timeAgo}</span>}
        </div>
        <div className="header-right">
          <IoEllipsisHorizontal size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="post-content" onDoubleClick={handleDoubleClick}>
        <div className="post-image-container">
          <div className={`central-heart ${showCentralHeart ? "animate" : ""}`}>
            <IoHeart style={{ fill: "url(#heart-gradient)" }} />
          </div>
          <img src={postImage} alt="Post content" />
        </div>
      </div>

      {/* Actions */}
      <div className="post-actions">
        <div className="actions-left">
          <div
            className={`action-btn ${animateLike ? "pop" : ""}`}
            onClick={handleToggleLike}
          >
            <LikeIcon filled={isLiked} />
          </div>
          <div className="likes-count-text">{likesCount}</div>
          <div className="action-btn">
            <CommentIcon />
          </div>
          <div className="action-btn">
            <ShareIcon />
          </div>
        </div>
        <div className="action-btn save">
          <SaveIcon />
        </div>
      </div>

      {/* Footer / Caption */}
      <div className="post-footer">
        <div className="caption">
          <span className="footer-username">{username}</span>
          <span className="caption-text">{caption}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
