import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { getFeedApi } from "../services/post.api";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/feed.scss";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleLogout } = useAuth();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getFeedApi();
        setPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="feed-container">
      <div
        className="feed-header"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
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
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            username={post.user?.username}
            profileImage={post.user?.profileImage}
            postImage={post.imgUrl}
            caption={post.caption}
            likesCount={post.likesCount || "0"} // You might need a way to fetch actual likes
            timeAgo="Just now" // Simplified for now
          />
        ))
      ) : (
        <div className="no-posts">
          <h3>No posts yet. Follow someone to see their posts!</h3>
        </div>
      )}
    </div>
  );
};

export default Feed;
