import React, { useEffect } from "react";
import Post from "../components/Post";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePosts } from "../hooks/usePosts";
import { formatTimeAgo } from "../../shared/utils/timeAgo";
import { useNavigate } from "react-router-dom";
import "../style/feed.scss";

const Feed = () => {
  const { posts, loading, fetchFeed } = usePosts();
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="feed-container">
      <div
        className="feed-header"
        style={{
          position: "sticky",
          top: "0",
          zIndex: "100",
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          gap: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user?.profileImage && (
            <img
              src={user.profileImage}
              alt={user.username}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #363636",
              }}
            />
          )}
          <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>
            {user?.username}
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/posts")}
            style={{
              background: "#363636",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            My Posts
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "#FF3040",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            postId={post._id}
            username={post.user?.username}
            profileImage={post.user?.profileImage}
            postImage={post.imgUrl}
            caption={post.caption}
            initialLikesCount={post.likesCount || 0}
            initialIsLiked={post.isLiked}
            timeAgo={formatTimeAgo(post.createdAt)}
          />
        ))
      ) : (
        <div className="no-posts">
          {loading ? (
            <h3>Loading feed...</h3>
          ) : (
            <h3>No posts yet. Follow someone to see their posts!</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
